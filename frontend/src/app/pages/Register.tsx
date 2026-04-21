import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Home, UserPlus } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { AnimalLogo } from "../components/AnimalLogo";

export function Register() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAppContext();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    apartment: "",
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      id: "new",
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      avatar: "https://i.pravatar.cc/150?u=new",
      role: "resident",
      apartment: formData.apartment,
      status: "pending"
    });
    navigate("/join");
  };

  return (
    <div className="min-h-screen bg-emerald-50 relative overflow-hidden flex items-center justify-center p-6 text-emerald-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-lg bg-white/80 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-200 border border-white relative z-10"
      >
        <div className="flex justify-center mb-6">
          <AnimalLogo emoji="🌱" Icon={UserPlus} bgColor="bg-emerald-100" shadowColor="shadow-emerald-200/50" size="lg" />
        </div>
        <h1 className="text-3xl font-extrabold text-center text-emerald-900 mb-2">Create Account</h1>
        <p className="text-center text-emerald-600 font-medium mb-8">Join your residential community</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-emerald-800 ml-1">First Name</label>
              <input
                type="text"
                placeholder="John"
                className="w-full px-4 py-3 bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl focus:outline-none focus:border-emerald-400 focus:bg-white transition-all text-emerald-900 placeholder-emerald-300 font-medium"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-emerald-800 ml-1">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                className="w-full px-4 py-3 bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl focus:outline-none focus:border-emerald-400 focus:bg-white transition-all text-emerald-900 placeholder-emerald-300 font-medium"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-emerald-800 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="hello@nest.com"
              className="w-full px-4 py-3 bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl focus:outline-none focus:border-emerald-400 focus:bg-white transition-all text-emerald-900 placeholder-emerald-300 font-medium"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-emerald-800 ml-1">Apartment Number</label>
            <input
              type="text"
              placeholder="e.g. 4B"
              className="w-full px-4 py-3 bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl focus:outline-none focus:border-emerald-400 focus:bg-white transition-all text-emerald-900 placeholder-emerald-300 font-medium"
              value={formData.apartment}
              onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-emerald-800 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl focus:outline-none focus:border-emerald-400 focus:bg-white transition-all text-emerald-900 placeholder-emerald-300 font-medium"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-xl shadow-emerald-200 transition-colors mt-4"
          >
            Create Account
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-emerald-600 font-medium">
            Already have an account?{" "}
            <Link to="/" className="text-amber-600 hover:text-amber-500 font-bold underline decoration-amber-200 underline-offset-4">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}