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
  const classificationList = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    classificationList
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
        errors: null,
        locals: req.body
    });
};


/* ***************************
 *  Process Classification Submission
 * ************************** */
invCont.processAddClassification = async function (req, res, next) {
    let { classification_name } = req.body;
    let nav = await utilities.getNav();

    try {
        let success = await invModel.insertClassification(classification_name);
        if (success) {
            nav = await utilities.getNav();
            req.flash("info", "Classification added successfully!");
            return res.redirect("/inv/");
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


/* ***************************
 *  build add-inventry view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    let messages = req.flash("info");

    res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList, // Pass to view
        errors: null,
        locals: req.body
    });
};

/**************************************************** 
 * process add invetory item
 * **************************************************/ 
invCont.processAddInventory = async function (req, res, next) {
    try {
        const success = await invModel.insertInventory(req.body);
        if (success) {
            req.flash("info", "Inventory item added successfully!");
            return res.redirect("/inv/");
        } else {
            req.flash("error", "Failed to add inventory item.");
            return res.render("./inventory/add-inventory", {
                title: "Add Inventory",
                nav: await utilities.getNav(),
                classificationList: await utilities.buildClassificationList(req.body.classification_id),
                errors: req.flash("error"),
                locals: req.body
            });
        }
    } catch (error) {
        console.error("Database error:", error);
        req.flash("error", "An error occurred while adding the inventory item.");
        return res.render("./inventory/add-inventory", {
            title: "Add Inventory",
            nav: await utilities.getNav(),
            classificationList: await utilities.buildClassificationList(req.body.classification_id),
            errors: req.flash("error"),
            locals: req.body
        });
    }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  build edit-inventry view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav();
    let item = (await invModel.getInventoryByInventoryId(inv_id))[0];
    let classificationList = await utilities.buildClassificationList(item.classification_id);
    const itemName = `${item.inv_make} ${item.inv_model}`;
    let messages = req.flash("info");

    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationList: classificationList, // Pass to view
        errors: null,
        inv_id: item.inv_id,
        inv_make: item.inv_make,
        inv_model: item.inv_model,
        inv_year: item.inv_year,
        inv_description: item.inv_description,
        inv_image: item.inv_image,
        inv_thumbnail: item.inv_thumbnail,
        inv_price: item.inv_price,
        inv_miles: item.inv_miles,
        inv_color: item.inv_color,
        classification_id: item.classification_id
    });
};

module.exports = invCont