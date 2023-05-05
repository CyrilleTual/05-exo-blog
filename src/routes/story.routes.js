import { Router } from "express";
import { storiesDisplay } from "../controllers/story.js";
import { storyDetails } from "../controllers/story.js";

const router = Router();

router.get ('/', storiesDisplay);
router.get ( '/:id', storyDetails)

export default router; 