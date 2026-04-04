const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

const invValidate = require("../utilities/inventory-validation")

router.get("/", 
  utilities.checkAdminOrEmployee,
  utilities.handleErrors(invController.buildManagementView))

router.get("/add-classification", 
  utilities.checkAdminOrEmployee,
  utilities.handleErrors(invController.buildAddClassification))
router.post(
  "/add-classification", 
  utilities.checkAdminOrEmployee,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

router.get("/add-inventory", 
  utilities.checkAdminOrEmployee,
  utilities.handleErrors(invController.buildAddInventory))
router.post(
  "/add-inventory",
  utilities.checkAdminOrEmployee,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId))

module.exports = router