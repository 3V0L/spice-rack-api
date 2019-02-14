const express = require('express');

const imageUpload = require('../helpers/imageUpload');
const checkAuth = require('../helpers/middlewares');
const RecipesController = require('../controllers/recipes');

const router = express.Router();

router.get('/', RecipesController.getAllRecipes);

router.post('/', checkAuth, imageUpload.single('recipeImage'), RecipesController.addRecipe);

router.get('/:recipeId', RecipesController.getSingleRecipe);

router.get('/user/:userId', checkAuth, RecipesController.getSingleUserRecipes);

router.post('/review/:recipeId', checkAuth, RecipesController.rateRecipe);

module.exports = router;
