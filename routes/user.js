const express = require("express");
const router = express.Router();

const {login, signup} = require("../controllers/auth");
const {auth, isStudent, isAdmin} = require("../middleware/auth")

router.post("/login", login);
router.post("/signup", signup);
router.post("/test", signup);

//testing route
router.get("/test", auth,(req, res) => {
   res.json({
        success:true,
        message:"Welcome to protected test",
    }); 
})
//protected route
router.get("/student", auth, isStudent, (req, res) => {
    res.json({
        success:true,
        message:"Welcome to protected Student",
    });
})

router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success:true,
        message:"Welcome to protected Admin",
    });
});
module.exports = router;