const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/users');


exports.signUp = (req, res) => {
  UserModel.find({ email: req.body.email })
    .exec()
    .then((userFound) => {
      if (userFound.length > 0) {
        res.status(409).json({ error: 'This email is already registered' });
      } else {
        bcrypt.hash(req.body.password, 10, (error, hashedPassword) => {
          if (error) {
            return res.status(500).json({ error });
          }
          const user = new UserModel({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
          });
          user
            .save()
            .then((result) => {
              res.status(201).json({
                message: 'User created',
                user: {
                  _id: result.id,
                  name: req.body.name,
                  email: req.body.email,
                },
              });
            })
            .catch((err) => {
              res.status(500).json({ error: err });
            });
        });
      }
    })
    .catch();
};

exports.Login = (req, res) => {
  UserModel.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({ message: 'Incorrect details. Please check and try again.' });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({ message: 'Incorrect details. Please check and try again.' });
        }
        if (result) {
          const token = jwt.sign({ email: user.email, userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1hr' });
          return res.status(200).json({
            message: 'User Logged In.',
            username: user.name,
            token,
          });
        }
        return res.status(401).json({ message: 'Incorrect details. Please check and try again.' });
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Login Failed. Please check your details and try again.',
        error,
      });
    });
};

exports.uploadImage = (req, res) => {
  UserModel.findByIdAndUpdate({ _id: req.userData.userId },
    { $set: { userImage: req.file.path } })
    .exec()
    .then(() => {
      res.status(200).json({ message: 'User Image Uploaded' });
    })
    .catch(() => {
      res.status(500).json({ message: 'An error occured, try again.' });
    });
};

exports.getUsers = (req, res) => {
  UserModel.find()
    .select('_id name userImage')
    .exec()
    .then((results) => {
      res.status(200).json({ count: results.length, results });
    })
    .catch(() => {
      res.status(500).json({ message: 'An error occured, try again.' });
    });
};

exports.searchUsers = async (req, res) => {
  const searchValues = await req.params.searchValue.split('+');
  const response = [];
  await searchValues.forEach((item) => {
    response.push({ name: new RegExp(item, 'gi') });
  });

  UserModel.find({ $or: response })
    .select('_id name userImage')
    .exec()
    .then((result) => {
      if (result.length > 0) {
        res.status(200).json({
          totalCount: result.length,
          result,
        });
      } else {
        res.status(200).json({ message: 'No users available. Try other keywords' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'An error occured while fetching data' });
    });
};

exports.followUser = (req, res) => {
  UserModel.update(
    { _id: req.userData.userId },
    { $addToSet: { following: req.params.userId } },
    (errors, results) => {
      if (results) {
        res.status(200).json({ message: 'You are now following this user', results });
      } else {
        res.status(500).json({ message: 'An error occured, try again.', errors });
      }
    },
  );
};

exports.unfollowUser = (req, res) => {
  UserModel.update(
    { _id: req.userData.userId },
    { $pullAll: { following: [req.params.userId] } },
    (errors, results) => {
      if (results) {
        res.status(200).json({ message: 'You unfollowed this user', results });
      } else {
        res.status(500).json({ message: 'An error occured, try again.', errors });
      }
    },
  );
};

exports.followersCount = (req, res) => {
  UserModel.find({ following: [req.params.userId] })
    .select('_id userImage name')
    .exec()
    .then(async (docs) => {
      await UserModel.findById(req.params.userId, (errors, result) => {
        if (result) {
          res.status(200).json({
            followers: docs,
            following: result.following,
          });
        } else {
          res.status(500).json({
            message: 'An error occured, try again.',
            errors,
          });
        }
      });
    })
    .catch(() => {
      res.status(500).json({ message: 'An error occured, try again.' });
    });
};

exports.singleUser = (req, res) => {
  UserModel.findById(req.params.userId)
    .select('_id name userImage')
    .exec()
    .then((result) => {
      res.status(200).json({ user: result });
    })
    .catch(() => {
      res.status(500).json({ message: 'An error occured, try again.' });
    });
};
