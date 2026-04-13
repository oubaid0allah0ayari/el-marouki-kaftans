const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUsers } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/users', getUsers);

module.exports = router;
