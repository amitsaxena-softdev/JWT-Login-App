const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/userModel");

const getUserProfile = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  try {
    if (!token) {
      throw new Error("Access denied. No token provided.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ username: decoded.username.toLowerCase() }).select("-password");

    if (!user) {
      throw new Error("User not found!");
    }

    res.status(200).json({
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (ex) {
    return res.status(400).json({
      message: ex.message,
      error: ex.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  try {
    if (!token) {
      throw new Error("Access denied. No token provided.");
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const tokenUser = await User.findOne({
      username: decoded.username.toLowerCase(),
    });
    if (!tokenUser) {
      throw new Error("User not found!");
    }
    // If the user is the only admin, prevent deletion
    const adminCount = await User.countDocuments({ role: "admin" });
    if (tokenUser.role === "admin" && adminCount <= 1) {
      throw new Error("Cannot delete the only admin user!");
    }
    // No need to check password, JWT token already verifies the user
    User.deleteOne({ username: tokenUser.username.toLowerCase() })
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
    return res.status(400).json({
      message: ex.message,
    });
  }
};

module.exports = {
  deleteUser,
  getUserProfile
};
