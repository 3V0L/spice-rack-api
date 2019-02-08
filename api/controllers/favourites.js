const UserModel = require('../models/users');
const returnURLMapping = require('../helpers/mapReturnObjects');
const recipeHelper = require('../helpers/recipeHelper');


exports.addFavourites = (req, res) => {
  if (!recipeHelper.checkRecipeIsPublic(req, res)) {
    res.status(403).json({ message: 'You are not allowed to perform this action' });
  }
  UserModel.updateOne(
    { _id: req.userData.userId },
    { $addToSet: { favourites: req.params.recipeId } },
  )
    .exec()
    .then((response) => {
      if (response.nModified === 0) {
        res.status(409).json({
          message: 'Recipe already in favourites',
          requests: returnURLMapping.Favourites(req, req.params.recipeId),
        });
      }
      const result = {
        message: 'Reipe added to Favourites.',
        requests: returnURLMapping.Favourites(req, req.params.recipeId),
      };
      res.status(201).json(result);
    })
    .catch(() => {
      res.status(500).json({ error: 'Failed to add to Favourites.' });
    });
};

exports.getAllFavourites = (req, res) => {
  UserModel.findById(req.userData.userId)
    .select('_id name favourites')
    .exec()
    .then((user) => {
      if (user.favourites.length < 1) {
        res.status(200).json({
          message: 'No recipes on favourite list yet',
          requests: returnURLMapping.removeGetFavourites(req),
        });
      } else {
        recipeHelper.retrieveFavouriteRecipes(req, res, user.favourites);
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'An error occured while fetching data' });
    });
};

exports.removeFavourite = (req, res) => {
  UserModel.updateOne(
    { _id: req.userData.userId },
    { $pull: { favourites: req.params.recipeId } },
  )
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'Recipe has been removed from favourites',
        requests: returnURLMapping.removeGetFavourites(req),
      });
    })
    .catch(() => {
      res.status(500).json({ message: 'An error occured while fetching data' });
    });
};
