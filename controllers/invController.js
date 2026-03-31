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

module.exports = { buildByInventoryId }