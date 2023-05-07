import { Router } from "express";
import { login, logout, loginProcess, register, registerProcess } from "../controllers/auth.js";




const router =  Router()

router.get ("/login", login)
router.get("/logout", logout);
router.get("/register", register);

router.post("/login", loginProcess);
router.post("/register", registerProcess);






export default router;