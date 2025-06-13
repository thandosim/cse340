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

// Route to handle purchase page view
router.get("/purchase/:invId", utilities.checkLogin, utilities.handleErrors(invController.buildPurchase));
// Route to process purchase after confirmation
router.post("/purchase/complete", utilities.checkLogin, utilities.handleErrors(invController.completePurchase));


// Route to build management view
router.get("/", 
  utilities.authorizeInventoryActions,
  utilities.handleErrors(invController.buildManagement));//consider "/management"
//Route to build add-classification view
router.get("/classification", 
  utilities.authorizeInventoryActions,
  utilities.handleErrors(invController.buildAddClassification));
//Route to process add-classification 
router.post(
  "/classification",
  utilities.authorizeInventoryActions,
  validateClassification.classificationRules(),
  validateClassification.checkClassificationData,
  utilities.handleErrors(invController.processAddClassification)
);
//Route to build add inventory view
router.get("/inventory", 
  utilities.authorizeInventoryActions,
  utilities.handleErrors(invController.buildAddInventory));
//Route to process add inventory
router.post(
    "/inventory",
    utilities.authorizeInventoryActions,
    validateInventory.inventoryRules(),
    validateInventory.checkInventoryData,
    utilities.handleErrors(invController.processAddInventory)
);
//route to build inventory table by id
router.get("/getInventory/:classification_id", 
  utilities.authorizeInventoryActions,
  utilities.handleErrors(invController.getInventoryJSON))
//route to modify inventory item
router.get("/edit/:inv_id", 
  utilities.authorizeInventoryActions,
  utilities.handleErrors(invController.buildEditInventory))
//route to update inventory item in database
router.post("/update/",
    utilities.authorizeInventoryActions, 
    validateInventory.updateInventoryRules(),
    validateInventory.checkUpdateData,
    utilities.handleErrors(invController.processUpdateInventory))
//route to delete an inventory item, confirmation view first
router.get("/delete/:inv_id", 
  utilities.authorizeInventoryActions,
  utilities.handleErrors(invController.buildDeleteInventory))
//route to delete item upon confirmation
router.post("/delete/:inv_id",
  utilities.authorizeInventoryActions,
  utilities.handleErrors(invController.processDeleteInventory)
)


module.exports = router;