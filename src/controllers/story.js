import { pool } from "../config/database.js";

/**
 * 
 * recupération de tous les posts /   
 */
export const storiesDisplay = async (req, res) => {
  try {
    // recupération des champs du post
    const query = `SELECT story.id as storyID, story.title, story.date, story.content, user.alias
      FROM story 
      JOIN user ON story.id_user = user.id `;
    const [result] = await pool.execute(query);
    res.render("layout", { template: "./stories", data: result });
  } catch (error) {
    res.json({ msg: error });
  }
};

/**
* Détails d'un post avec les photos et commentaires
 */

export const storyDetails =  async (req, res) => {
  const { id } = req.params;
  try {
    // recupération des champs du post
    const query1 = `SELECT story.title, story.date, story.content, user.alias
      FROM story 
      JOIN user ON story.id_user = user.id
      WHERE  story.id = ? `;
    const [post] = await pool.execute(query1, [id]);

    // récupérations des photos
    const query2 = `SELECT photo.url 
    FROM photo 
    JOIN story ON  photo.id_story = story.id 
    WHERE  story.id = ? `;
    const [photo] = await pool.execute(query2, [id]);

    // recupération des comments
    const query3 = `SELECT com.user, com.msg, com.date 
    FROM com 
    JOIN story ON  com.id_story = story.id 
    WHERE  story.id = ? `;
    const [com] = await pool.execute(query3, [id]);

     res.render("layout", {
       template: "./storyDetails",
       idStory: id,
       data: post[0],
       photo: photo,
       com: com,
     });

  } catch (error) {
    res.json({ msg: error });
  }
 
};