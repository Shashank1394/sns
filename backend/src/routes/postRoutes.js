import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getFeed,
  createPost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
} from "../controllers/postController.js";

const router = express.Router();

router.route("/").get(protect, getFeed).post(protect, createPost);
router.route("/:id").delete(protect, deletePost);
router.put("/:id/like", protect, toggleLike);
router.post("/:id/comment", protect, addComment);
router.delete("/:id/comment/:commentId", protect, deleteComment);

export default router;
