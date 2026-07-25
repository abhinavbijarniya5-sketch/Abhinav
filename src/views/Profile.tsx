import { Heart, Download, Settings, ChevronRight, Crown, LogOut, ShieldCheck, Upload, UserCheck, Sparkles } from 'lucide-react';
import { Association } from '../types';

interface ProfileProps {
  association: Association | null;
  onOpenLogin: () => void;
  onOpenUpload: () => void;
  onLogoutAssociation: () => void;
}

export default function Profile({
  association,
  onOpenLogin,
  onOpenUpload,
  onLogoutAssociation
}: ProfileProps) {
  const options = [
    { icon: Heart, label: 'Favorites', color: 'text-pink-500' },
    { icon: Download, label: 'Offline Downloads', color: 'text-blue-500' },
    { icon: Settings, label: 'Settings', color: 'text-gray-400' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-24">
      
      {/* Profile Header */}
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-[#FFD700] overflow-hidden bg-[#0A3D91] shadow-[0_0_30px_rgba(255,215,0,0.2)] flex items-center justify-center">
            {association ? (
              <ShieldCheck className="w-12 h-12 text-[#FFD700]" />
            ) : (
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=0A3D91" alt="User Avatar" className="w-full h-full object-cover"/>
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center border-2 border-[#050510] hover:bg-gray-200 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
        
        <h2 className="text-2xl font-black tracking-tight mb-1">
          {association ? association.name : 'Felix The Roller'}
        </h2>
        <p className="text-sm text-[#FFD700] font-bold">
          {association ? `Verified Roll Ball Association (${association.code})` : 'Roll Ball Fan Account'}
        </p>
      </div>

      {/* Association Portal Action Card */}
      {association ? (
        <div className="rounded-3xl p-6 bg-gradient-to-r from-[#0A3D91]/60 via-[#0A3D91]/30 to-black border border-[#FFD700]/40 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 group shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#FFD700]/20 transition-all"></div>
          
          <div className="flex items-center gap-4 z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD700] text-black flex items-center justify-center flex-shrink-0 font-black">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#FFD700] tracking-tight">
                {association.code} Verified Portal
              </h3>
              <p className="text-xs text-gray-200 font-medium mt-1">
                You are authorized to publish official Roll Ball tournament videos. AI content filter active.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto z-10">
            <button
              onClick={onOpenUpload}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#FFD700] text-black font-black uppercase text-xs tracking-wider hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Upload className="w-4 h-4" />
              Upload Video
            </button>
            <button
              onClick={onLogoutAssociation}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 font-bold text-xs transition-colors"
            >
              Log Out Association
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl p-6 bg-gradient-to-r from-[#FFD700]/10 via-[#FFD700]/5 to-transparent border border-[#FFD700]/30 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#FFD700]/20 transition-all"></div>
          
          <div className="flex items-center gap-4 z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/20 border border-[#FFD700]/40 text-[#FFD700] flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#FFD700] tracking-tight">
                Roll Ball Association Portal
              </h3>
              <p className="text-xs text-gray-300 font-medium mt-1">
                Are you a Roll Ball Association? Log in to publish videos on the platform.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FFD700] text-black font-black tracking-widest uppercase hover:bg-white transition-colors z-10 text-xs whitespace-nowrap shadow-md shadow-[#FFD700]/20"
          >
            Association Login
          </button>
        </div>
      )}

      {/* Menu Options */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        {options.map((opt, i) => (
          <button 
            key={opt.label}
            className={`w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors group ${
              i !== options.length - 1 ? 'border-b border-white/5' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors border border-white/5">
                <opt.icon className={`w-5 h-5 ${opt.color}`} />
              </div>
              <span className="font-bold text-gray-200 group-hover:text-white">{opt.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          </button>
        ))}
      </div>

    </div>
  );
}
