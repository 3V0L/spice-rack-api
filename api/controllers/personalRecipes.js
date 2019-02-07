const RecipeModel = require('../models/recipes');
const returnURLMapping = require('../helpers/mapReturnObjects');
const recipeHelper = require('../helpers/recipeHelper');

exports.getMySingleRecipe = (req, res) => {
  RecipeModel.findById(req.params.recipeId)
    .select('_id title author ingredients time instructions servings recipeImage public')
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

exports.patchRecipe = (req, res) => {
  RecipeModel.updateOne(
    { _id: req.params.recipeId },
    { $set: recipeHelper.updateRecipe(req.body, req.file) },
  )
    .exec()
    .then(() => {
      const result = {
        message: 'Recipe Updated.',
        requests: returnURLMapping.addRecipe(req, req.params.recipeId),
      };
      res.status(200).json(result);
    })
    .catch(() => {
      res.status(500).json({ error: 'Failed to update.' });
    });
};

exports.deleteRecipe = (req, res) => {
  RecipeModel.findOne({ _id: req.params.recipeId, author: req.userData.userId })
    .exec()
    .then((result) => {
      if (!result) {
        res.status(403).json({ message: 'You are not authorized to perform this action' });
      }
    })
    .catch();

  RecipeModel.deleteOne({ _id: req.params.recipeId, author: req.userData.userId })
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'The recipe was deleted',
        requests: returnURLMapping.startMethods(req),
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'An error occured while deleting this object. Please try again.',
        error,
      });
    });
};
