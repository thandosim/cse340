const utilities = require("../utilities/")

const errorController = {
    throwError: (req, res, next) => {
        next(new Error("Intentional 500 Error – This is a test!"));
    },

    handleErrors: (err, req, res, next) => {
        console.error(`Error at: "${req.originalUrl}": ${err.message}`);
        
        res.status(err.status || 500).render("errors/error", {
            title: err.status || "Server Error",
            message: err.message || "Oops! Something went wrong.",
            nav: req.nav || [] // Ensure nav is passed if needed
        });
    }
};

module.exports = errorController;