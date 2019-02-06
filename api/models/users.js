/* eslint-disable no-useless-escape */
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeModel' },
  name: {
    type: String,
    minlength: 2,
    maxlength: 20,
    required: [true, 'A Name is required'],
  },
  email: {
    type: String,
    required: [true, 'An Email is required'],
    minlength: 6,
    maxlength: 60,
    unique: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  password: {
    type: String,
    required: [true, 'A Password is required'],
  },
  userImage: {
    type: String,
  },
});

module.exports = mongoose.model('UserModel', userSchema);
