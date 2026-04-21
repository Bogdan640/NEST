import { Book, Wrench, Package, Clock, ShieldCheck } from "lucide-react";
import { Resource } from "../context/AppContext";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";
import { clsx } from "clsx";

interface ResourceCardProps {
  resource: Resource;
  onReserve: (id: string) => void;
  onReturn: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusColors = {
  AVAILABLE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  BORROWED: "bg-rose-100 text-rose-700 border-rose-200",
  COOLDOWN: "bg-amber-100 text-amber-700 border-amber-200",
};

const typeEmojis = {
  TOOL: "🪚",
  BOOK: "📚",
  OTHER: "📦",
};

export function ResourceCard({ resource, onReserve, onReturn, onDelete }: ResourceCardProps) {
  const { currentUser } = useAppContext();
  const canDelete = currentUser?.role === "admin" || currentUser?.id === resource.ownerId;
  const isBorrowing = resource.borrowerId === currentUser?.id;

  const Icon = resource.type === "TOOL" ? Wrench : resource.type === "BOOK" ? Book : Package;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[2rem] p-6 shadow-sm border border-emerald-50 hover:shadow-lg transition-all flex flex-col h-full group relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="bg-emerald-100/50 p-4 rounded-3xl text-4xl shadow-inner flex items-center justify-center">
          {typeEmojis[resource.type as keyof typeof typeEmojis] || "📦"}
        </div>
        <span className={clsx("text-xs font-bold px-3 py-1 rounded-full border", statusColors[resource.status])}>
          {resource.status}
        </span>
      </div>

      <div className="flex-1 relative z-10">
        <h3 className="text-xl font-extrabold text-emerald-950 mb-2 leading-tight">{resource.name}</h3>
        <p className="text-sm text-emerald-600 font-medium mb-4 line-clamp-2 leading-relaxed">
          {resource.description}
        </p>

        <div className="flex items-center gap-2 mt-auto text-xs font-bold text-emerald-500 bg-emerald-50/50 py-2 px-3 rounded-xl border border-emerald-50">
          {resource.ownerId === "community" ? (
            <><ShieldCheck className="w-4 h-4 text-emerald-400" /> Community Owned</>
          ) : (
            <>Owner: {resource.ownerName}</>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-emerald-50">
        {resource.status === "AVAILABLE" && (
          <button
            onClick={() => onReserve(resource.id)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-md shadow-emerald-200 transition-colors flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4" /> Reserve Now
          </button>
        )}
        
        {resource.status === "BORROWED" && isBorrowing && (
          <button
            onClick={() => onReturn(resource.id)}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-2xl font-bold shadow-md shadow-amber-200 transition-colors"
          >
            Return Resource
          </button>
        )}

        {resource.status === "BORROWED" && !isBorrowing && (
          <button
            disabled
            className="w-full py-3 bg-slate-100 text-slate-400 rounded-2xl font-bold cursor-not-allowed"
          >
            Currently Borrowed
          </button>
        )}
        
        {resource.status === "COOLDOWN" && (
          <button
            disabled
            className="w-full py-3 bg-amber-50 text-amber-400 rounded-2xl font-bold cursor-not-allowed"
          >
            In Cooldown
          </button>
        )}
      </div>
    </motion.div>
  );
}