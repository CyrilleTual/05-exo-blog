import { Router }           from "express";
import { adminIndex }       from "../controllers/admin.js";
import { editCreatePost, createStory, editCreateProcess, deleteStory }   from "../controllers/admin.js"


const router = Router ();

router.get ('/', adminIndex );
router.get ('/edit/:id', editCreatePost);
router.get ('/createStory', createStory);
router.post ('/editCreateProcess', editCreateProcess);
router.get ('/delete/story/:id', deleteStory)

export default router;