const express = require('express');
const mongoose = require('mongoose');

const RecipeModel = require('../models/recipes');

const router = express.Router();

router.get('/', (req, res) => {
  RecipeModel.find()
    .exec()
    .then((recipes) => {
      if (recipes.length > 0) {
        res.status(200).json(recipes);
      } else {
        res.status(200).json({ message: 'No recipes available.' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'An error occured while fetching data' });
    });
});

router.post('/', (req, res) => {
  const recipe = new RecipeModel({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    ingridients: req.body.ingridients,
    time: req.body.time,
  });
  recipe.save().then((result) => {
    res.status(201).json({
      message: 'Recipe Created',
      createdRecipe: result,
    });
  })
    .catch((error) => {
      // Retrieve error field
      const field = Object.keys(error.errors)[0];
      res.status(422).json({
        message: error.errors[field].message,
      });
    });
});

router.get('/:recipeId', (req, res) => {
  RecipeModel.findById(req.params.recipeId)
    .exec()
    .then((record) => {
      if (record) {
        res.status(200).json({ recipe: record });
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
      res.status(200).json({ message: 'Recipe Updated.' });
    })
    .catch(() => {
      res.status(500).json({ error: 'Failed to update.' });
    });
});

router.delete('/:recipeId', (req, res) => {
  RecipeModel.remove({ _id: req.params.recipeId })
    .exec()
    .then(() => {
      res.status(200).json({ message: 'The recipe was deleted' });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

module.exports = router;
