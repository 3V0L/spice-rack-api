const RecipeModel = require('../models/recipes');

const recipeHelper = {};

recipeHelper.convertToObject = (req) => {
  let object = req;
  if (typeof object === 'string') {
    object = JSON.parse(object);
  }
  return object;
};

recipeHelper.updateRecipe = (body, file) => {
  const updateObject = {};
  Object.keys(body).forEach((key) => {
    if (key === 'instructions' && body.instructions) {
      updateObject[key] = recipeHelper.convertToObject(body.instructions);
    } else if (file) {
      updateObject.recipeImage = file.path;
    } else {
      updateObject[key] = body[key];
    }
  });
  return updateObject;
};

recipeHelper.checkRecipeIsPublic = (req, res) => {
  RecipeModel.findById(req.params.recipeId)
    .select('_id public recipeImage')
    .exec()
    .then((recipe) => {
      if (recipe.public === false || recipe === null) {
        return false;
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'An error occured while performing this action.',
        error,
      });
    });
};

recipeHelper.retrieveFavouriteRecipes = (req, res, recipeIds) => {
  RecipeModel.find({ _id: { $in: recipeIds } }, (err, recipes) => {
    if (err) {
      res.status(500).json({ message: 'An error occured. Please try again.' });
    } else {
      res.status(200).json({
        count: recipes.length,
        recipes,
      });
    }
  });
};

recipeHelper.validateRating = (rating) => {
  try {
    const ratingInt = parseInt(rating, 10);
    const minValue = ratingInt > 0;
    const maxValue = ratingInt < 6;
    if (minValue && maxValue) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

module.exports = recipeHelper;
