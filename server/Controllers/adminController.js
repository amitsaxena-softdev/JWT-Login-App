const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/userModel");
const BlacklistedToken = require("../Models/BlacklistedToken");

/**
 * Admin Controller
 * 
 * Handles administrative operations including user management,
 * user retrieval, and administrative actions. All endpoints require
 * admin-level authentication and authorization.
 */

/**
 * Get All Users Handler
 * 
 * Retrieves all users from the database for admin management.
 * Requires admin role authentication and excludes password fields.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with users array or error message
 */
const getAllUsers = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  try {
    // Validate token presence
    if (!token) {
      throw new Error("Access denied. No token provided.");
    }

    // Check if token is blacklisted
    const blacklistedToken = await BlacklistedToken.findOne({ token });
    if (blacklistedToken) {
      throw new Error("Access denied. Token is blacklisted.");
    }

    // Verify token and extract user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const existingUser = await User.findOne({
      username: decoded.username.toLowerCase(),
    });

    // Verify admin role
    if (!existingUser || existingUser.role !== "admin") {
      throw new Error("Access forbidden. Admins only!");
    }

    // Retrieve all users excluding password fields
    const users = await User.find({}).select("-password");

    res.json({
      success: true,
      message: "Users fetched successfully",
      data: users,
      error: null,
    });

  } catch (ex) {
    res.status(400).json({
      success: false,
      message: "Error fetching users",
      users: null,
      error: ex.message,
    });
  }
};

const deleteUserByAdmin = async (req, res) => {
  const { userId } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1];

  try {
    if (!token) {
      throw new Error("Access denied. No token provided.");
    }
    // Verify the token
    const blacklistedToken = await BlacklistedToken.findOne({ token });
    if (blacklistedToken) {
      throw new Error("Access denied. Token is blacklisted.");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const tokenUser = await User.findOne({
      username: decoded.username.toLowerCase(),
    });
    if (!tokenUser || tokenUser.role !== "admin") {
      throw new Error("Access forbidden. Admins only!");
    }
    if (!userId) {
      throw new Error("UserID of to be deleted user is required!");
    }

    if (tokenUser._id == userId) {
      throw new Error("You cannot delete your own account as an admin!");
    }

    User.deleteOne({ _id: userId })
      .then(() => {
        res.status(200).json({
          message: "User deleted successfully",
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          message: err.message,
        });
      });
  } catch (ex) {
    res.status(400).json({
      message: ex.message,
    });
  }
};

module.exports = {
  getAllUsers,
  deleteUserByAdmin,
};
