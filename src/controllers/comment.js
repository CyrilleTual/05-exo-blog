import { pool } from "../config/database.js";
export const commentAdd = async (req, res) => {
  const datas = req.body;

  const user = datas.alias;
  const msg = datas.comment;
  const id_story = datas.id_story;
  //const date = new Date().toISOString().slice(0, 19).replace("T", " ");
  //console.log(user, msg, date, id_story);

  try {
    const query = `INSERT INTO com (user, msg, date, id_story) VALUES (?, ?, NOW(), ?)`;
    await pool.execute(query, [user, msg, id_story]);
    res.redirect (`/story/${id_story}`)
    res.end();
  
  } catch (error) {
    res.json({ msg: error });
  }
};
