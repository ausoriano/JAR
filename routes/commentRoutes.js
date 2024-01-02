import express from "express";

// Creating Routes for Comments

const router = express.Router();
import { authGuard } from "../middleware/authMiddleware.js";
import { createComment } from "../controllers/commentControllers.js";

// API Endpoint
router.post("/", authGuard, createComment);

export default router;
