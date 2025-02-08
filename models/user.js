// const { string, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    // fullName: { type: String, required: true },  // This field should exist
    email: { type: String, required: true, unique: true },
    // password: { type: String, required: true }
  });
  
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);