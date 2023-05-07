import { Router } from "express";
import { login, logout, loginProcess } from "../controllers/auth.js";




const router =  Router()

router.get ("/login", login)
router.get("/logout", logout);

router.post("/login", loginProcess)






export default router;