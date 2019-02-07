const recipeHelper = {};

recipeHelper.convertToObject = (req) => {
  let object = req;
  if (typeof object === 'string') {
    object = JSON.parse(req.body.instructions);
  }
  return object;
};

module.exports = recipeHelper;
