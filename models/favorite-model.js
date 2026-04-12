const pool = require("../database/")

/* ***************************
 *  Add a favorite
 * ************************** */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = "INSERT INTO public.favorites (account_id, inv_id) VALUES ($1, $2) RETURNING *"
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rows[0]
  } catch (error) {
    console.error("addFavorite error " + error)
    throw error
  }
}

/* ***************************
 *  Get favorites by account ID
 * ************************** */
async function getFavoritesByAccountId(account_id) {
  try {
    const sql = `
      SELECT f.favorite_id, f.account_id, f.inv_id, f.favorite_date, 
             i.inv_make, i.inv_model, i.inv_year, i.inv_price, i.inv_thumbnail 
      FROM public.favorites f
      JOIN public.inventory i ON f.inv_id = i.inv_id
      WHERE f.account_id = $1
      ORDER BY f.favorite_date DESC
    `
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    console.error("getFavoritesByAccountId error " + error)
    throw error
  }
}

/* ***************************
 *  Remove a favorite
 * ************************** */
async function removeFavorite(account_id, inv_id) {
  try {
    const sql = "DELETE FROM public.favorites WHERE account_id = $1 AND inv_id = $2 RETURNING *"
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rows[0]
  } catch (error) {
    console.error("removeFavorite error " + error)
    throw error
  }
}

/* ***************************
 *  Check if favorite exists
 * ************************** */
async function checkFavorite(account_id, inv_id) {
  try {
    const sql = "SELECT * FROM public.favorites WHERE account_id = $1 AND inv_id = $2"
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rowCount > 0
  } catch (error) {
    console.error("checkFavorite error " + error)
    throw error
  }
}

module.exports = {
  addFavorite,
  getFavoritesByAccountId,
  removeFavorite,
  checkFavorite
}
