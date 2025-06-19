const express = require('express');
const router = express.Router();
const { login, signup } = require('../Controllers/authController');

router.post('/login', login);
router.post('/signup', signup);

router.get('/', (req, res) => {
  res.send('This is the Authentication Router!');
}
);

module.exports = router;
  