const express = require('express');

const router = express.Router();

const UserController = require('../controllers/users');
const checkAuth = require('../helpers/middlewares');
const imageUpload = require('../helpers/imageUpload');

router.post('/signup', UserController.signUp);

router.post('/login', UserController.Login);

router.delete('/remove/:userId', UserController.deleteUser);

router.post('/userImage', checkAuth, imageUpload.single('userImage'), UserController.uploadImage);

router.get('/users', checkAuth, UserController.getUsers);

router.get('/user/:searchValue', checkAuth, UserController.searchUsers);

router.patch('/follow/:userId', checkAuth, UserController.followUser);

router.patch('/unfollow/:userId', checkAuth, UserController.unfollowUser);

router.get('/follow-count/:userId', checkAuth, UserController.followersCount);

router.get('/single-user/:userId', checkAuth, UserController.singleUser);

module.exports = router;
