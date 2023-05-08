import { pool } from "../config/database.js"
import { mySession } from "../utils/utils.js";

async function recupPhotos(idStory) {
  let query1 = `SELECT url FROM photo WHERE id_story = ?`;
  let [resultPhoto] = await pool.execute(query1, [idStory]);
  return resultPhoto;
}


/**
 * Récupération des 3 derniers posts pour home page
 */

export const storiesLastest = async (req, res) => {
  
  const session = mySession(req);
  let result2 = [];

  try {
    // recupération des champs du post
    const query = `SELECT story.id AS storyID, story.title, story.date AS date, story.content, user.alias
      FROM story 
      JOIN user ON story.id_user = user.id 
      ORDER BY date DESC
      LIMIT 3`;
    const [result] = await pool.execute(query);

     let resu = async function (result) {
       for (const post of result) {
         const resultPhoto = await recupPhotos(post.storyID);
         //console.log ("resPhoto", resultPhoto)
         post.photos = resultPhoto;
         result2.push(post);
 
       }
       return result2;
     };


      resu(result).then((res2) => {
        console.log(res2);
        res.render("layout", {
          template: "./home",
          data: res2, 
          session: session,
        });
      });




  } catch (error) {
    res.json({ msg: error });
  }
};
