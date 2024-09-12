const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");


router.get('/signup',(req,res)=>{
    res.render("users/signup.ejs");
});

router.post('/signup',wrapAsync(async(req,res)=>{
    try{
        let{username,email,password}= req.body;
    const newUser = new User({email , username});
    let registerdUser = await User.register(newUser,password);
    console.log(registerdUser);
    req.flash("success","User Registerd Successfully!");
    res.redirect(`/listings`);
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}));
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");

});
router.post(
    "/login",
    passport.authenticate("local",{
        failureRedirect:'/login',
         failureFlash: true
        }),
       wrapAsync(async(req,res)=>{
    req.flash("success","Welcome to Nestly You are loggedin!");
    res.redirect(`/listings`);
}));

module.exports = router;