import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Clock, Leaf, LogOut } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { AnimalLogo } from "../components/AnimalLogo";

export function Pending() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAppContext();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6 text-emerald-950 relative overflow-hidden">
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 text-emerald-200 opacity-50 pointer-events-none"
      >
        <Leaf size={100} />
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 text-amber-200 opacity-40 pointer-events-none"
      >
        <Leaf size={140} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="max-w-md w-full bg-white/80 backdrop-blur-3xl p-12 rounded-[3rem] text-center shadow-2xl shadow-emerald-200 border border-white z-10"
      >
        <div className="flex justify-center mb-8 relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-amber-100 rounded-full blur-xl opacity-50"
          />
          <AnimalLogo emoji="🐌" Icon={Clock} bgColor="bg-amber-100" shadowColor="shadow-amber-200/50" size="lg" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-emerald-900 mb-4 tracking-tight">Pending Approval</h1>
        <p className="text-emerald-600 font-medium mb-6 text-lg leading-relaxed">
          Your request is being reviewed by the block administrator. We're getting your nest ready!
        </p>
        <p className="text-emerald-500 font-medium text-sm bg-emerald-50 py-3 px-4 rounded-2xl mb-10">
          You'll be notified via email once approved.
        </p>

        <button 
          onClick={handleLogout}
          className="text-emerald-400 hover:text-emerald-600 font-bold transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <LogOut className="w-4 h-4" />
          Return to Login
        </button>
      </motion.div>
    </div>
  );
}