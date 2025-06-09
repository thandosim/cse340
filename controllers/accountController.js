const utilities = require("../utilities")
const accModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null //watch this if errors come up
  })
}
/* ****************************************
*  Deliver register view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accModel.getAccountByEmail(account_email)
  
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      req.session.user = { account_id: accountData.account_id, account_firstname: accountData.account_firstname, account_type: accountData.account_type };
      console.log("session data: ", req.session.user)

      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
    account_firstname: req.user ? req.user.account_firstname : "guest"
  })
}

/* ****************************************
 *  Deliver account update view
 * *************************************** */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav();
  
  // Retrieve the user's account data based on their session ID
  const accountData = await accModel.getAccountById(req.session.user.account_id);
  console.log("account info : ", accountData);

  // If account is not found, redirect to account management with an error message
  if (!accountData) {
    req.flash("notice", "Account not found.");
    return res.redirect("/account/");
  }

  // Render the account update view with existing user data
  res.render("account/update-account", {
    title: "Update Account",
    nav,
    locals: { account: accountData },
    errors: null
  });
}

/* ****************************************
 *  Process account update
 * *************************************** */
async function processAccountUpdate(req, res) {
  console.log("Update request received:", req.body);
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  const emailExists = await accModel.checkExistingEmail(account_email);

  // If the email already exists and belongs to another account, prevent update
  if (emailExists > 0) {
    req.flash("notice", "That email is already in use.");
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      account: req.body,
      errors: null
    });
  }

  // Update account information in the database
  const updateSuccess = await accModel.updateAccount(account_id, account_firstname, account_lastname, account_email);

  // Set success or failure flash message based on update result
  if (updateSuccess) {
    req.flash("notice", "Account updated successfully!");
  } else {
    req.flash("notice", "Account update failed.");
  }

  // Redirect to account management after processing
  return res.redirect("/account/");
}

/* ****************************************
 *  Process password change
 * *************************************** */
async function processPasswordChange(req, res) {
  let nav = await utilities.getNav();
  const { account_id, new_password } = req.body;

  // Ensure the new password meets minimum length requirement
  if (!new_password || new_password.length < 8) {
    req.flash("notice", "Password must be at least 8 characters.");
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      account: { account_id },
      errors: null
    });
  }

  // Hash the new password for security before storing in the database
  const hashedPassword = await bcrypt.hash(new_password, 10);
  const updateSuccess = await accModel.updatePassword(account_id, hashedPassword);

  // Set flash message based on password update result
  if (updateSuccess) {
    req.flash("notice", "Password updated successfully!");
  } else {
    req.flash("notice", "Password update failed.");
  }

  // Redirect to account management after processing
  return res.redirect("/account/");
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildUpdateAccount, processAccountUpdate, processPasswordChange }
