import { User, Settings as SettingsIcon, ShieldCheck } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { PageHeader } from "../components/PageHeader";

export function Profile() {
  const { currentUser } = useAppContext();

  return (
    <div className="w-full">
      <PageHeader 
        title="Your Profile" 
        subtitle="Manage your community identity." 
        emoji="🦊" 
        Icon={User} 
        bgColor="bg-emerald-100" 
        shadowColor="shadow-emerald-200/50"
      />

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-emerald-50 mb-8 flex flex-col items-center text-center">
        <img
          src={currentUser?.avatar}
          alt="Avatar"
          className="w-32 h-32 rounded-full border-4 border-emerald-100 object-cover mb-6 shadow-xl shadow-emerald-200"
        />
        <h1 className="text-3xl font-extrabold text-emerald-950 mb-2">{currentUser?.name}</h1>
        <p className="text-emerald-500 font-bold bg-emerald-50 px-4 py-2 rounded-xl mb-4">
          Apt {currentUser?.apartment}
        </p>
        <p className="text-emerald-700 font-medium max-w-md">
          {currentUser?.headline || "Just another friendly neighbor!"}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-emerald-50">
          <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" /> About
          </h3>
          <p className="text-emerald-600 font-medium">
            {currentUser?.about || "I love planting succulents and baking sourdough bread on weekends."}
          </p>
        </div>
        
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-emerald-50">
          <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Community Stats
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-2xl">
              <span className="text-emerald-700 font-bold">Events Attended</span>
              <span className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-xl font-black">12</span>
            </div>
            <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-2xl">
              <span className="text-emerald-700 font-bold">Tools Shared</span>
              <span className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-xl font-black">4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}