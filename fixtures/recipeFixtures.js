const recipeFixtures = {};

recipeFixtures.testUserRecipe = {
  _id: '5c5c2836945c74153b81a53e',
  author: '5c59bebf00098e7b829bf1d7',
  title: 'First',
  ingredients: 'Teeskjsasa',
  time: 6,
  instructions: {
    1: 'Boil water',
    2: 'cook meal',
  },
  servings: 6,
  public: true,
  reviews: [
    {
      userId: '5c6d0d3ce86b200804d06b32',
      rating: 3,
      comment: 'Tasted good',
    },
  ],
};

recipeFixtures.addRecipe = {
  title: 'First',
  ingredients: 'Teeskjsasa',
  time: 6,
  instructions: {
    1: 'Boil water',
    2: 'cook meal',
  },
  recipeImage: '',
  servings: 6,
  public: true,
};

module.exports = recipeFixtures;
