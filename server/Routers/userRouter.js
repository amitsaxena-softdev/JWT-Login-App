const express = require('express');
const router = express.Router();
const { login, signup, deleteUser } = require('../Controllers/userController');

router.post('/login', login);

router.post('/signup', signup);

router.post('/deleteUser', deleteUser);

router.get('/', (req, res) => {
  res.send('This is the User Router!');
}
);

module.exports = router;
  