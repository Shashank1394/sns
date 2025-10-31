import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { motion } from "motion/react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registeration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text relative overflow-hidden">
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-linear-to-r from-blue-400 to-purple-500 blur-3xl opacity-80"
        animate={{
          x: ["20%", "-20%"],
          y: ["-10%", "10%"],
          scale: [1, 1.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      <motion.div className="relative z-10 w-[90%] max-w-sm bg-surface border border-[#222228] rounded-2xl shadow-[--shadow-glow] p-6">
        <h1 className="relative text-center text-2xl font-semibold mb-5">
          <span className="absolute inset-0 blur-md text-accent-light opacity-60">
            Register
          </span>
          <span className="relative bg-linear-to-r from-accent-light to-accent bg-clip-text text-transparent">
            Register
          </span>
        </h1>

        {error && <p className="text-red-400 mb-3 text-center">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-3">
          <input
            type="text"
            placeholder="Name..."
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email..."
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password..."
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Register</button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-accent-light hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
export default Register;
