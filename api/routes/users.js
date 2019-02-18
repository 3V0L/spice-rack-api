const express = require('express');

const router = express.Router();

const UserController = require('../controllers/users');
const checkAuth = require('../helpers/middlewares');
const imageUpload = require('../helpers/imageUpload');

router.post('/signup', UserController.signUp);

router.post('/login', UserController.Login);

router.delete('/remove/:userId', UserController.deleteUser);

router.post('/userImage', checkAuth, imageUpload.single('userImage'), UserController.uploadImage);

module.exports = router;
