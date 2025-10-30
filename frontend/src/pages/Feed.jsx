import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const { user, logout } = useAuth();

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
          </div>
        ))}
      </div>
    </div>
  );
};
export default Feed;
