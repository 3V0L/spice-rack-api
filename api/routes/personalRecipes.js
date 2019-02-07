const express = require('express');

const checkAuth = require('../middleware/checkAuth');
const PersonalRecipesController = require('../controllers/personalRecipes');

const router = express.Router();

router.get('/', checkAuth, PersonalRecipesController.getAllMyRecipes);

router.get('/:recipeId', checkAuth, PersonalRecipesController.getMySingleRecipe);

module.exports = router;
