import express from "express";
import "dotenv/config";

// permets d'établir la connexion à la base de donnée
import { pool } from "./config/database.js";

// on récupère la variable d'environnement 
import { LOCAL_PORT } from "./config/const.js";
const PORT = process.env.PORT || LOCAL_PORT;

const app = express();

app
    .set("views", "./src/views")
    .set("view engine", "ejs");

app
    .use(express.static("public"))
    .use(express.urlencoded({ extended: true }));

// route pour vérifier la connexion de notre application (serveur)
app.get("/", (req, res) => {
    res.json({ msg: "app running" });
});

// route api permettant de récupérer toutes les catégories on gère les requetes SQL avec une fonction asynchrone afin de mettre en "pause" 
// la dites requète tant qu'elle nous a pas retourné les données puisqu'on en a besoin pour les traiter 
app.get("/api/v1/category", async (req, res) => {
    // le bloc try catch permet de gérer des instructions asynchrones
    // try -> test les instructions, si il y a une erreur ça passe dans le bloc catch
    try {
        const query = "SELECT id, title FROM category";
        
        const [result] = await pool.execute(query);
        res.json({
            data: result
        });
    } catch (error) {
        res.json({msg : error})
    }
});

/**
 * Get all / story
 */
app.get("/api/v1/story", async (req, res) => {
  try {
    const query = "SELECT id, title FROM story";
    const [result] = await pool.execute(query);
    res.json({
      data: result,
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

/**
 * get one by id / story
 */
app.get("/api/v1/story/:id", async (req, res) => {
    const { id } = req.params;
    try {
    const query = "SELECT id, title FROM story WHERE id = ? ";
    const [result] = await pool.execute(query,[id]);

    res.json({
      data: result,
    });
  } catch (error) {
    res.json({ msg: error });
  }
});
/**
 * get all / user
 */
app.get("/api/v1/user", async (req, res) => {
  try {
    const query = "SELECT id, alias FROM user";
    const [result] = await pool.execute(query);
    res.json({
      data: result,
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

/**
 * get one by  id  / user
 */
app.get("/api/v1/user/:id", async (req, res) => {
    const {id} = req.params
  try {
    const query = "SELECT id, alias FROM user WHERE id = ?";
    const [result] = await pool.execute(query, [id]);
    res.json({
      data: result,
    });
  } catch (error) {
    res.json({ msg: error });
  }
});


/**
 * get all / comments et get all comments by id of Story
 */
app.get("/api/v1/com", async (req, res) => {
  try {

    // get all comments of one story with id story in url
    //  url /api/v1/com?story=idOfStory
    //
    const idStory = req.query.idStory;   
    if (idStory) {        
        try {
        const query =
            "SELECT msg FROM com JOIN story ON story.id = com.id_story WHERE story.id= ?";
        const [result] = await pool.execute(query, [idStory]);
        res.json({
            data: result,
        });
        } catch (error) {
        res.json({ msg: error });
        }
    }

    const query = "SELECT id, msg FROM com";
    const [result] = await pool.execute(query);
    res.json({
      data: result,
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

/**
 * get one /id  comments 
 */
app.get("/api/v1/com/:id", async (req, res) => {
    const {id} = req.params
    try {
    const query = "SELECT id, msg FROM com WHERE id = ? ";
    const [result] = await pool.execute(query,[id]);
    res.json({
      data: result,
    });
  } catch (error) {
    res.json({ msg: error });
  }
});



/**
 * get all /photo
 */
app.get("/api/v1/photo", async (req, res) => {
  try {
    const query = "SELECT id, url, alt FROM photo";
    const [result] = await pool.execute(query);
    res.json({
      data: result,
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

/**
 * get One by id / photo
 */
app.get("/api/v1/photo/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const query = "SELECT id, url  FROM photo WHERE id =? ";
    const [result] = await pool.execute(query, [id]);
    res.json({
      data: result,
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

/**
 * get all / categorry
 */
app.get("/api/v1/category", async (req, res) => {
  try {
    const query = "SELECT id, title FROM category";
    const [result] = await pool.execute(query);
    res.json({
      data: result,
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

/**
 * get one by id / category
 */
app.get("/api/v1/category/:id", async (req, res) => {
    const {id} = req.params
  try {
    const query = "SELECT id, title FROM category WHERE id = ?";
    const [result] = await pool.execute(query, [id]);
    res.json({
      data: result,
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

/**
 * get all comments of one Story ( the same result with /api/v1/com?story=idOfStory )
 */
app.get("/api/v1/msgOfStory/:id", async (req, res) => {
    const {id} = req.params
  try {
    const query = "SELECT msg FROM com JOIN story ON story.id = com.id_story WHERE story.id= ?"
    const [result] = await pool.execute(query, [id]);
    res.json({
      data: result,
    });
  } catch (error) {
    res.json({ msg: error });
  }
});


app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
