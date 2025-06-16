const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], required: true },
  createdAt: { type: Date, default: Date.now, immutable: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, lowercase: true, unique: true, sparse: true, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  phone: { type: String, default: "" },
  aboutUser: { type: String, default: "" },
  profilePicture: {
    type: Buffer,
  },
  settings: {
    newsletter: { type: Boolean, default: false },
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
