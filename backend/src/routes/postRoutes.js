import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getFeed,
  createPost,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", protect, getFeed);
router.post("/", protect, createPost);
router.delete("/:id", protect, deletePost);

export default router;
