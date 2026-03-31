import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/userController.js";

import { authMiddleware } from "../utils/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route
router.get("/me", authMiddleware, getMe);

export default router;
