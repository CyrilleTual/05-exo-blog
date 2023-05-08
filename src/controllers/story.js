import { pool } from "../config/database.js";
import { mySession } from "../utils/utils.js";

async function recupPhotos (idStory) {
  let query1 = `SELECT url FROM photo WHERE id_story = ?`;
  let [resultPhoto] = await pool.execute(query1, [idStory]);
  return (resultPhoto);
}


/**
 * 
 * recupération de tous les posts /   
 */
export const storiesDisplay = async (req, res) => {
  const session = mySession(req);
  let result2 = [];
  try {
    // recupération des posts
    const query = `SELECT story.id as storyID, story.title, story.date, story.content, user.alias, category.title as category
      FROM story 
      JOIN user ON story.id_user = user.id 
      JOIN category_story ON category_story.id_story = story.id
      JOIN category ON category_story.id_category = category.id
      `;
    const [result] = await pool.execute(query)

    // pour chaque post recupérer les photos et les inserer comme nouvelle clé dans l'objet post
    // on fait un nouveau tableau de resultats result2 avec les nouveaux posts
    let resu = async function (result) {
      for (const post of result) {
        const resultPhoto = await recupPhotos(post.storyID);
        //console.log ("resPhoto", resultPhoto)
        post.photos = resultPhoto;
        result2.push(post);
        //console.log(result2); // ici on c'est bien le resultat que je veux *************************************
      }
      return result2
    }

    resu(result)
    .then (res2 =>{
      console.log(res2);
      res.render("layout", {
        template: "./stories",
        data: res2, /////////////////  pour l' utiliser ici ***************
        session: session,
      });
    })

    
    
  } catch (error) {
    res.json({ msg: error });
  }
};

/**
* Détails d'un post avec les photos et commentaires
 */

export const storyDetails =  async (req, res) => {
  const { id } = req.params;
  const session = {
    user: req.session.username || null,
    islog: req.session.isLogged || null,
    role: req.session.role || null,
  };
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
       session:session
     });

  } catch (error) {
    res.json({ msg: error });
  }
 
};