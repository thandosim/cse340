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
// // add new inventory item
// // ***************************************
async function insertInventory(vehicle) {
    try {
        const result = await pool.query(
            "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
            [
                vehicle.inv_make,
                vehicle.inv_model,
                vehicle.inv_year,
                vehicle.inv_description,
                vehicle.inv_image,
                vehicle.inv_thumbnail,
                vehicle.inv_price,
                vehicle.inv_miles,
                vehicle.inv_color,
                vehicle.classification_id,
            ]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error inserting inventory:", error);
        return false;
    }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
 async function deleteInventory(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    throw new Error("Delete Inventory Error")
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInventoryId, insertClassification, insertInventory, updateInventory, deleteInventory}