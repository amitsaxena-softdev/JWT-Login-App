const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { loadUsers, saveUsers } = require('../Users'); 
require('dotenv').config();

router.get('/getAllUsers', (req, res) => {
  res.json(loadUsers());
});

router.post('/login', (req, res) => {
  const { username, password, role } = req.body;
  const user = loadUsers().find(u => u.username === username);
  
  if (!user || !bcrypt.compareSync(password, user.password) || user.role !== role) {
    return res.status(401).send('Invalid credentials');
  }

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

router.post('/signup', (req, res) => {
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
});

// Deleting a user
router.post('/deleteUser', (req, res) => {
  const { username, password, role } = req.body;
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
});

router.get('/', (req, res) => {
  res.send('This is the User Router!');
}
);

module.exports = router;
  