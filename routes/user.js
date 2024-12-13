const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")
router.get('/signup',(req,res)=>{
    res.render("users/signup.ejs");
});

router.post('/signup',wrapAsync(async(req,res)=>{
    try{
        let{username,email,password}= req.body;
    const newUser = new User({email , username});
    let registerdUser = await User.register(newUser,password);
    console.log(registerdUser);
    req.login(registerdUser,(err)=>{// if passport work fine apply this
        if(err){
            return next(err);
        }
        req.flash("success","User Registerd Successfully!");
        res.redirect("/listings");
     })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}));
// GET login page
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// POST login authentication with Passport.js
router.post(
    "/login", saveRedirectUrl,
     passport.authenticate("local", {
        failureRedirect: '/login', // Redirect on failure
       failureFlash: true // Enable flash messages for failure
    }),
    async (req, res) => {
        // Flash a success message once the user is authenticated
        req.flash("success", "Welcome to Nestly! You are logged in!");
        let redirectUrl = res.locals.redirectUrl || '/listings';
        res.redirect(redirectUrl); // Redirect to listings after successful login
    }
);
router.get('/logout',(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are successfully logged out!");
        res.redirect("/listings");
    })
})

module.exports = router;