const pool = require("../database/")
const { classificationRules } = require("../utilities/classification-validation")

// **************************************8
// check for existing classificationRules
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



module.exports = {checkExistingClassification, }