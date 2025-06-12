const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists){
            throw new Error("Email exists. Please log in or use different email")
            }
        }),
  
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
  validate.loginRules = () => {
    return [
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() 
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (!emailExists){
            throw new Error("Email does not exist. Please use a different email")
            }
        }),
  
      body("account_password")
        .trim()
        .notEmpty()
        .custom(async (account_password, { req }) => {
            const email = req.body.account_email; // Extract email from request
            const passwordMatch = await accountModel.checkMatchingPassword(email, account_password);
            if (!passwordMatch) {
            throw new Error("Password does not match the email. Please use a different email or password");
            }
        }),

    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

  /* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email, account_password } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
  *  Account Update Validation Rules
  * ********************************* */
validate.updateAccountRules = () => {
  return [
    // Validate first name
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("First name is required."),
    
    // Validate last name
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Last name is required."),
    
    // Validate email and ensure it's not already taken
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      // .custom(async (account_email, { req }) => {
      //   const emailExists = await accountModel.checkExistingEmail(account_email);
      //   if (emailExists > 0 && req.session.user.account_email !== account_email) {
      //     throw new Error("Email is already in use by another account.");
      //   }
      // }),
  ];
};

validate.checkUpdateAccountData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/update-account", {
      errors,
      title: "Update Account",
      nav,
      locals: {
        account: {
          account_id: req.session.user.account_id, 
          account_firstname: req.body.account_firstname, 
          account_lastname: req.body.account_lastname, 
          account_email: req.body.account_email
        }
      },
    });
    return;
  }
  next();
};

validate.passwordRules = () => {
  return [
    body("new_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password must be at least 12 characters long and contain uppercase, lowercase, numbers, and special characters."),
  ];
};

/* ******************************
 * Check data and return errors or continue to password update
 * ***************************** */
validate.checkUpdatePasswordData = async (req, res, next) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/update-account", {
      errors,
      title: "Update Account",
      nav,
      account_id: req.session.user.account_id, // Keeps the session active for user re-entry
      locals: {
        account: {
          account_id: req.session.user.account_id, 
          account_firstname: req.body.account_firstname, 
          account_lastname: req.body.account_lastname, 
          account_email: req.body.account_email
        }
      },
    });
    return;
  }
  next();
};


module.exports = validate