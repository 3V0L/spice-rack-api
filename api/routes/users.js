const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const router = express.Router();

const UserModel = require('../models/users');

router.post('/signup', (req, res) => {
  UserModel.find({ email: req.body.email })
    .exec()
    .then((userFound) => {
      if (userFound.length > 0) {
        res.status(409).json({ error: 'This email is already registered' });
      } else {
        // eslint-disable-next-line consistent-return
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
});

router.delete('/remove/:userId', (req, res) => {
  UserModel.remove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      result.status(200).json({ message: 'The User has been deleted' });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'An error occured while deleting the user. Please try again.',
        error,
      });
    });
});


module.exports = router;
