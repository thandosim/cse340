// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build account/login view
router.get("/login", utilities.handleErrors(accController.buildLogin));
// Route to build account/register view
router.get("/register", utilities.handleErrors(accController.buildRegister));
// Route to Post fome data into database
router.post('/register', 
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accController.registerAccount))

module.exports = router;