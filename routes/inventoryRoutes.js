// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const validateClassification = require("../utilities/classification-validation")
const validateInventory = require("../utilities/add-inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build detailed vehicle view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));
// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement));//consider "/management"
//Route to build add-classification view
router.get("/classification", utilities.handleErrors(invController.buildAddClassification));
//Route to process add-classification 
router.post(
  "/classification",
  validateClassification.classificationRules(),
  validateClassification.checkClassificationData,
  utilities.handleErrors(invController.processAddClassification)
);
//Route to build add inventory view
router.get("/inventory", utilities.handleErrors(invController.buildAddInventory));
//Route to process add inventory
router.post(
    "/inventory",
    validateInventory.inventoryRules(),
    validateInventory.checkInventoryData,
    utilities.handleErrors(invController.processAddInventory)
);


module.exports = router;