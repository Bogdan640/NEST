import { Calendar, MapPin, Users, Check, X } from "lucide-react";
import { format } from "date-fns";
import { Event } from "../context/AppContext";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";
import { clsx } from "clsx";

interface EventCardProps {
  event: Event;
  onJoin: (id: string) => void;
  onLeave: (id: string) => void;
  onDelete?: (id: string) => void;
}

const typeColors = {
  MEETING: "bg-blue-100 text-blue-700 border-blue-200",
  SOCIAL: "bg-amber-100 text-amber-700 border-amber-200",
  MAINTENANCE: "bg-rose-100 text-rose-700 border-rose-200",
  OTHER: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const typeEmojis = {
  MEETING: "🤝",
  SOCIAL: "🎈",
  MAINTENANCE: "🔧",
  OTHER: "🌿",
};

export function EventCard({ event, onJoin, onLeave, onDelete }: EventCardProps) {
  const { currentUser } = useAppContext();
  const isAttending = currentUser && event.attendees.includes(currentUser.id);
  const capacityPct = event.maxCapacity ? (event.attendees.length / event.maxCapacity) * 100 : 0;
  const isFull = event.maxCapacity && event.attendees.length >= event.maxCapacity;
  const canDelete = currentUser?.role === "admin" || currentUser?.id === event.creatorId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] p-6 shadow-sm border border-emerald-50 hover:shadow-lg transition-all relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] opacity-50 pointer-events-none -z-10 group-hover:scale-110 transition-transform" />
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-start gap-4">
          <div className="bg-emerald-100/50 p-4 rounded-[1.5rem] shadow-inner text-3xl flex-shrink-0">
            {typeEmojis[event.type as keyof typeof typeEmojis] || "🌿"}
          </div>
          <div>
            <span className={clsx("inline-block text-xs font-bold px-3 py-1 rounded-full border mb-2", typeColors[event.type as keyof typeof typeColors])}>
              {event.type}
            </span>
            <h3 className="text-xl font-extrabold text-emerald-950 tracking-tight leading-tight">{event.title}</h3>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 shadow-inner">
            <span className="block text-xl font-black text-emerald-700 leading-none">
              {format(new Date(event.date), "dd")}
            </span>
            <span className="block text-xs font-bold text-emerald-500 uppercase tracking-wider mt-1">
              {format(new Date(event.date), "MMM")}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-emerald-600 font-medium text-sm">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>{format(new Date(event.date), "h:mm a")}</span>
        </div>
        <div className="flex items-center gap-3 text-emerald-600 font-medium text-sm">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-3 text-emerald-600 font-medium text-sm">
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Organized by {event.creatorName}</span>
        </div>
      </div>

      {event.maxCapacity && (
        <div className="mb-6">
          <div className="flex justify-between text-xs font-bold text-emerald-500 mb-2">
            <span>{event.attendees.length} attending</span>
            <span>Max {event.maxCapacity}</span>
          </div>
          <div className="w-full bg-emerald-100 rounded-full h-2.5 overflow-hidden border border-emerald-200/50">
            <div
              className={clsx("h-2.5 rounded-full transition-all duration-1000", isFull ? "bg-rose-400" : "bg-emerald-400")}
              style={{ width: `${Math.min(capacityPct, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-emerald-50">
        {isAttending ? (
          <button
            onClick={() => onLeave(event.id)}
            className="flex-1 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
        ) : (
          <button
            onClick={() => onJoin(event.id)}
            disabled={isFull}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-md shadow-emerald-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" /> {isFull ? "Full" : "Join Event"}
          </button>
        )}
        
        {canDelete && onDelete && (
          <button
            onClick={() => onDelete(event.id)}
            className="p-3 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}