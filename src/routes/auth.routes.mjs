import { Router } from "express";
import { login, logout, signup } from "../controllers/auth.controller.mjs";
const router = Router();

// auth post requests
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
