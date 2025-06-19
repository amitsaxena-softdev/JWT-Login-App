const express = require('express');
const router = express.Router();
const { deleteUser } = require('../Controllers/userController');

router.post('/deleteUser', deleteUser);

router.get('/', (req, res) => {
  res.send('This is the User Router!');
}
);

module.exports = router;
  