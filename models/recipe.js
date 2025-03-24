const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: false,
  },
  ingredients: [{
    ref: 'Ingredient',
    type: mongoose.Schema.Types.ObjectId,
    required: false,
}],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Recipe = mongoose.model('Recipe', recipeSchema);


module.exports = Recipe;
