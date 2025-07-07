const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/userModel");
const BlacklistedToken = require("../Models/BlacklistedToken");

/**
 * Authentication Controller
 * 
 * Handles user authentication, registration, logout, and token validation.
 * Implements JWT-based authentication with secure password hashing and
 * token blacklisting for logout functionality.
 */

/**
 * User Login Handler
 * 
 * Authenticates user credentials and issues a JWT token upon successful login.
 * Performs password verification using bcrypt and creates a session token.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with token or error message
 */
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Input validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required!"
      });
    }

    // Find user by username (case-insensitive)
    const user = await User.findOne({ 
      username: username.toLowerCase().trim() 
    });

    // Verify user exists and password is correct
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials!"
      });
    }

    // Generate JWT token with user information
    const token = jwt.sign(
      { 
        username: user.username,
        userId: user._id,
        role: user.role 
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Return success response with token
    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        phone: user.phone,
        aboutUser: user.aboutUser,
        createdAt: user.createdAt,
        settings: user.settings
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login"
    });
  }
};

/**
 * User Registration Handler
 * 
 * Creates a new user account with validated input data.
 * Performs comprehensive validation including duplicate checks,
 * password hashing, and role validation.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success or error message
 */
const signup = async (req, res) => {
  const { username, password, role, firstName, lastName, email, gender } = req.body;

  try {
    // Comprehensive input validation
    if (!username || !password || !role || !firstName || !lastName || !email || !gender) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!"
      });
    }

    // Validate role
    if (role !== "user" && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Role must be either 'user' or 'admin'"
      });
    }

    // Validate gender
    if (gender !== "male" && gender !== "female") {
      return res.status(400).json({
        success: false,
        message: "Gender must be either 'male' or 'female'"
      });
    }

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    // Check for existing username (case-insensitive)
    const existingUser = await User.findOne({
      username: username.toLowerCase().trim()
    });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already exists!"
      });
    }

    // Check for existing email (case-insensitive)
    const existingEmail = await User.findOne({ 
      email: email.toLowerCase().trim() 
    });
    
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already in use!"
      });
    }

    // Hash password with salt rounds
    const saltRounds = 12;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // Create new user instance
    const newUser = new User({
      username: username.toLowerCase().trim(),
      password: hashedPassword,
      role,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      gender,
      createdAt: new Date(),
      isActive: true
    });

    // Save user to database
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully"
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during registration"
    });
  }
};

/**
 * User Logout Handler
 * 
 * Invalidates the current JWT token by adding it to the blacklist.
 * Ensures the token cannot be used for future requests.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success or error message
 */
const logout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "No token provided" 
    });
  }

  try {
    // Verify token is valid before blacklisting
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    if (!decodedToken || !decodedToken.exp) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token format" 
      });
    }

    // Check if token has already expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      return res.status(401).json({ 
        success: false,
        message: "Token has already expired" 
      });
    }

    // Create blacklisted token entry
    const expiresAt = new Date(decodedToken.exp * 1000);
    const blacklistedToken = new BlacklistedToken({
      token,
      expiresAt: expiresAt,
      blacklistedAt: new Date()
    });

    await blacklistedToken.save();

    res.status(200).json({ 
      success: true,
      message: "Logout successful" 
    });

  } catch (error) {
    console.error("Logout error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token" 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Internal server error during logout" 
    });
  }
};

/**
 * Token Validation Handler
 * 
 * Validates JWT token by checking if it's blacklisted and verifying
 * its signature and expiration. Used for protecting routes.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with validation result
 */
const checkToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "No token provided" 
    });
  }

  try {
    // Check if token is blacklisted
    const blacklistedToken = await BlacklistedToken.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ 
        success: false,
        message: "Access denied. Token is blacklisted." 
      });
    }

    // Verify token signature and expiration
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Fetch complete user data from database
    const user = await User.findById(decodedToken.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    res.status(200).json({ 
      success: true,
      message: "Token is valid",
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        phone: user.phone,
        aboutUser: user.aboutUser,
        createdAt: user.createdAt,
        settings: user.settings
      }
    });

  } catch (error) {
    console.error("Token validation error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token" 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: "Token has expired" 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Internal server error during token validation" 
    });
  }
};

module.exports = {
  login,
  signup,
  logout,
  checkToken
};
