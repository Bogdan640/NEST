import { Settings as SettingsIcon, Bell, Shield, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router";
import { PageHeader } from "../components/PageHeader";

export function Settings() {
  const { setCurrentUser } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your preferences." 
        emoji="🦔" 
        Icon={SettingsIcon} 
        bgColor="bg-emerald-200" 
        shadowColor="shadow-emerald-300/50"
      />

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-50 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-900">Notifications</h3>
                <p className="text-sm font-medium text-emerald-500">Email & push alerts</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-14 h-7 bg-emerald-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-emerald-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
            </label>
          </div>

          <div className="w-full h-px bg-emerald-50"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-900">Privacy</h3>
                <p className="text-sm font-medium text-emerald-500">Public phone number</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-14 h-7 bg-emerald-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-emerald-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
            </label>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-50"
        >
          <h3 className="font-bold text-emerald-900 mb-4">Danger Zone</h3>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 bg-rose-50 hover:bg-rose-100 rounded-2xl border border-rose-100 transition-colors group"
          >
            <div className="flex items-center gap-4 text-rose-600">
              <LogOut className="w-6 h-6" />
              <span className="font-bold">Log out from all devices</span>
            </div>
          </button>
        </motion.div>
      </div>
    </div>
  );
}