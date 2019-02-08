const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecipeModel',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'UserModel',
  },
  title: {
    type: String,
    minlength: 4,
    maxlength: 30,
    required: [true, 'Title is a required string field'],
  },
  ingredients: {
    type: String,
    minlength: 4,
    maxlength: 60,
    required: [true, 'Ingredients are a required comma separated field'],
  },
  time: {
    type: Number,
    min: [2, 'Minimum time of 2 mins'],
    max: [260, 'Maximum time of 260 mins'],
    required: [true, 'Time is required'],
  },
  instructions: {
    type: Map,
    of: String,
    required: [true, 'Instructions are required'],
  },
  servings: {
    type: Number,
    min: [1, 'Minimum of 1 serving required'],
    max: [260, 'Maximum of 25 servings is allowed'],
    required: [true, 'Please enter the number of servings required'],
  },
  recipeImage: {
    type: String,
    required: [true, 'An image of the recipe is required'],
  },
  public: {
    type: Boolean,
    required: [true, 'Please state whether this recipe is public'],

  },
});

module.exports = mongoose.model('RecipeModel', recipeSchema);
