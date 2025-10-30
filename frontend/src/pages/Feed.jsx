import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

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
    <div className="max-w-2xl mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Welcome, {user?.name}</h2>
        <button onClick={logout} className="text-red-600 hover:underline">
          Logout
        </button>
      </div>

      <form onSubmit={handleCreatePost} className="mb-6">
        <textarea
          className="border p-2 w-full rounded mb-2"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Post
        </button>
      </form>

      <div className="space-y-4">
        {posts.map((p) => (
          <div key={p._id} className="border p-3 rounded-lg">
            <p className="font-semibold">{p.author?.name}</p>
            <p>{p.content}</p>
            <p className="text-gray-400 text-sm">
              {new Date(p.createdAt).toLocaleString()}
            </p>

            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => handleLike(p._id)}
                className="hover:underline"
              >
                ♡{p.likes?.length || 0}
              </button>
              <button
                onClick={() =>
                  setActivePost((prev) => (prev === p._id ? null : p._id))
                }
                className="text-gray-600 hover:underline"
              >
                💬{p.comments?.length || 0}
              </button>
            </div>

            {activePost === p._id && (
              <div className="mt-2">
                <form
                  onSubmit={(e) => handleComment(e, p._id)}
                  className="flex gap-2 items-center"
                >
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="border p-1 grow rounded"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Post
                  </button>
                </form>
                <div className="mt-2">
                  {p.comments?.map((c) => (
                    <p key={c._id} className="text-sm text-gray-700">
                      <b>{c.user?.name || "Unknown"}:</b> {c.text}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Feed;
