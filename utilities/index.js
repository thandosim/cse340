const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
* Build the invetory item detail view HTML
* ************************************** */
Util.buildVehicleDetailGrid = async function(data){
  console.log(data)
  if(typeof data != "undefined"){
    details = '<h2>' + data.inv_make + ' ' +  data.inv_model + ' Details' + '</h2>'
    details = '<ul id="detail-list">' 
      details += '<li>' + '<strong>Price</strong>: ' + '<span>$' 
      + new Intl.NumberFormat('en-US').format(data.inv_price) + '</span>' + '</li>'
      details += '<li>' + '<strong>Description</strong>: ' + data.inv_description + '</li>'
      details += '<li>' + '<strong>Color</strong>: ' + data.inv_color + '</li>'
      details += '<li>' + '<strong>Miles</strong>: ' + '<span>' 
      + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</span>' + '</li>'
    details += '</ul>'
    details += '<img src="' + data.inv_image 
      +'" alt="Image of '+ data.inv_make + ' ' + data.inv_model 
      +' on CSE Motors" />'
  } else { 
    details <strong>= '<p class="notice">Sorry, that vehicle could not be found.</p>'
  }
  return details
}

/*****************************************
 * classification dropdown menu for forms
 * *************************************** */ 
// Util.buildClassificationList = async function (classification_id = null) {
//     let data = await invModel.getClassifications();
//     let classificationList = '<select name="classification_id" id="classificationList" required>';
//     classificationList += "<option value=''>Choose a Classification</option>";

//     data.rows.forEach((row) => {
//         classificationList += `<option value="${row.classification_id}"`;
//         if (classification_id !== null && row.classification_id == classification_id) {
//             classificationList += " selected";
//         }
//         classificationList += `>${row.classification_name}</option>`;
//     });

//     classificationList += "</select>";
//     return classificationList;
// };
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications();
    let classificationList = '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";

    data.rows.forEach((row) => {
        const selected = classification_id && row.classification_id == classification_id ? " selected" : "";
        classificationList += `<option value="${row.classification_id}"${selected}>${row.classification_name}</option>`;
    });

    classificationList += "</select>";
    return classificationList;
};


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.session.returnTo = req.originalUrl
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ******************************************
*check user authority level
********************************************* */
Util.authorizeInventoryActions = (req, res, next) => {
    // Retrieve token from cookies
    const token = req.cookies.jwt;

    if (!token) {
        req.flash("notice", "You must be logged in to access this section.");
        return res.redirect('/account/login');
    }

    try {
        // Verify and decode the token
        const userData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Check if user is an "Employee" or "Admin"
        if (userData.account_type === "Employee" || userData.account_type === "Admin") {
            req.user = userData; // Attach user data to the request
            return next(); // Allow access
        } else {
            req.flash("notice", "Unauthorized: You do not have permission to access inventory management.");
            return res.redirect('/account/login');
        }
    } catch (err) {
        req.flash("notice", "Invalid or expired session. Please log in again.");
        return res.redirect('/account/login');
    }
}

module.exports = Util