import { useState } from "react";
import { Calendar, Plus } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { EventCard } from "../components/EventCard";
import { motion, AnimatePresence } from "motion/react";
import { PageHeader } from "../components/PageHeader";

export function Events() {
  const { events, setEvents, currentUser } = useAppContext();
  const [filter, setFilter] = useState<string>("ALL");

  const handleJoin = (id: string) => {
    if (!currentUser) return;
    setEvents(events.map(ev => 
      ev.id === id ? { ...ev, attendees: [...ev.attendees, currentUser.id] } : ev
    ));
  };

  const handleLeave = (id: string) => {
    if (!currentUser) return;
    setEvents(events.map(ev => 
      ev.id === id ? { ...ev, attendees: ev.attendees.filter(uid => uid !== currentUser.id) } : ev
    ));
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

  const filteredEvents = events.filter(ev => {
    if (filter === "ALL") return true;
    return ev.type === filter;
  });

  return (
    <div className="w-full relative pb-20">
      <PageHeader 
        title="Community Events" 
        subtitle="Discover what's happening around you." 
        emoji="🦉" 
        Icon={Calendar} 
        bgColor="bg-amber-100" 
        shadowColor="shadow-amber-200/50"
        rightContent={
          <div className="flex gap-2 bg-white p-2 rounded-2xl border border-emerald-100 shadow-sm backdrop-blur-md">
            {["ALL", "SOCIAL", "MEETING", "MAINTENANCE"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === type
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                    : "text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              onJoin={handleJoin}
              onLeave={handleLeave}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
        {filteredEvents.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="col-span-full py-20 text-center"
          >
            <div className="inline-flex bg-emerald-50 p-6 rounded-[3rem] mb-4">
              <Calendar className="w-16 h-16 text-emerald-300" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-900 mb-2">No events found</h3>
            <p className="text-emerald-500 font-medium">Be the first to create one!</p>
          </motion.div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 md:bottom-10 right-6 md:right-10 bg-amber-500 text-amber-950 p-5 rounded-[2rem] shadow-xl shadow-amber-200 hover:bg-amber-400 transition-colors z-50 flex items-center justify-center"
        aria-label="Create Event"
      >
        <Plus className="w-8 h-8" />
      </motion.button>
    </div>
  );
}
