import { Car, Check, Calendar, Users, X } from "lucide-react";
import { ParkingSlot } from "../context/AppContext";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";
import { clsx } from "clsx";

interface ParkingCardProps {
  slot: ParkingSlot;
  onApply: (id: string) => void;
  onApprove?: (slotId: string, applicantId: string) => void;
  isOwner?: boolean;
}

export function ParkingCard({ slot, onApply, onApprove, isOwner }: ParkingCardProps) {
  const { currentUser } = useAppContext();
  const hasApplied = currentUser && slot.applications.includes(currentUser.id);
  const statusColors = {
    available: "bg-emerald-100 text-emerald-700 border-emerald-200",
    filled: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[2rem] p-6 shadow-sm border border-emerald-50 hover:shadow-lg transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-[80px] opacity-50 pointer-events-none -z-10 group-hover:scale-110 transition-transform" />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-amber-100/50 p-4 rounded-[1.5rem] text-4xl shadow-inner flex items-center justify-center">
            {slot.status === "available" ? "🐢" : "💤"}
          </div>
          <div>
            <span className={clsx("text-xs font-bold px-3 py-1 rounded-full border mb-2 inline-block", statusColors[slot.status])}>
              {slot.status === "available" ? "AVAILABLE" : "FILLED"}
            </span>
            <h3 className="text-xl font-extrabold text-emerald-950 leading-tight">
              {slot.identifier}
            </h3>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3 text-emerald-600 font-medium text-sm bg-emerald-50/50 p-3 rounded-2xl border border-emerald-50">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>{slot.availableDates}</span>
        </div>
        {!isOwner && (
          <div className="flex items-center gap-3 text-emerald-600 font-medium text-sm bg-emerald-50/50 p-3 rounded-2xl border border-emerald-50">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>{slot.applications.length} applications</span>
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-emerald-50">
        {!isOwner && slot.status === "available" && (
          <button
            onClick={() => onApply(slot.id)}
            disabled={hasApplied}
            className={clsx(
              "w-full py-3 rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-2",
              hasApplied
                ? "bg-amber-100 text-amber-600 cursor-not-allowed shadow-none"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-200"
            )}
          >
            {hasApplied ? <><Check className="w-4 h-4" /> Applied</> : "Apply for Slot"}
          </button>
        )}

        {isOwner && slot.status === "available" && slot.applications.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-bold text-emerald-800 mb-2">Pending Applications:</p>
            {slot.applications.map((appId) => (
              <div key={appId} className="flex items-center justify-between bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                <span className="text-sm font-medium text-emerald-700">Resident #{appId}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove && onApprove(slot.id, appId)}
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-xl shadow-sm transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isOwner && slot.status === "available" && slot.applications.length === 0 && (
          <p className="text-center text-sm font-medium text-emerald-400 italic py-2">
            Waiting for applications...
          </p>
        )}
      </div>
    </motion.div>
  );
}