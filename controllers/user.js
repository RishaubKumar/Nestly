const Listing = require("../models/listing");
const Booking = require('../models/booking');
const User = require("../models/user");
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signUp = async(req,res)=>{
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
    
}
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}
module.exports.login = async (req, res) => {
    // Flash a success message once the user is authenticated
    req.flash("success", "Welcome to Nestly! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl); // Redirect to listings after successful login
}
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are successfully logged out!");
        res.redirect("/listings");
    })
}
exports.renderUserDashboard = async (req, res) => {
    try {
      // Fetch bookings for the logged-in user and populate the property field
      const bookings = await Booking.find({ user: req.user._id }).populate('property');
      res.render('userDashboard', { bookings });  // Pass the bookings variable to the view
    } catch (error) {
      console.error("Error fetching user dashboard:", error);
      req.flash("error", "Unable to fetch bookings.");
      res.redirect("back");
    }
  };