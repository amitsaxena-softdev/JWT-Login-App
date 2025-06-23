const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/userModel");
const BlacklistedToken = require("../Models/BlacklistedToken");

const getAllUsers = async (req, res) => {
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
    // Decode the token to get the username
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const existingUser = await User.findOne({
      username: decoded.username.toLowerCase(),
    });
    // Check if the user has admin role
    if (!existingUser || existingUser.role !== "admin") {
      throw new Error("Access forbidden. Admins only!");
    }
    const users = await User.find({}).select("-password"); // Exclude password from the response
    res.json({
      success: true,
      message: "Users fetched successfully",
      users,
      error: null,
    }); // Exclude password from the response
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
