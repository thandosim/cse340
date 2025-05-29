// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build detailed vehicle view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));
// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement));//consider "/management"

module.exports = router;