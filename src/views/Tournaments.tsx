import { useState } from 'react';
import { Calendar, MapPin, Trophy, Share2 } from 'lucide-react';

interface TournamentsProps {
  onOpenShare?: (title?: string, text?: string) => void;
}

export default function Tournaments({ onOpenShare }: TournamentsProps) {
  const [activeTab, setActiveTab] = useState('Live');
  const tabs = ['Live', 'Upcoming', 'Previous'];

  const handleShareTournament = (name: string, loc: string, date: string) => {
    if (onOpenShare) {
      onOpenShare(`${name} - Roll Ball Tournament`, `Official Roll Ball Tournament in ${loc} (${date}). Follow all live matches & videos!`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-20 md:pb-0">
      
      {/* Tabs */}
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-full max-w-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
              activeTab === tab 
                ? 'bg-[#FFD700] text-black shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tournament List */}
      <div className="space-y-4">
        {[
          { name: 'World Cup 2026', loc: 'Pune, India', date: 'Oct 12 - 20, 2026', status: 'LIVE' },
          { name: 'Asian Championship', loc: 'Dhaka, Bangladesh', date: 'Nov 05 - 10, 2026', status: 'UPCOMING' },
          { name: 'National League Pro', loc: 'Nairobi, Kenya', date: 'Dec 01 - 15, 2026', status: 'UPCOMING' },
        ].map((tourney, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative overflow-hidden group hover:border-white/20 transition-all">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0A3D91]/10 rounded-full blur-2xl group-hover:bg-[#0A3D91]/20 transition-all pointer-events-none"></div>

            <div className="flex gap-5 items-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${i === 0 ? 'bg-[#FFD700]/10 border-[#FFD700]/30 text-[#FFD700]' : 'bg-white/5 border-white/10 text-white/50'}`}>
                <Trophy className="w-8 h-8" />
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-black italic tracking-tight">{tourney.name}</h3>
                  {tourney.status === 'LIVE' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                      LIVE NOW
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#FFD700]" /> {tourney.loc}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#FFD700]" /> {tourney.date}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => handleShareTournament(tourney.name, tourney.loc, tourney.date)}
                className="p-3 rounded-xl bg-white/5 hover:bg-[#FFD700] hover:text-black text-[#FFD700] border border-white/10 transition-colors flex items-center justify-center gap-1.5 font-bold text-xs"
                title="Share Tournament"
              >
                <Share2 className="w-4 h-4" />
                <span className="md:hidden lg:inline">Share</span>
              </button>

              <button className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-colors text-xs uppercase tracking-wider">
                View Details
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
