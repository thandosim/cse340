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
//route to build inventory table by id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
//route to emodify inventory item
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory))
//route to update inventory item in database
router.post("/update/", 
    validateInventory.updateInventoryRules(),
    validateInventory.checkUpdateData,
    utilities.handleErrors(invController.processUpdateInventory))
//route to delete an inventory item, confirmation view first
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventory))
//route to delete item upon confirmation
router.post("/delete/:inv_id",
  utilities.handleErrors(invController.processDeleteInventory)
)


module.exports = router;