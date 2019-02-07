const RecipeModel = require('../models/recipes');
const returnURLMapping = require('../helpers/mapReturnObjects');

exports.getMySingleRecipe = (req, res) => {
  RecipeModel.findById(req.params.recipeId)
    .select('_id title author ingredients time instructions servings recipeImage')
    .where('author').gte(req.userData.userId)
    .populate('author', 'name')
    .exec()
    .then((recipe) => {
      if (recipe) {
        res.status(200).json({ recipe: returnURLMapping.singleRecipes(req, recipe) });
      } else {
        res.status(404).json({ error: 'Recipe not found.' });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'An error occured while fetching the data.',
        error,
      });
    });
};

exports.getAllMyRecipes = (req, res) => {
  RecipeModel.find()
    .select('_id title author ingredients time instructions servings recipeImage public')
    .where('author').gte(req.userData.userId)
    .populate('author', 'name')
    .exec()
    .then((recipes) => {
      if (recipes.length > 0) {
        const response = {
          totalCount: recipes.length,
          allRecipes: returnURLMapping.allRecipes(req, recipes),
        };
        res.status(200).json(response);
      } else {
        res.status(200).json({ message: 'No recipes available.' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'An error occured while fetching data' });
    });
};
