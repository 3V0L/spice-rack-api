const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  ingredients: {
    type: String,
    required: [true, 'Ingredients are required'],
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
});

module.exports = mongoose.model('RecipeModel', recipeSchema);
