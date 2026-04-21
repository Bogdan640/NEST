import { useState } from "react";
import { Plus, Car } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { ParkingCard } from "../components/ParkingCard";
import { motion, AnimatePresence } from "motion/react";
import { PageHeader } from "../components/PageHeader";

export function Parking() {
  const { parking, setParking, currentUser } = useAppContext();
  const [tab, setTab] = useState<"Announcements" | "MySlots">("Announcements");

  const handleApply = (id: string) => {
    if (!currentUser) return;
    setParking(parking.map(slot => 
      slot.id === id ? { ...slot, applications: [...slot.applications, currentUser.id] } : slot
    ));
  };

  const handleApprove = (slotId: string, applicantId: string) => {
    setParking(parking.map(slot => 
      slot.id === slotId ? { ...slot, status: "filled", applications: [applicantId] } : slot
    ));
  };

  const displayedSlots = tab === "Announcements" 
    ? parking.filter(s => s.status === "available" && s.ownerId !== currentUser?.id)
    : parking.filter(s => s.ownerId === currentUser?.id);

  return (
    <div className="w-full relative pb-20">
      <PageHeader 
        title="Parking Pool" 
        subtitle="Share and request parking spaces." 
        emoji="🐢" 
        Icon={Car} 
        bgColor="bg-emerald-100" 
        shadowColor="shadow-emerald-200/50"
        rightContent={
          <div className="flex gap-2 bg-white/50 p-2 rounded-2xl border border-emerald-100 shadow-sm backdrop-blur-md">
            {["Announcements", "MySlots"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  tab === t
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                    : "text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                {t === "Announcements" ? "Find Parking" : "My Slots"}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {displayedSlots.map((slot) => (
            <ParkingCard
              key={slot.id}
              slot={slot}
              onApply={handleApply}
              onApprove={handleApprove}
              isOwner={tab === "MySlots"}
            />
          ))}
        </AnimatePresence>

        {displayedSlots.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="col-span-full py-20 text-center"
          >
            <div className="inline-flex bg-amber-50 p-6 rounded-[3rem] mb-4 shadow-inner">
              <Car className="w-16 h-16 text-amber-300" />
            </div>
            <h3 className="text-2xl font-bold text-amber-900 mb-2 tracking-tight">
              {tab === "Announcements" ? "No available slots" : "You haven't shared any slots"}
            </h3>
            <p className="text-amber-600/60 font-medium">Check back later or announce your own!</p>
          </motion.div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 md:bottom-10 right-6 md:right-10 bg-amber-500 text-amber-950 p-5 rounded-[2rem] shadow-xl shadow-amber-200 hover:bg-amber-400 transition-colors z-50 flex items-center justify-center group"
        aria-label="Create Slot"
      >
        <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
      </motion.button>
    </div>
  );
}