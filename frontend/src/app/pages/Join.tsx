import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { DoorOpen } from "lucide-react";
import { AnimalLogo } from "../components/AnimalLogo";

export function Join() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate("/pending");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6 text-emerald-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-8">
          <AnimalLogo emoji="🐿️" Icon={DoorOpen} bgColor="bg-amber-100" shadowColor="shadow-amber-200/50" size="lg" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-emerald-900 mb-4 tracking-tight">Join Your Building</h1>
        <p className="text-emerald-600 text-lg mb-10 font-medium">
          Enter the unique code for your apartment block to connect with your community.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="e.g. BLK-2023"
            className="w-full text-center text-3xl tracking-widest px-6 py-6 bg-white border-2 border-emerald-200 rounded-[2rem] focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all font-bold text-emerald-900 placeholder-emerald-200 shadow-xl shadow-emerald-100/50 uppercase"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={8}
            required
          />
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-3xl font-bold text-xl shadow-xl shadow-amber-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-6 h-6 border-4 border-amber-950 border-t-transparent rounded-full"
              />
            ) : (
              "Join Community"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}