const UserModel = require('../models/users');
const recipeHelper = require('../helpers/recipeHelper');
const RecipeModel = require('../models/recipes');


exports.addFavourites = (req, res) => {
  RecipeModel.findById(req.params.recipeId)
    .select('_id public recipeImage')
    .exec()
    .then((recipe) => {
      if (recipe.public === false || recipe === null) {
        return res.status(403).json({ message: 'You are not allowed to perform this action' });
      // eslint-disable-next-line no-else-return
      } else {
        UserModel.updateOne(
          { _id: req.userData.userId },
          { $addToSet: { favourites: req.params.recipeId } },
        )
          .exec()
          .then((response) => {
            if (response.nModified === 0) {
              res.status(409).json({
                message: 'Recipe already in favourites',
              });
            }
            const result = {
              message: 'Recipe added to Favourites.',
            };
            res.status(200).json(result);
          })
          .catch(() => {
            res.status(500).json({ error: 'Failed to add to Favourites.' });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'An error occured while performing this action.',
        error,
      });
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
      });
    })
    .catch(() => {
      res.status(500).json({ message: 'An error occured while fetching data' });
    });
};
