// Needed Resources 
const express = require("express")
const router = new express.Router() 
const favoriteController = require("../controllers/favoriteController")
const utilities = require("../utilities/")

// Route to build the favorites view
router.get("/", 
  utilities.checkLogin, 
  utilities.handleErrors(favoriteController.buildFavoritesView)
)

// Route to add a favorite
router.post("/add", 
  utilities.checkLogin, 
  utilities.handleErrors(favoriteController.addFavorite)
)

// Route to remove a favorite
router.post("/remove", 
  utilities.checkLogin, 
  utilities.handleErrors(favoriteController.removeFavorite)
)

module.exports = router
