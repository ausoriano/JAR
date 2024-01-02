import express from "express";

// Creating Routes for Posts

const router = express.Router();
import {
   createPost,
   deletePost,
   getAllPosts,
   getPost,
   updatePost,
} from "../controllers/postControllers.js";
import { authGuard, canCUDPostsGuard } from "../middleware/authMiddleware.js";

// API Endpoint
router
   .route("/")
   .post(authGuard, canCUDPostsGuard, createPost)
   .get(getAllPosts);

router
   .route("/:slug")
   .put(authGuard, canCUDPostsGuard, updatePost)
   .delete(authGuard, canCUDPostsGuard, deletePost)
   .get(getPost);
router.delete;
export default router;
