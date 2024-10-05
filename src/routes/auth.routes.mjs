import { Router } from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/auth.controller.mjs";
import { verifyToken } from "../middlewares/verifyToken.mjs";
const router = Router();

// auth get requests
router.get("/check-auth", verifyToken, checkAuth);

// auth post requests
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;
