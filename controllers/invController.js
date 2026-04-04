const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

async function buildByInventoryId(req, res, next) {
  const inv_id = parseInt(req.params.invId)
  const data = await invModel.getInventoryById(inv_id)
  const detailHTML = await utilities.buildVehicleDetail(data)

  res.render("inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav: "",
    detailHTML,
  })
}

async function buildByClassificationId(req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  
  res.render("inventory/classification", {
    title: "Vehicles",
    nav: "",
    grid,
  })
}

module.exports = { buildByInventoryId, buildByClassificationId }