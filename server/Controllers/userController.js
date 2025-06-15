const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { loadUsers, saveUsers } = require("../Users");
require("dotenv").config();

const getAllUsers = (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const users = loadUsers();
    // Check if the user has admin role
    const user = users.find((u) => u.username === decoded.username);
    if (!user || user.role !== "admin") {
      return res.status(403).send("Access forbidden. Admins only.");
    }
    res.json(loadUsers());
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};

const login = (req, res) => {
  const { username, password, role } = req.body;
  const user = loadUsers().find((u) => u.username === username);

  if (
    !user ||
    !bcrypt.compareSync(password, user.password) ||
    user.role !== role
  ) {
    return res.status(401).send("Invalid credentials");
  }

  const token = jwt.sign(
    { username: user.username },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );
  res.json({ token });
};

const signup = (req, res) => {
  const { username, password, role } = req.body;
      
      if (loadUsers().find(u => u.username === username)) {
          return res.status(400).send('User already exists');
      }
      
      const salt = bcrypt.genSaltSync(10);
      if (!username || !password || !role) {
          return res.status(400).send('Username, password, and role are required');
      }
      if (role !== 'user' && role !== 'admin') {
          return res.status(400).send('Role must be either "user" or "admin"');
      }
      const hashedPassword = bcrypt.hashSync(password, salt);
  
      if (!hashedPassword) {
          return res.status(500).send('Error hashing password');
      }
      const newUsers = loadUsers();
      newUsers.push({ username, password: hashedPassword, role });
      saveUsers(newUsers); // Save users to the JSON file after adding a new user
      
      res.status(201).send('User created successfully');
};

const deleteUser = (req, res) => {
    const { username, password, role } = req.body;
      const token = req.headers['authorization']?.split(' ')[1];
    
      if (!token) {
        return res.status(401).send('Access denied. No token provided.');
      }
      if (!username || !password || !role) {
        return res.status(400).send('Username, password, and role are required');
      }
      if (role !== 'user' && role !== 'admin') {
        return res.status(400).send('Role must be either "user" or "admin"');
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const tokenUser = loadUsers().find(u => u.username === decoded.username);
        if (tokenUser.username != username) {
          return res.status(403).send('Someone else\'s account cannot be deleted');
        }
      } catch (ex) {
        return res.status(400).send('Invalid token.');
      }
      const users = loadUsers();
      const user = users.find(u => u.username === username);
      
      if (!user || !bcrypt.compareSync(password, user.password) || user.role !== role) {
        return res.status(401).send('Invalid credentials');
      }
      const index = users.indexOf(user);
      if (index > -1) {
        users.splice(index, 1);
        res.send('User deleted successfully');
        saveUsers(users); // Save users to the JSON file after deleting a user
      } else {
        res.status(404).send('User not found');
      }
}

const deleteUserByAdmin = (req, res) => {
    const { username } = req.body;
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }
  const users = loadUsers();
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return res.status(404).send('User not found');
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const tokenUser = users.find(u => u.username === decoded.username);
    // Check if the user has admin role
    if (tokenUser.role !== 'admin') {
      return res.status(403).send('Access forbidden. Admins only.');
    }

    if (tokenUser.username == user.username) {
      return res.status(403).send('You cannot delete yourself');
    }
    
    const index = users.indexOf(user);
    if (index > -1) {
      users.splice(index, 1);
      saveUsers(users); // Save users to the JSON file after deleting a user
      res.send('User deleted successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
}

module.exports = {
  getAllUsers,
  login,
  signup,
  deleteUser,
  deleteUserByAdmin
};
