const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isAlpha()
      .withMessage("Please provide a valid classification name (no spaces or special characters)."),
  ]
}

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
    })
    return
  }
  next()
}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
  return [
    body("classification_id").notEmpty().withMessage("Please select a classification."),
    body("inv_make").trim().escape().notEmpty().isLength({ min: 3 }).withMessage("Make must be at least 3 characters."),
    body("inv_model").trim().escape().notEmpty().isLength({ min: 3 }).withMessage("Model must be at least 3 characters."),
    body("inv_description").trim().escape().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_price").trim().escape().notEmpty().isNumeric().withMessage("Price must be a number."),
    body("inv_year").trim().escape().notEmpty().isNumeric().isLength({ min: 4, max: 4 }).withMessage("Year must be a 4-digit number."),
    body("inv_miles").trim().escape().notEmpty().isNumeric().withMessage("Miles must be a number."),
    body("inv_color").trim().escape().notEmpty().withMessage("Color is required."),
  ]
}

/* ******************************
 * Check data and return errors with sticking values
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationList,
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    })
    return
  }
  next()
}

module.exports = validate
