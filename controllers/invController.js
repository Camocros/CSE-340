const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

async function buildByInventoryId(req, res, next) {
  const inv_id = parseInt(req.params.invId)
  const data = await invModel.getInventoryById(inv_id)
  
  if (!data) {
    const err = new Error("Sorry, the requested vehicle could not be found.")
    err.status = 404
    return next(err)
  }

  const detailHTML = await utilities.buildVehicleDetail(data)
  let nav = await utilities.getNav()

  let isFavorite = false
  if (res.locals.loggedin && res.locals.accountData) {
    try {
      const favoriteModel = require("../models/favorite-model")
      isFavorite = await favoriteModel.checkFavorite(res.locals.accountData.account_id, inv_id)
    } catch (dbError) {
      console.error("Error checking favorite status: ", dbError)
      // Si la tabla de favoritos no existe en Render u otro problema, no crasheamos la página:
      isFavorite = false
    }
  }

  res.render("inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    detailHTML,
    inv_id,
    isFavorite,
  })
}

async function buildByClassificationId(req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  
  res.render("inventory/classification", {
    title: "Vehicles by Classification",
    nav,
    grid,
  })
}

/* ****************************************
*  Deliver management view
* *************************************** */
async function buildManagementView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
  })
}

/* ****************************************
*  Deliver Add Classification view
* *************************************** */
async function buildAddClassification(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
  })
}

/* ****************************************
*  Process Add Classification
* *************************************** */
async function addClassification(req, res, next) {
  const { classification_name } = req.body
  const insertResult = await invModel.addClassification(classification_name)

  if (insertResult) {
    req.flash("notice", `The ${classification_name} classification was successfully added.`)
    res.redirect("/inv/")
  } else {
    let nav = await utilities.getNav()
    req.flash("notice", "Sorry, the insertion failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
    })
  }
}

/* ****************************************
*  Deliver Add Inventory view
* *************************************** */
async function buildAddInventory(req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
  })
}

/* ****************************************
*  Process Add Inventory
* *************************************** */
async function addInventory(req, res, next) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  const insertResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)

  if (insertResult) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`)
    res.redirect("/inv/")
  } else {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, the insertion failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    })
  }
}

module.exports = { 
  buildByInventoryId, 
  buildByClassificationId, 
  buildManagementView,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventory
}