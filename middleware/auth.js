//auth, isStudent, isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try {
        //extract JWT
        const token = req.body.token;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"token missing",
            });
        }

        //verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT.SECRET);
            req.user = decode;
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Invalid Token",
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: true,
            message:"Kuch toh gadbad hai",
        });
    }
}

exports.isStudent = (req, res, next) =>{
    try {
        if(!req.user.role != "Student"){
            return res.status(401).json({
                success:false,
                message:"This is Protected Students", 
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
                success:false,
                message:"User role not match", 
            });
    }
}

exports.isAdmin = (req, res, next) =>{
    try {
        if(!req.user.role != "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is Protected Admin", 
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
                success:false,
                message:"User role not match", 
            });
    }
}