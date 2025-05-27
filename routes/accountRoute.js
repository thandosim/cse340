// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accountController")
const utilities = require("../utilities")

// Route to build account/login view
router.get("/login", utilities.handleErrors(accController.buildLogin));
// Route to build detailed vehicle view
// router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

module.exports = router;