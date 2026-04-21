import { LucideIcon } from "lucide-react";
import { AnimalLogo } from "./AnimalLogo";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  emoji: string;
  Icon: LucideIcon;
  bgColor?: string;
  shadowColor?: string;
  rightContent?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  subtitle, 
  emoji, 
  Icon, 
  bgColor = "bg-emerald-100/80", 
  shadowColor = "shadow-emerald-200/50",
  rightContent 
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 bg-white/50 p-6 rounded-[2.5rem] border border-emerald-100/50 backdrop-blur-sm shadow-sm">
      <div className="flex items-center gap-6">
        <AnimalLogo emoji={emoji} Icon={Icon} bgColor={bgColor} shadowColor={shadowColor} size="lg" />
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-900 tracking-tight">{title}</h1>
          <p className="text-emerald-600 font-medium mt-2 md:text-lg">{subtitle}</p>
        </div>
      </div>
      {rightContent && (
        <div className="flex-shrink-0">
          {rightContent}
        </div>
      )}
    </div>
  );
}
