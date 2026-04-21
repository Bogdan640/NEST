import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface AnimalLogoProps {
  emoji: string;
  Icon: LucideIcon;
  bgColor: string;
  shadowColor: string;
  size?: "sm" | "md" | "lg";
}

export function AnimalLogo({ emoji, Icon, bgColor, shadowColor, size = "md" }: AnimalLogoProps) {
  const sizeClasses = {
    sm: "w-10 h-10 text-xl",
    md: "w-16 h-16 text-3xl",
    lg: "w-24 h-24 text-5xl",
  };

  const iconClasses = {
    sm: "w-4 h-4 -bottom-1 -right-1",
    md: "w-6 h-6 -bottom-2 -right-2",
    lg: "w-8 h-8 -bottom-2 -right-2",
  };

  return (
    <motion.div
      initial={{ scale: 0, rotate: -15 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={`relative flex items-center justify-center rounded-[1.5rem] md:rounded-[2rem] shadow-xl ${sizeClasses[size]} ${bgColor} ${shadowColor}`}
    >
      <span className="drop-shadow-sm select-none">{emoji}</span>
      <div className={`absolute ${iconClasses[size]} bg-white text-emerald-600 rounded-full p-1 shadow-md border-2 border-emerald-50 flex items-center justify-center`}>
        <Icon className="w-full h-full" />
      </div>
    </motion.div>
  );
}
