const url = require('url');

const returnMethods = {};
const sampleData = {
  title: 'Test',
  time: 10,
  ingredients: 'noodles',
  instructions: {
    1: 'Boil water',
    2: 'Place noodle in water',
    3: 'Drain water',
  },
  servings: 2,
};

const path = (req, originalUrl = '') => url.format({
  protocol: req.protocol,
  host: req.get('host'),
  pathname: originalUrl,
});

returnMethods.getAllMethod = req => ({
  method: 'GET',
  description: 'Get all Recipes',
  path: `${path(req)}/recipes`,
});

returnMethods.getSingleRecipe = (req, recipeId) => ({
  method: 'Get',
  description: 'Get this single Recipe',
  path: path(req, `recipes/${recipeId}`),
});

returnMethods.editRecipe = (req, recipeId) => ({
  method: 'Patch',
  description: 'Edit this recipe',
  path: path(req, `recipes/${recipeId}`),
  sampleData,
});

returnMethods.deleteRecipe = (req, recipeId) => ({
  method: 'Delete',
  description: 'Delete this recipe',
  path: path(req, `recipes/${recipeId}`),
});

returnMethods.addRecipe = req => ({
  method: 'Post',
  description: 'Add a recipe',
  path: path(req, 'recipes'),
  sampleData,
});

module.exports = returnMethods;
