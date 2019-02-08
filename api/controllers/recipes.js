const mongoose = require('mongoose');
const fs = require('fs');

const RecipeModel = require('../models/recipes');
const returnURLMapping = require('../helpers/mapReturnObjects');
const recipeHelper = require('../helpers/recipeHelper');
const personalRecipeController = require('./personalRecipes');

exports.getAllRecipes = (req, res) => {
  RecipeModel.find()
    .select('_id title author ingredients time instructions servings recipeImage public')
    .where('public').gte(true)
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

exports.getSingleRecipe = (req, res) => {
  RecipeModel.findById(req.params.recipeId)
    .select('_id title author ingredients time instructions servings recipeImage')
    .where('public').gte(true)
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

exports.addRecipe = (req, res) => {
  if (!req.userData) {
    res.status(403).json({ message: 'You are not allowed to perform this action' });
  }
  const instructionsObj = recipeHelper.convertToObject(req.body.instructions);
  const recipe = new RecipeModel({
    _id: new mongoose.Types.ObjectId(),
    author: req.userData.userId,
    title: req.body.title,
    ingredients: req.body.ingredients,
    time: req.body.time,
    instructions: instructionsObj,
    servings: req.body.servings,
    recipeImage: req.file.path,
    public: req.body.public,
  });
  recipe.save().then((result) => {
    res.status(201).json({
      message: 'Recipe Created',
      createdRecipe: {
        _id: result.id,
        author: result.author,
        title: result.title,
        ingredients: result.ingredients,
        time: result.time,
        instructions: result.instructions,
        servings: result.servings,
        public: result.public,
        recipeImage: result.recipeImage,
        requests: returnURLMapping.addRecipe(req, result.id),
      },
    });
  })
    .catch((error) => {
      // Delete file if an error occurs
      fs.unlinkSync(req.file.path);
      // Retrieve error field
      const field = Object.keys(error.errors)[0];
      res.status(422).json({
        message: error.errors[field].message,
      });
    });
};

exports.getSingleUserRecipes = (req, res) => {
  if (req.userData.userId === req.params.userId) {
    personalRecipeController.getAllMyRecipes(req, res);
  } else {
    RecipeModel.find()
      .select('_id title author ingredients time instructions servings recipeImage public')
      .where('author').gte(req.params.userId)
      .where('public')
      .gte(true)
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
  }
};
