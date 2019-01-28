const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');

const RecipeModel = require('../models/recipes');
const returnURLMapping = require('../helpers/mapReturnObjects');
const imageUpload = require('../helpers/imageUpload');

const router = express.Router();

router.get('/', (req, res) => {
  RecipeModel.find()
    .select('_id title ingredients time instructions servings recipeImage')
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
});

router.post('/', imageUpload.single('recipeImage'), (req, res) => {
  let instructionsObj = req.body.instructions;
  if (typeof req.body.instructions === 'string') {
    instructionsObj = JSON.parse(req.body.instructions);
  }
  const recipe = new RecipeModel({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    ingredients: req.body.ingredients,
    time: req.body.time,
    instructions: instructionsObj,
    servings: req.body.servings,
    recipeImage: req.file.path,
  });
  recipe.save().then((result) => {
    res.status(201).json({
      message: 'Recipe Created',
      createdRecipe: {
        _id: result.id,
        title: result.title,
        ingredients: result.ingredients,
        time: result.time,
        instructions: result.instructions,
        servings: result.servings,
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
});

router.get('/:recipeId', (req, res) => {
  RecipeModel.findById(req.params.recipeId)
    .select('_id title ingredients time instructions servings recipeImage')
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
});

router.patch('/:recipeId', (req, res) => {
  RecipeModel.updateOne(
    { _id: req.params.recipeId },
    { $set: req.body },
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
});

router.delete('/:recipeId', (req, res) => {
  RecipeModel.remove({ _id: req.params.recipeId })
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
});

module.exports = router;
