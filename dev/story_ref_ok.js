import { pool } from "../src/config/database.js";

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
  const session = {
    user: req.session.username || null,
    islog: req.session.isLogged || null,
    role: req.session.role || null,
  };
  try {
    // recupération des posts
    const query = `SELECT story.id as storyID, story.title, story.date, story.content, user.alias, category.title
      FROM story 
      JOIN user ON story.id_user = user.id 
      JOIN category_story ON category_story.id_story = story.id
      JOIN category ON category_story.id_category = category.id
      `;
    const [result] = await pool.execute(query);

    // pour chaque post recupérer les photos et les inserer comme nouvelle clé dans l'objet post
    // on fait un nouveau tableau de resultats result2 avec les nouveaux posts
    let result2 = [];
    await result.forEach(async (post) => {
      const resultPhoto = await recupPhotos(post.storyID);
      //console.log ("resPhoto", resultPhoto)
      post.photos = resultPhoto;
      result2.push(post);
      console.log (result2);  // ici on c'est le resultat que je veux 
    });


    res.render("layout", {
      template: "./stories",
      data: result,
      session: session,
    });
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