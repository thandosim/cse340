const utilities = require("../utilities");
const { body, validationResult } = require("express-validator");
const validate = {};
const invModel = require("../models/inventory-model");
const invModel2 = require("../models/check-existing-classification-model")

/* **********************************
 *  Add Classification Validation Rules
 * ********************************** */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Classification name must be at least 3 characters long.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters.")
      .custom(async (classification_name) => {
        // const invModel = require("../models/inventory-model"); 
        const exists = await invModel2.checkExistingClassification(classification_name);
        console.log("checking if the classisfication already exists: ")
        console.log(exists);
        if (exists) {
          throw new Error("Classification already exists. Please use a different name.");
        }
      }),
  ];
};

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(err => err.msg)); 
    return res.redirect("/inv/classification"); // Redirect to the controller
  }
  next();
};
  
//   if (!errors.isEmpty()) {
//     // let nav = await utilities.getNav()
//     let nav
//     res.render("inventory/add-classification", {
//       errors: null,
//       title: "Add Classification",
//       nav: null,
//     });
//     return;
//   }
//   next(); // Proceed if validation passes
// };

module.exports = validate;