const pool = require("../database/")
const { classificationRules } = require("../utilities/classification-validation")
const invModel = require("../models/inventory-model");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get a specific inventory item detail by inv_id
 * ************************** */
async function getInventoryByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i  
      WHERE i.inv_id = $1`,
      [inventory_id]
    )
    return data.rows
  } catch (error) {
    console.error("getinventoryitembyid error " + error)
  }
}

/* ************************************
add new classification
************************************* */
async function insertClassification(classification_name) {
    try {
        const result = await pool.query("INSERT INTO classification (classification_name) VALUES ($1)", [classification_name]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Add new classification error " + error);
        return false;
    }
}

// // **************************************8
// // check for existing classificationRules
// // ***************************************
// async function checkExistingClassification(classification_name) {
//   try {
//     const result = await pool.query(
//       "SELECT COUNT(*) AS count FROM classification WHERE classification_name = $1",
//       [classification_name]
//     );
//     console.log(result.rows);
//     return result.rows > 0; // Returns true if classification exists
//   } catch (error) {
//     console.error("Error checking classification: " + error);
//     return false;
//   }
// }


module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInventoryId, insertClassification }