const pool = require("../database/")

async function recordPurchase(inv_id, firstname, lastname, email) {
    const sql = `INSERT INTO purchase (inventory_id, buyer_firstname, buyer_lastname, buyer_email, purchase_date)
                 VALUES ($1, $2, $3, $4, NOW()) RETURNING *`;
    const result = await pool.query(sql, [inv_id, firstname, lastname, email]);

    return result.rowCount > 0; // Returns true if the insert was successful
};

module.exports = {recordPurchase}