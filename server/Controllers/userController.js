const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/userModel");

const deleteUser = async (req, res) => {
  const { username } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1];

  try {
    if (!token) {
      throw new Error("Access denied. No token provided.");
    }
    if (!username) {
      throw new Error("Username is required to delete user!");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const tokenUser = await User.findOne({
      username: decoded.username.toLowerCase(),
    });
    if (!tokenUser) {
      throw new Error("User not found!");
    }
    if (tokenUser.username != username.toLowerCase()) {
      throw new Error("You can only delete your own account!");
    }
    // If the user is the only admin, prevent deletion
    const adminCount = await User.countDocuments({ role: "admin" });
    if (tokenUser.role === "admin" && adminCount <= 1) {
      throw new Error("Cannot delete the only admin user!");
    }
    // No need to check password, JWT token already verifies the user
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
    return res.status(400).json({
      success: false,
      message: "Error deleting user!",
      error: ex.message,
    });
  }
};

module.exports = {
  deleteUser,
};
