import { Router } from "express";
import authRouter from "./auth.routes.mjs";

const router = Router();

//auth routes
router.use("/auth", authRouter)

export default router;