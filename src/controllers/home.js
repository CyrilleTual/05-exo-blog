import { pool } from "../config/database.js";

/**
 * Récupération des 3 derniers posts pour home page
 */
export const storiesLastest = async (req, res) => {
  try {
    const query = "SELECT title, id, content, date FROM story LIMIT 3";
    const [result] = await pool.execute(query);
    res.render("layout", { template: "./home", data: result });
  } catch (error) {
    res.json({ msg: error });
  }
};
