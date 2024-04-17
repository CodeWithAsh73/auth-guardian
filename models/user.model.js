const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  city:{
    type:String,
    required:true
  },
  state:{
    type:String,
    required:true
  },
  isAdmin:{
    type:Boolean,
    default:false
  },

  isVerified:{
    type:Boolean,
    default:false
  },
  isActive:{
    type:Boolean,
    default:true

  },
  role:{
    type:String,
    enum:['user', 'admin'],
    default:'user'
  }
},{timestamps:true});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.createEmailVerificationToken = function () {
  const payload = {_id:this._id};
  const verificationToken = jwt.sign(payload, process.env.SECRET_TOKEN, {
    expiresIn:'30m'
  })
  return verificationToken;
};
userSchema.methods.generateLoginToken= function (){
  const payload = {_id:this._id};
  const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
    expiresIn: "2d" 
  });
  return token;
};

//toDo create password reset token
userSchema.methods.generatePasswordResetToken= function (){
  const payload = {_id:this._id};
  const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
    expiresIn: "30m" 
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

//Export the model
module.exports = mongoose.model("User", userSchema);
