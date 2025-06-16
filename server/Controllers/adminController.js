const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/userModel");

const getAllUsers = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  try {
    if (!token) {
      throw new Error("Access denied. No token provided.");
    }
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
  const { username } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1];

  try {
    if (!token) {
      throw new Error("Access denied. No token provided.");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const tokenUser = await User.findOne({
      username: decoded.username.toLowerCase(),
    });
    if (!tokenUser || tokenUser.role !== "admin") {
      throw new Error("Access forbidden. Admins only!");
    }
    if (!username) {
      throw new Error("Username of to be deleted user is required!");
    }

    if (tokenUser.username == username) {
      throw new Error("You cannot delete your own account as an admin!");
    }

    User.deleteOne({ username: username.toLowerCase() })
      .then(() => {
        res.status(200).json({
          success: true,
          message: "User deleted successfully",
          error: null,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          success: false,
          message: "Error deleting user",
          error: err.message,
        });
      });
  } catch (ex) {
    res.status(400).json({
      success: false,
      message: "Invalid token or error deleting user",
      error: ex.message,
    });
  }
};

module.exports = {
  getAllUsers,
  deleteUserByAdmin,
};
