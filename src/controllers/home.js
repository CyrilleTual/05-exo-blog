import { pool } from "../config/database.js";

/**
 * Récupération des 3 derniers posts pour home page
 */


export const storiesLastest = async (req, res) => {
  const session = {
    user: req.session.username || null,
    islog: req.session.isLogged || null,
    role: req.session.role || null,
    idUser: req.session.idUser || null,
  };

  console.log(session);
  try {
    const query = "SELECT title, id, content, date FROM story LIMIT 3";
    const [result] = await pool.execute(query);
    res.render("layout", { template: "./home", data: result, session:session});
  } catch (error) {
    res.json({ msg: error });
  }
};
