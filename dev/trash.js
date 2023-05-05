// route api permettant de récupérer toutes les catégories on gère les requetes SQL avec une fonction asynchrone afin de mettre en "pause"
// la dites requète tant qu'elle nous a pas retourné les données puisqu'on en a besoin pour les traiter
router.get("/api/v1/category", async (req, res) => {
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
 * Post story
 */
router.post("/api/v1/story", async (req, res) => {
  const { title } = req.body;
  const { content } = req.body;
  const { id_user } = req.body;
  const date = new Date().toISOString().slice(0, 19).replace("T", " ");
  try {
    const query = `INSERT INTO story (title, content, date, id_user) VALUES (?, ?, ?, ?)`;
    await pool.execute(query, [title, content, date, id_user]);
    res.end();
  } catch (error) {
    res.json({ msg: error });
  }
});

/**
 * get all / user
 */
router.get("/api/v1/user", async (req, res) => {
  try {
    const query = "SELECT id, alias FROM user";
    const result = await pool.execute(query);
    res.json({
      data: result[0],
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

/**
 * get one by  id  / user
 */
router.get("/api/v1/user/:id", async (req, res) => {
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
router.post("/api/V1/user", async (req, res) => {
  const { alias } = req.body;
  const { email } = req.body;
  const { pwd } = req.body;
  const { id_role } = req.body;
  const regdate = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    const query = `INSERT INTO user (alias, email, pwd, regdate, id_role) VALUES ( ?, ?, ?, ?, ?)`;
    await pool.execute(query, [alias, email, pwd, regdate, id_role]);
    res.end();
  } catch (error) {
    res.json({ msg: error });
  }
});

/**
 * get all / comments
 */
router.get("/api/v1/com", async (req, res) => {
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
router.get("/api/v1/com/:id", async (req, res) => {
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
router.post("/api/V1/com", async (req, res) => {
  const { user } = req.body;
  const { msg } = req.body;
  const { id_story } = req.body;
  const date = new Date().toISOString().slice(0, 19).replace("T", " ");

  console.log(user, msg, date, id_story);

  try {
    const query = `INSERT INTO com (user, msg, date, id_story) VALUES (?, ?, ?, ?)`;
    await pool.execute(query, [user, msg, date, id_story]);
    res.end();
  } catch (error) {
    res.json({ msg: error });
  }
});

/**
 * get all /photo
 */
router.get("/api/v1/photo", async (req, res) => {
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
router.get("/api/v1/photo/:id", async (req, res) => {
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
router.post("/api/V1/photo", async (req, res) => {
  const { url } = req.body;
  const { id_story } = req.body;
  try {
    const query = `INSERT INTO photo (url, id_story) VALUES ( ?, ?)`;
    const [result] = await pool.execute(query, [url, id_story]);
    console.log(result);
    res.end();
  } catch (error) {
    res.json({ msg: error });
  }
});

/**
 * get all / categorry
 */
router.get("/api/v1/category", async (req, res) => {
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
router.get("/api/v1/category/:id", async (req, res) => {
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
router.post("/api/v1/category", async (req, res) => {
  const { title } = req.body;
  try {
    const query = `INSERT INTO category (title) VALUES(?)`;
    const [result] = await pool.execute(query, [title]);
    console.log(result);
    res.json({ message: "insertion ok" });
    res.end();
  } catch (error) {
    res.json({ msg: error });
  }
});

/**
 * get story.name and all comments of one Story ( the same result with /api/v1/com?story=idOfStory )
 */
router.get("/api/v1/msgOfStory/:id", async (req, res) => {
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
router.get("/api/v1/allByAuthor/:id", async (req, res) => {
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
