const mongoose = require("mongoose");

/**
 * User Schema
 * 
 * Defines the structure and validation rules for user data in the application.
 * Includes comprehensive user information with proper validation and defaults.
 */
const userSchema = new mongoose.Schema({
  /** Username - unique identifier for login */
  username: { 
    type: String, 
    required: true, 
    lowercase: true, 
    unique: true 
  },
  
  /** Hashed password for authentication */
  password: { 
    type: String, 
    required: true 
  },
  
  /** User role for access control */
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    required: true 
  },
  
  /** Account creation timestamp */
  createdAt: { 
    type: Date, 
    default: Date.now, 
    immutable: true, 
    required: true 
  },
  
  /** User's first name */
  firstName: { 
    type: String, 
    required: true 
  },
  
  /** User's last name */
  lastName: { 
    type: String, 
    required: true 
  },
  
  /** User's email address */
  email: { 
    type: String, 
    lowercase: true, 
    unique: true, 
    sparse: true, 
    required: true 
  },
  
  /** User's gender */
  gender: { 
    type: String, 
    enum: ["male", "female"], 
    required: true 
  },
  
  /** User's phone number (optional) */
  phone: { 
    type: String, 
    default: "" 
  },
  
  /** User's bio/about information */
  aboutUser: { 
    type: String, 
    default: "" 
  },
  
  /** User's profile picture (binary data) */
  profilePicture: {
    type: Buffer,
  },
  
  /** User preferences and settings */
  settings: {
    /** Newsletter subscription preference */
    newsletter: { 
      type: Boolean, 
      default: false 
    },
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
