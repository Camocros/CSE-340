const favoriteModel = require("../models/favorite-model")
const utilities = require("../utilities/")

/* ****************************************
*  Deliver Favorites View
* *************************************** */
async function buildFavoritesView(req, res, next) {
  const account_id = res.locals.accountData.account_id
  try {
    const favorites = await favoriteModel.getFavoritesByAccountId(account_id)
    let nav = await utilities.getNav()
    res.render("account/favorites", {
      title: "My Favorites",
      nav,
      favorites,
      errors: null,
    })
  } catch (error) {
    req.flash("notice", "Sorry, there was an error retrieving your favorites.")
    res.redirect("/account/")
  }
}

/* ****************************************
*  Add to Favorites
* *************************************** */
async function addFavorite(req, res, next) {
  const { inv_id } = req.body
  const account_id = res.locals.accountData.account_id

  try {
    const exists = await favoriteModel.checkFavorite(account_id, inv_id)
    if (!exists) {
      await favoriteModel.addFavorite(account_id, inv_id)
      req.flash("notice", "Vehicle added to favorites!")
    } else {
      req.flash("notice", "Vehicle is already in favorites.")
    }
  } catch (error) {
    req.flash("notice", "Sorry, there was an error adding the vehicle to favorites.")
  }
  res.redirect(`/inv/detail/${inv_id}`)
}

/* ****************************************
*  Remove from Favorites
* *************************************** */
async function removeFavorite(req, res, next) {
  const { inv_id } = req.body
  const account_id = res.locals.accountData.account_id

  try {
    await favoriteModel.removeFavorite(account_id, inv_id)
    req.flash("notice", "Vehicle removed from favorites.")
  } catch (error) {
    req.flash("notice", "Sorry, there was an error removing the vehicle from favorites.")
  }
  
  // Try to redirect to the referer to allow removing from both details page and list
  const referer = req.get('Referrer')
  if (referer && referer.includes('/favorites')) {
    res.redirect('/favorites')
  } else {
    res.redirect(`/inv/detail/${inv_id}`)
  }
}

module.exports = {
  buildFavoritesView,
  addFavorite,
  removeFavorite
}
