const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build item detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.invId
  const data = await invModel.getInventoryByInventoryId(inventory_id)
  const details = await utilities.buildVehicleDetailGrid(data[0])
  let nav = await utilities.getNav()
  const vehicle = data[0]
  const vehicleName = vehicle.inv_model
  const vehicleMake = vehicle.inv_make
  const vehicleYear = vehicle.inv_year
  res.render("./inventory/detail", {
    title: vehicleYear + " " + vehicleMake + " " + vehicleName,
    nav,
    details,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()

  res.render("./inventory/management", {
    title: "Management",
    nav,
  })
}


module.exports = invCont