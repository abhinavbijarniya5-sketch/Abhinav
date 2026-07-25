import { Send, Settings, User, Share2 } from 'lucide-react';
import kenyaIndiaThumbnail from '../assets/images/kenya_vs_india_thumbnail_1784986390312.jpg';

interface LiveProps {
  onOpenShare?: (title?: string, text?: string) => void;
}

export default function Live({ onOpenShare }: LiveProps) {
  const handleShareStream = () => {
    if (onOpenShare) {
      onOpenShare("Kenya vs India Live Roll Ball Stream", "Watch Kenya vs India live score 04 - 02 on Roll Ball Live Broadcast!");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-120px)] gap-4">
      {/* Video Player Area */}
      <div className="relative w-full aspect-video bg-black rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 group">
        <img 
          src={kenyaIndiaThumbnail} 
          alt="Live Stream Thumbnail"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />

        {/* Share Button Overlay */}
        <button
          onClick={handleShareStream}
          className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black border border-white/20 text-[#FFD700] text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Stream</span>
        </button>

        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
          {/* Simulated Player Controls overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              <span className="font-bold text-sm tracking-wider">LIVE</span>
            </div>
            <Settings className="w-5 h-5 text-white/80 cursor-pointer hover:text-white" />
          </div>
        </div>
      </div>

      {/* Score Tracker */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between px-6 md:px-12">
        <div className="flex flex-col items-center">
          <span className="text-xl md:text-3xl font-black italic">KEN</span>
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Kenya</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4 md:gap-8">
            <span className="text-3xl md:text-5xl font-black text-[#FFD700]">04</span>
            <span className="text-sm md:text-base font-black text-gray-600">-</span>
            <span className="text-3xl md:text-5xl font-black text-[#FFD700]">02</span>
          </div>
          <span className="text-xs text-red-500 font-bold mt-2 tracking-widest">2ND HALF : 14:02</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xl md:text-3xl font-black italic">IND</span>
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">India</span>
        </div>
      </div>

      {/* Live Chat */}
      <div className="flex-1 min-h-0 glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#0A3D91]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="p-4 border-b border-white/10 flex items-center justify-between z-10 bg-[#050510]/50 backdrop-blur-md">
          <h3 className="font-bold tracking-wide">Live Chat</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <User className="w-3 h-3" /> 12.4k watching
            </span>
            <button
              onClick={handleShareStream}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#FFD700] transition-colors"
              title="Share Stream"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 z-10">
          {/* Mock Chat Messages */}
          {[
            { user: 'RollFan99', msg: 'What a save by Mahipal!', time: '14:00' },
            { user: 'SportsNut', msg: 'Kenya is playing aggressive today.', time: '14:01' },
            { user: 'Rider_007', msg: 'Lets go INDIA 🇮🇳', time: '14:01', highlight: true },
            { user: 'SkateMaster', msg: 'The speed on that counter attack...', time: '14:02' },
          ].map((chat, i) => (
            <div key={i} className={`flex gap-3 text-sm ${chat.highlight ? 'bg-[#FFD700]/10 p-2 rounded-lg -mx-2' : ''}`}>
              <div className="w-6 h-6 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                {chat.user.charAt(0)}
              </div>
              <div>
                <span className="font-bold text-gray-300 mr-2">{chat.user}</span>
                <span className="text-gray-100">{chat.msg}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-white/10 bg-[#050510]/80 z-10">
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Say something..." 
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm outline-none focus:border-[#FFD700]/50 transition-colors"
            />
            <button className="w-10 h-10 rounded-full bg-[#FFD700] text-black flex items-center justify-center hover:bg-white transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
