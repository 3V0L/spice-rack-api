const express = require('express');

const checkAuth = require('../helpers/middlewares');
const PersonalRecipesController = require('../controllers/personalRecipes');
const imageUpload = require('../helpers/imageUpload');

const router = express.Router();

router.get('/', checkAuth, PersonalRecipesController.getAllMyRecipes);

router.get('/:recipeId', checkAuth, PersonalRecipesController.getMySingleRecipe);

router.patch(
  '/:recipeId',
  checkAuth,
  imageUpload.single('recipeImage'),
  PersonalRecipesController.patchRecipe,
);

router.delete('/:recipeId', checkAuth, PersonalRecipesController.deleteRecipe);

module.exports = router;
