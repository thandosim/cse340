const express = require("express");
const router = new express.Router();
const errorController = require("../controllers/errorController");
const utilities = require("../utilities");

router.get("/test-error", utilities.handleErrors(errorController.throwError));

module.exports = router;