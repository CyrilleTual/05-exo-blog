import express, { query } from "express";
import "dotenv/config";

import router from "./routes/index.routes.js";

// on récupère la variable d'environnement
import { LOCAL_PORT } from "./config/const.js";
const PORT = process.env.PORT || LOCAL_PORT;

const app = express();

app.set("views", "./src/views").set("view engine", "ejs");

app
  .use(express.json()) // basé sur body-parse rôle pour le json
  .use(express.static("public")) // set des repertoires avec ressources statiques acces direct
  .use(express.urlencoded({ extended: true })) // aussi basé sur body parser
  .use(router);

// route pour vérifier la connexion de notre application (serveur)
app.get("/", (req, res) => {
  res.json({ msg: `app running` });
});

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
