import { Bell, Upload, ShieldCheck, UserCheck, Share2 } from 'lucide-react';
import rollBallLogo from '../assets/images/roll_ball_logo_1784986403791.jpg';
import { Association } from '../types';

interface HeaderProps {
  association: Association | null;
  onOpenLogin: () => void;
  onOpenUpload: () => void;
  onOpenShare: (title?: string, text?: string) => void;
}

export default function Header({ association, onOpenLogin, onOpenUpload, onOpenShare }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-4 md:px-8 py-5 z-10 border-b border-white/5 bg-[#050510]/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <img 
          src={rollBallLogo} 
          alt="Roll Ball Logo" 
          className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 hidden sm:block"
        />
        <div>
          <p className="text-[#FFD700] text-[10px] font-bold tracking-[0.2em] mb-0.5 uppercase">
            {association ? `Association: ${association.code}` : 'Exclusive Access'}
          </p>
          <h1 className="text-xl md:text-2xl font-black italic tracking-tighter">
            ROLL BALL <span className="text-[#FFD700]">VIDEOS</span>
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        {/* Share Button */}
        <button
          onClick={() => onOpenShare("Roll Ball Video & Live Broadcasts Platform", "Watch and share official Roll Ball sport videos, tournament matches, and roller skating goals!")}
          title="Share Platform"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-bold text-xs transition-colors"
        >
          <Share2 className="w-4 h-4 text-[#FFD700]" />
          <span className="hidden lg:inline">Share App</span>
        </button>

        {/* Upload Video Button */}
        <button
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2 rounded-xl bg-[#FFD700] text-black font-black text-xs uppercase tracking-wider hover:bg-white transition-all shadow-md shadow-[#FFD700]/20"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Upload Video</span>
        </button>

        {/* Association Login / Badge Status */}
        {association ? (
          <button
            onClick={onOpenLogin}
            title={association.name}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0A3D91]/40 border border-[#FFD700]/40 text-[#FFD700] font-bold text-xs"
          >
            <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
            <span className="max-w-[100px] md:max-w-[140px] truncate">{association.code}</span>
          </button>
        ) : (
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-bold text-xs transition-colors"
          >
            <UserCheck className="w-4 h-4 text-[#FFD700]" />
            <span className="hidden md:inline">Association Login</span>
          </button>
        )}

        <button className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center border border-white/10 relative hover:bg-white/10 transition-colors">
          <Bell className="w-4 h-4 text-gray-400" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#FFD700] rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
