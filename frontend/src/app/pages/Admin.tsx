import { Users, Shield, CheckCircle, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { PageHeader } from "../components/PageHeader";

export function Admin() {
  return (
    <div className="w-full">
      <PageHeader 
        title="Admin Dashboard" 
        subtitle="Manage your residential block." 
        emoji="🦁" 
        Icon={Shield} 
        bgColor="bg-amber-200" 
        shadowColor="shadow-amber-300/50"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-lg shadow-amber-100 border border-amber-50"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-amber-950">Pending Users</h2>
            <span className="bg-amber-100 text-amber-800 font-black px-3 py-1 rounded-xl">2</span>
          </div>

          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                  <div className="w-12 h-12 bg-amber-200/50 rounded-2xl flex items-center justify-center text-amber-700 font-bold text-2xl shadow-inner border border-amber-100">
                    {i === 1 ? "🦊" : "🐻"}
                  </div>
                  <div>
                    <p className="font-bold text-amber-900">New User {i}</p>
                    <p className="text-xs font-medium text-amber-600">Apt 10{i} • pending@nest.com</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none p-3 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 rounded-xl transition-colors flex justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button className="flex-1 sm:flex-none p-3 bg-rose-100 text-rose-600 hover:bg-rose-200 rounded-xl transition-colors flex justify-center">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-lg shadow-amber-100 border border-amber-50"
        >
          <h2 className="text-2xl font-extrabold text-amber-950 mb-6">Block Settings</h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm font-bold text-amber-800 mb-2">Block Join Code</p>
              <div className="flex gap-4">
                <input
                  type="text"
                  readOnly
                  value="BLK-2023"
                  className="w-full bg-amber-50 border-2 border-amber-100 rounded-xl px-4 py-3 font-mono font-bold text-amber-900"
                />
                <button className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-xl shadow-md shadow-amber-200 transition-colors">
                  Copy
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-amber-800 mb-2">Total Residents</p>
              <p className="text-4xl font-black text-amber-500">42</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}