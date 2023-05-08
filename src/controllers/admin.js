import { pool } from "../config/database.js";
import { mySession } from "../utils/utils.js";

/**
 * recupération de tous les posts /   
 */
export const adminIndex = async (req, res) => {

    const session =mySession(req); 
  try {
    // recupération des champs du post
    const query = `SELECT story.id AS storyID, story.title, story.date, story.content, user.alias
      FROM story 
      JOIN user ON story.id_user = user.id `;
    const [result] = await pool.execute(query);

    // pour chaque post recupérer les photos et les inserer comme nouvelle clé dans l'objet post

    res.render("layout", { template: "./admin/index", data: result, session:session});
  } catch (error) {
    res.json({ msg: error });
  }
};

/**
* Détails d'un post avec les photos et commentaires
* pour edit
 */
export const editCreatePost =   async (req, res) => {
  const { id } = req.params;
  const session = {
    user: req.session.username || null,
    islog: req.session.isLogged || null,
    role: req.session.role || null,
  };
  try {
    // recupération des champs du post
    const query1 = `SELECT story.id AS storyId, story.title, story.date, story.content, user.alias, user.id AS userId
      FROM story 
      JOIN user ON story.id_user = user.id
      WHERE  story.id = ? `;
    const [post] = await pool.execute(query1, [id]);

    // récupérations des photos
    const query2 = `SELECT photo.url, photo.id AS idPhoto 
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

    console.log( id, post[0], photo, com)

     res.render("layout", {
       template: "./admin/editCreatePost",
       idStory: id,
       data: post[0],
       photo: photo,
       com: com,
       session: session
     });

  } catch (error) {
    res.json({ msg: error });
  }
 
};


/**
 *affichage du formiulaire de création et d'édition
 */
export const createStory = async (req, res) => {

    const session = mySession(req);
    // on doit recupérer la liste des catégories 
    try {
      // recupération des champs du post
      const query = `SELECT * FROM category `;
      const [categories] = await pool.execute(query);
       res.render("layout", {
         template: "./admin/editCreatePost",
         data: [],
         session: session,
         categories: categories,
       });
    } catch (error) {
      res.json({ msg: error });
    }

}

/**
 * Création et edit / traitement après le post
 */
export const editCreateProcess = async (req, res) => {
    
    const { idUser, alias, title, comment, idCategory } = req.body ;


    /**
    * si pas d'id on est dans le cas d'une création -> création d'un id
    */
    if (!("idStory" in req.body)){

        /**
         * id user à recupérer 
         */

        let idUser = req.session.idUser;

        console.log ('is user : ', idUser)
        //!("idUser" in req.body)?  idUser = "1" : idUser = req.body.idUser

        // on insère la story
        try {
        // table Story ET on recupère l'id de l'enregistrement créé
        const query = `INSERT INTO story (title, content, date, id_user) VALUES (?,?, NOW(), ?)`;
        await pool.execute(query, [title, comment, idUser]);

        // table category_story - il nous faut id de story crée
        const query2 = `SELECT LAST_INSERT_ID()`
        const [[toto]] = await pool.execute(query2);
        const id_story = (Object.values(toto))[0];     

        //console.log ( "les ids", id_story, idCategory)
        const query3 = `INSERT INTO category_story (id_story, id_category) VALUES (?,?)`;
        await pool.execute(query3, [id_story, idCategory]);
        res.redirect (`/story`)
        res.end();
      
        } catch (error) {
        res.json({ msg: error });
        }
    }else{
        /**
         * On est dans le cas d'une modification: on recupère l'id de la story 
         */
        const idStory = req.body.idStory ; 
        // on insere dans l'ancienne story les nouvelles valeurs de title, comment
        try {
            const query = `UPDATE story SET title=?, content =?  WHERE id = ?`;
            await pool.execute(query, [title, comment, idStory])
            res.redirect(`/admin`);
            res.end();
        } catch (error) {
           res.json({ msg: error }); 
        }
    }
    res.end();
}

/**
 * Delete Story 
 */
export const deleteStory = async (req, res) => {
    const role=  req.session.role || null;
    const { id } = req.params;
    try {
        const query = `DELETE FROM story WHERE id = ?`;
        await pool.execute(query, [id]);
        res.redirect (`/admin`)
        res.end();
    } catch (error) {
        res.json({ msg: error });
    }
};


