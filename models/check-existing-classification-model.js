const pool = require("../database/")
const { classificationRules } = require("../utilities/classification-validation")

// **************************************8
// check for existing classification
// ***************************************
async function checkExistingClassification(classification_name) {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) AS count FROM classification WHERE classification_name = $1",
      [classification_name]
    );
    console.log(result.rows[0].count);
    return result.rows[0].count > 0; // Returns true if classification exists
  } catch (error) {
    console.error("Error checking classification: " + error);
    return false;
  }
}

// **************************************8
// check for existing inventory
// ***************************************
async function checkExistingInventory(inv_make, inv_model, inv_year) {
    try {
        const result = await pool.query(
            "SELECT COUNT(*) AS count FROM inventory WHERE inv_make = $1 AND inv_model = $2 AND inv_year = $3",
            [inv_make, inv_model, inv_year]
        );
        return result.rows[0].count > 0; // Returns true if inventory exists
    } catch (error) {
        console.error("Error checking inventory:", error);
        return false;
    }
}


module.exports = {checkExistingClassification, checkExistingInventory}