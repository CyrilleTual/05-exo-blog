import { Router } from "express";
import { pool } from "../config/database.js";

import story_routes from "./story.routes.js";
import comment_routes from "./comment.routes.js"
import { storiesLastest } from "../controllers/home.js";


const router = Router();




router.get("/", storiesLastest);

/**
 * Renvoi vers routeurs secondaires 
 */
router.use ("/story", story_routes); 
router.use ("/comment", comment_routes);


export default router;