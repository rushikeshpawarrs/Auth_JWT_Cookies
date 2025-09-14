const bcrypt = require("bcrypt");
const User  = require("../model/User");
const e = require("express");
const jwt = require("jsonwebtoken");


//signup controller
exports.signup = async (req, res) => {
    try {
        //get user input
        const {name, email, password, role} = req.body;
        //user already exists
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success: false, 
                message: "User already exists"});    
        }
        //secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err){
            return res.status(500).json({
                success: false,
                message: "Error in hashing password"
            });
        }
        //create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });
        return res.status(200).json({
            success: true,
            message: "User created successfully",
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "user cannot be registered",
        });
    }
}; 

//login controller
exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
        //validate user input
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please provide all the details",
            });
        }
        //check if user exists
        const user = await User.findOne({email});
        //if user not found
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found, please signup",
            });
        }
        const payload = {
            email:user.email,
            id:user._id,
            role:user.role
        };
        //verify password and generate JWT token
        if(await bcrypt.compare(password, user.password)){
            //password match
            let token = jwt.sign({payload}, process.env.JWT_SECRET, {expiresIn: "2h"});
            user.token = token;
            user.password = undefined;
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:"User logged in Successfully",
            });
        }
        else{
            //password do not match
            return res.status(403).json({
                success: false,
                message: "Incorrect password",
            });
        }

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "login fail",
        });
    }
}