import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { motion } from "motion/react";
import { Heart, MessageCircle, LogOut } from "lucide-react";

const Feed = () => {
  const { user, logout } = useAuth();
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
    <div className="min-h-screen bg-background text-text px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* top bar */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">
            Welcome,{" "}
            <span className="bg-linear-to-r from-accent-light to-accent bg-clip-text text-transparent">
              {user?.name}
            </span>
          </h2>
          <button
            onClick={logout}
            className="flex items-center gap-1 text-red-500 hover:text-red-400 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* create post box */}
        <motion.form
          onSubmit={handleCreatePost}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-surface border border-[#222228] rounded-2xl p-4 shadow-[--shadow-glow]"
        >
          <textarea
            className="w-full bg-[#1f1f23] border border-[#2c2c30] text-gray-100 rounded-lg p-3 outline-none resize-none focus:ring-2 focus:ring-accent-light transition"
            rows="3"
            placeholder="What's on your mind?"
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
        </motion.form>

        {/* post feed */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {posts.length === 0 && (
            <p className="text-center text-gray-500 py-10">
              No posts yet. Start by writing something ✍️
            </p>
          )}

          {posts.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface border border-[#222228] rounded-2xl p-4 hover:shadow-[--shadow-glow] transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-accent-light">
                  {p.author?.name || "Unknown"}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(p.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="text-gray-200 mb-3">{p.content}</p>

              <div className="flex items-center gap-5 text-gray-400">
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

              {/* comment section */}
              {activePost === p._id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Feed;
