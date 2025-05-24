const utilities = require("../utilities/")

const errorController = {
    throwError: (req, res, next) => {
        next(new Error("Intentional 500 Error – This is a test!"));
    },

};

module.exports = errorController;