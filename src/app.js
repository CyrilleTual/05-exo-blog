import express, { query } from "express";
import "dotenv/config";

// permets d'établir la connexion à la base de donnée
import { pool } from "./config/database.js";

// on récupère la variable d'environnement
import { LOCAL_PORT } from "./config/const.js";
const PORT = process.env.PORT || LOCAL_PORT;

const app = express();

app.set("views", "./src/views").set("view engine", "ejs");

app
  .use(express.json())
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
      data: result,
    });
  } catch (error) {
    res.json({ msg: error });
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
    const [result] = await pool.execute(query, [id]);

    res.json({
      data: result,
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

/**
 * Post story
 */
app.post ('/api/v1/story', async (req,res)=>{

  const { title } = req.body;
  const { content } = req.body;
  const { id_user } = req.body;
  const date = new Date().toISOString().slice(0, 19).replace("T", " ");
  try {
    const query = `INSERT INTO story (title, content, date, id_user) VALUES (?, ?, ?, ?)`;
    await pool.execute(query, [title, content, date, id_user]);
    res.end();    
  } catch (error) {
    res.json({msg: error})
  }
})


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
  const { id } = req.params;
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
 * post user (create user)
 */
app.post ("/api/V1/user", async (req, res) => {

  const { alias }   = req.body;
  const { email }   = req.body;
  const { pwd }     = req.body;
  const { id_role } = req.body;
  const regdate = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    const query = `INSERT INTO user (alias, email, pwd, regdate, id_role) VALUES ( ?, ?, ?, ?, ?)`;
    await pool.execute(query, [alias, email, pwd, regdate, id_role]);
    res.end();
  } catch (error) {
    res.json({msg: error})
  }  
});



/**
 * get all / comments
 */
app.get("/api/v1/com", async (req, res) => {
  try {
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
  const { id } = req.params;
  try {
    const query = "SELECT id, msg FROM com WHERE id = ? ";
    const [result] = await pool.execute(query, [id]);
    res.json({
      data: result,
    });
  } catch (error) {
    res.json({ msg: error });
  }
});
/**
 * post / comments
 */
app.post ('/api/V1/com', async (req, res) =>{

  const {user} = req.body;
  const {msg} = req.body;
  const {id_story} = req.body;
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

  console.log(user, msg, date, id_story);

  try {
    const query = `INSERT INTO com (user, msg, date, id_story) VALUES (?, ?, ?, ?)`;
    await pool.execute(query, [user, msg, date, id_story]);
    res.end();
  } catch (error) {
    res.json({ msg: error})
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
    const { id } = req.params;
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
 * post photo
 */
app.post ("/api/V1/photo", async (req, res) => {
  const {url} = req.body;
  const {id_story} = req.body;
  try {
    const query = `INSERT INTO photo (url, id_story) VALUES ( ?, ?)`;
    const [result] = await pool.execute(query, [url, id_story]);
    console.log(result);
    res.end();
  } catch (error) {
    res.json({msg: error})
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
  const { id } = req.params;
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
 * post category
 */
app.post("/api/v1/category", async (req, res) => {
  const {title} = req.body;
  try {
    const query = `INSERT INTO category (title) VALUES(?)`;
    const [result] = await pool.execute(query, [title]);
    console.log(result);
    res.end();
  } catch (error) {
    res.json({ msg: error});
  }
});


/**
 * get story.name and all comments of one Story ( the same result with /api/v1/com?story=idOfStory )
 */
app.get("/api/v1/msgOfStory/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const query =
      "SELECT STORY.title, STORY.date, msg FROM com JOIN story ON story.id = com.id_story WHERE story.id= ?";
    const [result] = await pool.execute(query, [id]);
    res.json({
      data: result,
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

/**
 * get all Stories and comments for one author
 */
app.get("/api/v1/allByAuthor/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const query = `SELECT story.title, story.date, story.content, photo.url, com.date, com.msg, com.user 
      FROM story 
      JOIN photo ON  photo.id_story = story.id 
      JOIN com ON com.id_story = story.id 
      WHERE  id_user = ? `;
    const [result] = await pool.execute(query, [id]);
    res.json({
      data: result,
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
