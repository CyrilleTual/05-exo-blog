import { Router } from "express";
import { commentAdd } from "../controllers/comment.js";


const router = Router();

router.post("/", commentAdd);

export default router;
