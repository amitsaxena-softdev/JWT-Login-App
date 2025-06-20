const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUserByAdmin } = require('../Controllers/adminController');

router.get('/getAllUsers', getAllUsers);

router.delete('/deleteUserByAdmin', deleteUserByAdmin);

router.get('/', (req, res) => {
  res.send('This is the Admin Router!');
}
);

module.exports = router;
  