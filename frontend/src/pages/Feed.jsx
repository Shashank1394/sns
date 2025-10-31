import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { motion, AnimatePresence } from "motion/react";
import { Heart, MessageCircle } from "lucide-react";

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [activePost, setActivePost] = useState(null);
  const [commentText, setCommentText] = useState("");

  const fetchPosts = async () => {
    const res = await api.get("/posts");
    setPosts(res.data);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await api.post("/posts", { content });
    setContent("");
    fetchPosts();
  };

  const handleLike = async (postId) => {
    await api.put(`/posts/${postId}/like`);
    fetchPosts();
  };

  const handleComment = async (e, postId) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await api.post(`/posts/${postId}/comment`, { text: commentText });
    setCommentText("");
    setActivePost(null);
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background text-text px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Create Post Box */}
        <motion.form
          onSubmit={handleCreatePost}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-surface border border-[#222228] rounded-2xl p-5 shadow-[--shadow-glow] overflow-hidden"
        >
          <textarea
            className="w-full bg-[#1f1f23] border border-[#2c2c30] text-gray-100 rounded-lg p-3 outline-none resize-none focus:ring-2 focus:ring-accent-light transition"
            rows="3"
            placeholder={`What's on your mind, ${user?.name || "user"}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              className="bg-linear-to-r from-accent-light to-accent text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              Post
            </button>
          </div>
          {/* glowing accent line */}
          <motion.div
            className="absolute bottom-0 left-0 w-full h-[0.5] bg-linear-to-r from-accent-light to-accent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.form>

        {/* Feed Section */}
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {posts.length === 0 && (
            <p className="text-center text-gray-500 py-10">
              No posts yet. Start by writing something ✍️
            </p>
          )}

          <AnimatePresence>
            {posts.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.04 }}
                className="bg-surface border border-[#222228] rounded-2xl p-5 hover:shadow-[--shadow-glow] transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-accent-light">
                    {p.author?.name || "Anonymous"}
                  </p>
                  <span className="text-xs text-gray-500">
                    {new Date(p.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-200 mb-3">{p.content}</p>

                <div className="flex items-center gap-6 text-gray-400">
                  <button
                    onClick={() => handleLike(p._id)}
                    className="flex items-center gap-1 hover:text-accent-light transition"
                  >
                    <Heart size={16} /> {p.likes?.length || 0}
                  </button>
                  <button
                    onClick={() =>
                      setActivePost((prev) => (prev === p._id ? null : p._id))
                    }
                    className="flex items-center gap-1 hover:text-accent-light transition"
                  >
                    <MessageCircle size={16} /> {p.comments?.length || 0}
                  </button>
                </div>

                {/* Comments */}
                <AnimatePresence>
                  {activePost === p._id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 border-t border-[#2c2c30] pt-3"
                    >
                      <form
                        onSubmit={(e) => handleComment(e, p._id)}
                        className="flex gap-2 items-center mb-3"
                      >
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Add a comment..."
                          className="grow bg-[#1f1f23] border border-[#2c2c30] rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-accent-light outline-none transition"
                        />
                        <button
                          type="submit"
                          className="bg-linear-to-r from-accent-light to-accent text-white px-3 py-2 rounded-lg hover:opacity-90 transition"
                        >
                          Post
                        </button>
                      </form>

                      <div className="space-y-1">
                        {p.comments?.map((c) => (
                          <p key={c._id} className="text-sm text-gray-300">
                            <span className="font-medium text-accent-light">
                              {c.user?.name || "User"}
                            </span>
                            : {c.text}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Feed;
