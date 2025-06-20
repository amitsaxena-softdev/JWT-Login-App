const express = require('express');
const router = express.Router();
const { deleteUser, getUserProfile } = require('../Controllers/userController');
const { get } = require('mongoose');

router.get('/profile', getUserProfile);
router.delete('/deleteUser', deleteUser);

router.get('/', (req, res) => {
  res.send('This is the User Router!');
}
);

module.exports = router;
