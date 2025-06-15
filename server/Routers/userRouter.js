const express = require('express');
const router = express.Router();
const { getAllUsers, login, signup, deleteUser, deleteUserByAdmin } = require('../Controllers/userController');

router.get('/getAllUsers', getAllUsers);

router.post('/login', login);

router.post('/signup', signup);

router.post('/deleteUser', deleteUser);

router.post('/deleteUserByAdmin', deleteUserByAdmin);

router.get('/', (req, res) => {
  res.send('This is the User Router!');
}
);

module.exports = router;
  