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

/* ***************************
 *  Build Add Classification View
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav();
    let messages = req.flash("info");

    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null
    });
};


/* ***************************
 *  Process Classification Submission
 * ************************** */
invCont.processAddClassification = async function (req, res, next) {
    let { classification_name } = req.body;
    let nav = await utilities.getNav();

    // Server-side validation
    const regex = /^[A-Za-z0-9]+$/;
    if (!regex.test(classification_name)) {
        req.flash("error", "Classification name cannot contain spaces or special characters.");
        return res.redirect("/inv/classification");
    }

    try {
        let success = await invModel.insertClassification(classification_name);
        if (success) {
            nav = await utilities.getNav(); // Refresh navigation to include new classification
            req.flash("info", "Classification added successfully!");
            return res.redirect("/inv/management");
        } else {
            req.flash("error", "Failed to add classification.");
            return res.redirect("/inv/classification");
        }
    } catch (error) {
        console.error(error);
        req.flash("error", "Database error.");
        return res.redirect("/inv/classification");
    }
};



module.exports = invCont