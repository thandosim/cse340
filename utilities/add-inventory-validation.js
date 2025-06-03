const utilities = require("../utilities");
const { body, validationResult } = require("express-validator");
const validate = {};
const invModel = require("../models/inventory-model");
const invModel2 = require("../models/check-existing-classification-model")


/* **********************************
 *  Inventory Validation Rules (Includes Duplicate Check)
 * ********************************** */
validate.inventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .isLength({ min: 2 })
            .withMessage("Make must be at least 2 characters."),
        
        body("inv_model")
            .trim()
            .isLength({ min: 2 })
            .withMessage("Model must be at least 2 characters."),
        
        body("inv_year")
            .isInt({ min: 1900, max: new Date().getFullYear() })
            .withMessage("Invalid year."),

        body("inv_description")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Descriprition must be at least 3 characters."),
        
        body("inv_price")
            .isFloat({ min: 0 })
            .withMessage("Price must be a positive number."),
        
        body("inv_miles")
            .isInt({ min: 0 })
            .withMessage("Miles must be a non-negative number."),
        
        body("inv_color")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Color must be at least 3 characters."),
        
        body("classification_id")
            .notEmpty()
            .withMessage("You must select a classification."),
        
        // Custom validation to check for existing inventory
        body("inv_make").custom(async (inv_make, { req }) => {
            const { inv_model, inv_year } = req.body;
            const exists = await invModel2.checkExistingInventory(inv_make, inv_model, inv_year);
            if (exists) {
                throw new Error("This vehicle is already in the inventory.");
            }
        }),
    ];
};

/* ******************************
 * Check Validation Data & Return Errors or Continue
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        req.flash("error", errors.array().map(err => err.msg));
        // return res.redirect("/inv/inventory");
        return res.render("./inventory/add-inventory", {
                    title: "Add Inventory",
                    nav,
                    classificationList: await utilities.buildClassificationList(),
                    errors: null,
                    locals: req.body 
                });
    }
    next();
};

module.exports = validate;