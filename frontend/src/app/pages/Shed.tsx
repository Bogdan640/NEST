import { useState } from "react";
import { Plus, PackageOpen, Wrench } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { ResourceCard } from "../components/ResourceCard";
import { motion, AnimatePresence } from "motion/react";
import { PageHeader } from "../components/PageHeader";

export function Shed() {
  const { resources, setResources, currentUser } = useAppContext();
  const [filter, setFilter] = useState<string>("ALL");

  const handleReserve = (id: string) => {
    if (!currentUser) return;
    setResources(resources.map(res => 
      res.id === id ? { ...res, status: "BORROWED", borrowerId: currentUser.id } : res
    ));
  };

  const handleReturn = (id: string) => {
    setResources(resources.map(res => 
      res.id === id ? { ...res, status: "COOLDOWN", borrowerId: undefined } : res
    ));
    // Simulate cooldown ending after 5 seconds
    setTimeout(() => {
      setResources(current => current.map(res => 
        res.id === id ? { ...res, status: "AVAILABLE" } : res
      ));
    }, 5000);
  };

  const handleDelete = (id: string) => {
    setResources(resources.filter(res => res.id !== id));
  };

  const filteredResources = resources.filter(res => {
    if (filter === "ALL") return true;
    return res.type === filter;
  });

  return (
    <div className="w-full relative pb-20">
      <PageHeader 
        title="Shared Shed" 
        subtitle="Borrow tools and books from your community." 
        emoji="🦝" 
        Icon={Wrench} 
        bgColor="bg-emerald-200" 
        shadowColor="shadow-emerald-300/50"
        rightContent={
          <div className="flex gap-2 bg-white/50 p-2 rounded-2xl border border-emerald-100 shadow-sm backdrop-blur-md">
            {["ALL", "TOOL", "BOOK", "OTHER"].map((type) => (
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredResources.map((res) => (
            <ResourceCard
              key={res.id}
              resource={res}
              onReserve={handleReserve}
              onReturn={handleReturn}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
        
        {filteredResources.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="col-span-full py-20 text-center"
          >
            <div className="inline-flex bg-emerald-50 p-6 rounded-[3rem] mb-4 shadow-inner">
              <PackageOpen className="w-16 h-16 text-emerald-300" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-900 mb-2 tracking-tight">The shed is empty</h3>
            <p className="text-emerald-500 font-medium">Add something to share with your neighbors!</p>
          </motion.div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 md:bottom-10 right-6 md:right-10 bg-amber-500 text-amber-950 p-5 rounded-[2rem] shadow-xl shadow-amber-200 hover:bg-amber-400 transition-colors z-50 flex items-center justify-center group"
        aria-label="Add Resource"
      >
        <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
      </motion.button>
    </div>
  );
}