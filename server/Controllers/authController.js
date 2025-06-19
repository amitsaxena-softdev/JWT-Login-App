const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/userModel");

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      throw new Error("Username and password are required!");
    }
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      // Raising an exception with a messsage with status code 401
      throw new Error("Invalid credentials!");
    }

    // Creating JWT token. The token will contain the username and will be signed with the secret key
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Sending the token in the response
    res.status(200).json({
      message: "Login successful!",
      token,
    });
  } catch (err) {
    // If there is an error while logging in, we will send a 500 status code
    res.status(401).json({
      message: err.message,
    });
  }
};

const signup = async (req, res) => {
  const { username, password, role, firstName, lastName, email, gender } =
    req.body;

  try {
    // Validate the input data
    if (
      !username ||
      !password ||
      !role ||
      !firstName ||
      !lastName ||
      !email ||
      !gender
    ) {
      throw new Error("All fields are required!");
    }
    if (role !== "user" && role !== "admin") {
      throw new Error("Role must be either user or admin");
    }
    if (gender != "male" && gender != "female") {
      throw new Error("Gender must be either male or female!");
    }

    // Check if the user already exists
    const existingUser = await User.findOne({
      username: username.toLowerCase(),
    });
    if (existingUser) {
      throw new Error("User already exists!");
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      throw new Error("Email already in use!");
    }

    // Hash the password before saving it to the database
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a new user instance and save it to the database
    const newUser = new User({
      username: username.toLowerCase(),
      password: hashedPassword,
      role,
      createdAt: new Date(),
      firstName,
      lastName,
      email: email?.toLowerCase(),
      gender,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "User created successfully",
      error: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: err.message,
    });
  }
};

module.exports = {
  login,
  signup
};
