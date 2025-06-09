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
// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accController.accountLogin)
)
//route to the Account mnagement view
router.get("/", utilities.checkLogin, utilities.handleErrors(accController.buildAccountManagement))
// Route to build the Account Update view
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accController.buildUpdateAccount));
// Route to process account update (first name, last name, email)
router.post(
  "/update",
  regValidate.updateAccountRules(), 
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accController.processAccountUpdate)
);
// Route to process password change
router.post(
  "/change-password",
  regValidate.passwordRules(), 
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accController.processPasswordChange)
);
// route to handle logout
router.get("/logout", (req, res) => {
  res.clearCookie("jwt"); // Removes the token cookie
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/"); // Redirect user to home view
  });
});


module.exports = router;