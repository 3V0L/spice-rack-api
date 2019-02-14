const express = require('express');

const checkAuth = require('../helpers/middlewares');
const FavouritesController = require('../controllers/favourites');

const router = express.Router();

router.post('/:recipeId', checkAuth, FavouritesController.addFavourites);

router.get('/', checkAuth, FavouritesController.getAllFavourites);

router.delete('/:recipeId', checkAuth, FavouritesController.removeFavourite);

module.exports = router;
