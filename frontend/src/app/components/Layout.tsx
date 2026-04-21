import { ReactNode, useEffect } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router";
import { Home, Calendar, Wrench, Car, User, Settings, Shield, LogOut, BookOpen, Leaf, Wrench as ToolIcon, Map } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnimalLogo } from "./AnimalLogo";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { path: "/app/feed", icon: Home, emoji: "🐦", label: "Feed" },
  { path: "/app/events", icon: Calendar, emoji: "🦉", label: "Events" },
  { path: "/app/shed", icon: ToolIcon, emoji: "🦝", label: "Shared Shed" },
  { path: "/app/parking", icon: Car, emoji: "🐢", label: "Parking" },
];

export function Layout({ children }: { children: ReactNode }) {
  const { currentUser, setCurrentUser } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/");
  };

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-emerald-50 text-emerald-950 font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Top / Left Navigation */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-emerald-100 md:border-b-0 md:border-r md:w-64 flex-shrink-0 flex flex-row md:flex-col justify-between items-center md:items-stretch px-4 md:px-6 py-3 md:py-8 sticky top-0 md:h-screen z-50">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-2xl tracking-tight">
          <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
            <Home className="w-6 h-6" />
          </div>
          <span className="hidden md:inline">NEST</span>
        </div>

        <div className="hidden md:flex flex-col gap-3 mt-12 flex-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={cn("flex items-center gap-4 px-4 py-3 rounded-3xl transition-all font-medium", location.pathname === item.path ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200/50" : "text-emerald-700 hover:bg-emerald-100/50")}>
              <AnimalLogo 
                emoji={item.emoji} 
                Icon={item.icon} 
                bgColor={location.pathname === item.path ? "bg-white/20" : "bg-emerald-100"} 
                shadowColor="shadow-none" 
                size="sm" 
              />
              <span className="text-lg">{item.label}</span>
            </Link>
          ))}
          {currentUser.role === "admin" && (
            <Link to="/app/admin" className={cn("flex items-center gap-4 px-4 py-3 rounded-3xl transition-all font-medium mt-4", location.pathname === "/app/admin" ? "bg-amber-500 text-white shadow-lg shadow-amber-200/50" : "text-amber-700 hover:bg-amber-50")}>
              <AnimalLogo 
                emoji="🦁" 
                Icon={Shield} 
                bgColor={location.pathname === "/app/admin" ? "bg-white/20" : "bg-amber-100"} 
                shadowColor="shadow-none" 
                size="sm" 
              />
              <span className="text-lg">Admin Panel</span>
            </Link>
          )}
        </div>

        {/* User Dropdown Desktop */}
        <div className="hidden md:flex flex-col gap-2 mt-auto border-t border-emerald-100 pt-6">
          <Link to="/app/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-emerald-100/50 rounded-2xl transition-all">
            <img src={currentUser.avatar} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-emerald-200" />
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{currentUser.name}</span>
              <span className="text-xs text-emerald-500 font-medium">Apt {currentUser.apartment}</span>
            </div>
          </Link>
          <div className="flex items-center gap-1 justify-between px-2">
            <Link to="/app/settings" className="p-2 text-emerald-500 hover:bg-emerald-100 rounded-xl transition-all"><Settings className="w-5 h-5" /></Link>
            <button onClick={handleLogout} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Mobile menu simple toggle block */}
        <div className="md:hidden flex items-center gap-3">
          <img src={currentUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-emerald-200" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 pb-24 md:pb-8">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-emerald-100 flex justify-around p-4 z-50 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(16,185,129,0.15)] pb-safe">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className={cn("relative flex flex-col items-center justify-center p-2 rounded-3xl transition-all duration-300", location.pathname === item.path ? "-translate-y-4" : "")}>
            <AnimalLogo 
              emoji={item.emoji} 
              Icon={item.icon} 
              bgColor={location.pathname === item.path ? "bg-emerald-500 text-white" : "bg-emerald-50"} 
              shadowColor={location.pathname === item.path ? "shadow-lg shadow-emerald-200" : "shadow-none"}
              size={location.pathname === item.path ? "md" : "sm"}
            />
          </Link>
        ))}
      </nav>
    </div>
  );
}