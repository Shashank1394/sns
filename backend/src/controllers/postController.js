import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    const { content, imageUrl } = req.body;

    if (!content && !imageUrl) {
      return res.status(400).json({ message: "Post cannont be empty" });
    }

    const post = await Post.create({
      author: req.user.id,
      content,
      imageUrl,
    });

    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email avatarUrl")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({
      message: alreadyLiked ? "Unliked" : "Liked",
      likes: post.likes.length,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error toggling like", error: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: req.user.id, text });
    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate("author", "name email avatarUrl")
      .populate("comments.user", "name email avatarUrl");

    res.status(201).json({
      message: "Comment added",
      post: updatedPost,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding comment", error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) res.status(404).json({ message: "Post not found" });

    post.comments = post.comments.filter(
      (c) =>
        c._id.toString() !== req.params.commentId ||
        c.user.toString() !== req.user.id
    );

    await post.save();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting comment", error: err.message });
  }
};
