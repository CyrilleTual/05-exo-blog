import { Router } from "express";

import story_routes     from "./story.routes.js";
import comment_routes   from "./comment.routes.js"
import admin_routes     from "./admin.routes.js"
import auth_routes      from "./auth.routes.js";
import { storiesLastest } from "../controllers/home.js";

const router = Router();


router.get("/",  storiesLastest);

/**
 * Renvoi vers routeurs secondaires 
 */
router.use ("/story", story_routes); 
router.use ("/comment", comment_routes);
router.use ("/admin", admin_routes);
router.use("/auth", auth_routes);

export default router;