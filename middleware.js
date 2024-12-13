const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema ,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create new listing!");
        return res.redirect("/login");
      }
      next();
}
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
      res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
//mongodb+srv://rishaubkumar534:<db_password>@cluster0.roowj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
module.exports.isOwner = async (req,res,next)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) { 
  req.flash("error", "You are not the Owner of the Property!");
  return res.redirect(`/listings/${id}`);
}
next();
}
module.exports.validatelisting = (req,res,next)=>{
  let {error} =  listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
   throw new ExpressError(400,errMsg);
 }else{
  next();
 }
}
module.exports.validateReview = (req,res,next)=>{
  let {error} =  reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
   throw new ExpressError(400,errMsg);
 }else{
  next();
 }
}
module.exports.isReviewAuthor = async (req,res,next)=>{
  let { id ,reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) { 
  req.flash("error", "You are not the Author of this review !");
  return res.redirect(`/listings/${id}`);
}
next();
}