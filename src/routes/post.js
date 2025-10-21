import express from "express";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// public
router.get("/", getPosts);
router.get("/:id", getPost);

// protected
router.post("/", authenticateToken, createPost);
router.put("/:id", authenticateToken, updatePost);
router.delete("/:id", authenticateToken, deletePost);

export default router;
