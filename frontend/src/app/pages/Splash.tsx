import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Home, Leaf, KeyRound } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { AnimalLogo } from "../components/AnimalLogo";

export function Splash() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    setCurrentUser({
      id: "1",
      name: "Alice Green",
      email: "alice@nest.com",
      avatar: "https://i.pravatar.cc/150?u=1",
      role: "admin",
      apartment: "4A",
      status: "approved"
    });
    navigate("/app/feed");
  };

  return (
    <div className="min-h-screen bg-emerald-50 relative overflow-hidden flex items-center justify-center p-6 text-emerald-950">
      {/* Decorative Background Elements */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 text-emerald-200 opacity-50 pointer-events-none"
      >
        <Leaf size={120} />
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-20 text-emerald-300 opacity-30 pointer-events-none"
      >
        <Home size={180} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-200 border border-white relative z-10"
      >
        <div className="flex justify-center mb-8">
          <AnimalLogo emoji="🪹" Icon={Home} bgColor="bg-emerald-100" shadowColor="shadow-emerald-200/50" size="lg" />
        </div>
        <h1 className="text-3xl font-extrabold text-center text-emerald-900 mb-2">Welcome to NEST</h1>
        <p className="text-center text-emerald-600 font-medium mb-10">Your residential community platform</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-emerald-800 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="hello@nest.com"
              className="w-full px-5 py-4 bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl focus:outline-none focus:border-emerald-400 focus:bg-white transition-all text-emerald-900 placeholder-emerald-300 font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-emerald-800 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-5 py-4 bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl focus:outline-none focus:border-emerald-400 focus:bg-white transition-all text-emerald-900 placeholder-emerald-300 font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-xl shadow-emerald-200 transition-colors flex items-center justify-center gap-2"
          >
            <KeyRound className="w-5 h-5" />
            Sign In
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-emerald-600 font-medium">
            Don't have an account?{" "}
            <Link to="/register" className="text-amber-600 hover:text-amber-500 font-bold underline decoration-amber-200 underline-offset-4">
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}