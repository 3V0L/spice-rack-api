const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  ingridients: {
    type: String,
    required: [true, 'Ingridients are required'],
  },
  time: {
    type: Number,
    min: [2, 'Minimum time of 2 mins'],
    max: [260, 'Maximum time of 260 mins'],
    required: [true, 'Time is required'],
  },
});

module.exports = mongoose.model('RecipeModel', recipeSchema);
