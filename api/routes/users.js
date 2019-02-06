const express = require('express');

const router = express.Router();

const UserController = require('../controllers/users');

router.post('/signup', UserController.signUp);

router.post('/login', UserController.Login);

router.delete('/remove/:userId', UserController.deleteUser);


module.exports = router;
