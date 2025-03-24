// controllers/recipes.js

const express = require('express');
const router = express.Router();

const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');
const User = require('../models/user.js');


// Index - GET /recipes
router.get('/', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/auth/sign-in');
        }
        const recipes = await Recipe.find({owner: req.session.user._id}).populate('ingredients');
        res.locals.recipes = recipes;   // Send recipes to the view via res.locals
        res.render('recipes/index.ejs', { recipes }); 
            // { recipes: currentUser.recipes})
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

  
//New - GET /recipes/new
router.get('/new', async (req, res) => {
    try {
        const ingredients = await Ingredient.find({});
        res.render('recipes/new.ejs', { ingredients });
    } catch (error) {
        console.log(error);
        res.redirect('/recipes');
    }
});

// Delete - DELETE /recipes/:id

router.delete('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        // Check if user owns this recipe
        if (!recipe.owner || !recipe.owner.equals(req.session.user._id)) {
            return res.redirect('/recipes');
        }
        await Recipe.findByIdAndDelete(req.params.id);
            
        res.redirect('/recipes');
    } catch (error) {
        console.log(error);
        res.redirect('/recipes');
    }
});

// Update - PUT /recipes/:id
router.put('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        // Check if user owns this recipe
        if (!recipe.owner.equals(req.session.user._id)) {
            return res.redirect('/recipes');
        }
        if (typeof req.body.ingredients === 'string') {
            req.body.ingredients = [req.body.ingredients];
        }
        await Recipe.findByIdAndUpdate(req.params.id, req.body);
        await recipe.save();
        res.redirect(`/recipes/${req.params.id}`);
    } catch (error) {
        console.log(error);
        res.redirect('/recipes');
    }
});



//create
// router.post('/', async (req, res) => {
//         try {
//         req.body.owner = req.session.user._id;
//         if (typeof req.body.ingredients === 'string') {
//             req.body.ingredients = [req.body.ingredients];
//         }
//           const recipe = await Recipe.create(req.body);
          
//           res.redirect('/recipes');
//         } catch (error) {
//           console.log(error);
//           res.redirect('/');
//         }
//       });

// In controllers/recipes.js, within the create route

router.post('/', async (req, res) => {
    try {
      const newRecipe = new Recipe(req.body);
      newRecipe.owner = req.session.user._id;
      await newRecipe.save();
      res.redirect('/recipes');
    } catch (error) {
       console.log(error);
        res.redirect('/');
    }
  });
  
//edit route

// Edit - GET /recipes/:id/edit
router.get('/:id/edit', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        // Check if user owns this recipe
        if (!recipe.owner.equals(req.session.user._id)) {
            return res.redirect('/recipes');
        }
        const ingredients = await Ingredient.find({});
        res.render('recipes/edit.ejs', { recipe, ingredients });
    } catch (error) {
        console.log(error);
        res.redirect('/recipes');
    }
});



//show - GET /recipes/:id
router.get('/:recipeId', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId).populate('ingredients').populate('owner');
        const isOwner = recipe.owner._id.equals(req.session.user._id);
        
        res.render('recipes/show.ejs', { recipe, isOwner });
    } catch (error) {
        console.log(error);
        res.redirect('/recipes');
    }
});




module.exports = router;
