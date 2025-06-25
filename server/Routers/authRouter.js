const express = require('express');
const router = express.Router();
const { login, signup, logout, checkToken } = require('../Controllers/authController');

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.get('/checkToken', checkToken);

router.get('/', (req, res) => {
  res.send('This is the Authentication Router!');
}
);

module.exports = router;
  