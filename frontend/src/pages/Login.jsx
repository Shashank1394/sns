import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { motion } from "motion/react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text relative overflow-hidden">
      {/* animated background glow */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-linear-to-r from-accent-light to-accent blur-3xl opacity-80"
        animate={{
          x: ["-20%", "20%", "-10%"],
          y: ["-10%", "10%", "-20%"],
          scale: [1, 1.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-[90%] max-w-sm bg-surface border border-[#222228] rounded-2xl shadow-[--shadow-glow] p-6"
      >
        <h1 className="relative text-center text-2xl font-semibold mb-5">
          <span className="absolute inset-0 blur-md text-accent-light opacity-60">
            Login
          </span>
          <span className="relative bg-linear-to-r from-accent-light to-accent bg-clip-text text-transparent">
            Login
          </span>
        </h1>

        {error && <p className="text-red-400 mb-3 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email..."
            className="w-full bg-[#1f1f23] border border-[#2c2c30] rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-light outline-none transition"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password..."
            className="w-full bg-[#1f1f23] border border-[#2c2c30] rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-light outline-none transition"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-linear-to-r from-accent-light to-accent text-white font-semibold py-2 rounded-lg hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent-light hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
