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
