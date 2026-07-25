import React from 'react';
import { Play, TrendingUp, Hand, Goal, Share2 } from 'lucide-react';
import kenyaIndiaThumbnail from '../assets/images/kenya_vs_india_thumbnail_1784986390312.jpg';

interface HomeProps {
  onOpenShare?: (title?: string, text?: string) => void;
}

export default function Home({ onOpenShare }: HomeProps) {
  const handleShareMatch = (e: React.MouseEvent, title: string, text: string) => {
    e.stopPropagation();
    if (onOpenShare) {
      onOpenShare(title, text);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto h-full">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-4 h-full md:min-h-[600px]">
        
        {/* Live Match Hero Card - Spans 8 cols, 4 rows */}
        <div className="md:col-span-8 md:row-span-4 rounded-[24px] overflow-hidden relative border border-white/10 shadow-2xl group cursor-pointer bg-gradient-to-br from-[#0A3D91]/40 to-black min-h-[300px]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm76-52c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-6-20c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM11 54c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z\' fill=\'%23ffd700\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')] opacity-30"></div>
          
          <img 
            src={kenyaIndiaThumbnail} 
            alt="Kenya vs India Live Match" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 mix-blend-overlay"
          />
          <div className="absolute top-4 left-4 bg-[#FFD700] text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 z-10">
            <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span> LIVE NOW
          </div>

          {/* Quick Share Top Right */}
          <button
            onClick={(e) => handleShareMatch(e, "India vs Kenya - Live Roll Ball World Cup Match", "Watch the high-stakes Roll Ball World Cup match live stream!")}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-[#FFD700] flex items-center justify-center transition-all shadow-lg backdrop-blur-md"
            title="Share Live Match"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black via-black/70 to-transparent z-10">
            <h2 className="text-3xl md:text-4xl font-black italic mb-2 tracking-tight">INDIA VS KENYA</h2>
            <p className="text-white/60 text-xs md:text-sm tracking-widest uppercase mb-6">ACTION ROLL BALL // WORLD CUP // LIVE MATCH</p>
            
            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 border border-[#FFD700] px-6 py-3 rounded-xl hover:bg-[#FFD700] hover:text-black transition-colors group/btn w-fit">
                <Play className="w-5 h-5 text-[#FFD700] group-hover/btn:text-black" />
                <span className="font-bold text-xs tracking-widest">WATCH LIVE HD</span>
              </button>

              <button
                onClick={(e) => handleShareMatch(e, "India vs Kenya - Live Roll Ball World Cup Match", "Watch live roller skating with ball action in HD!")}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-3 rounded-xl text-white transition-colors"
              >
                <Share2 className="w-4 h-4 text-[#FFD700]" />
                <span className="font-bold text-xs tracking-wider">Share Stream</span>
              </button>
            </div>
          </div>
        </div>

        {/* Up Next Card */}
        <div className="md:col-span-4 md:row-span-3 bg-white/5 backdrop-blur-md rounded-[24px] border border-white/10 p-6 flex flex-col justify-between relative">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">UP NEXT</span>
            <div className="flex items-center gap-2">
              <span className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold text-[#FFD700]">19:30 IST</span>
              <button
                onClick={(e) => handleShareMatch(e, "Upcoming: Germany vs Brazil Roll Ball Match", "Upcoming Roll Ball clash at 19:30 IST!")}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-gray-300"
                title="Share Match Schedule"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-around my-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-green-600 mb-2 border-2 border-white/20 flex items-center justify-center text-black font-black text-xl">
                GER
              </div>
            </div>
            <div className="text-white/20 font-black italic">VS</div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-700 to-green-500 mb-2 border-2 border-white/20 flex items-center justify-center text-white font-black text-xl">
                BRA
              </div>
            </div>
          </div>
          <button className="w-full bg-[#FFD700] text-black py-4 rounded-2xl font-black text-xs tracking-widest uppercase shadow-lg shadow-[#FFD700]/20 hover:scale-[1.02] transition-transform">
            SET REMINDER
          </button>
        </div>

        {/* Small Widgets Container */}
        <div className="md:col-span-4 md:row-span-3 flex flex-col gap-4">
          <div className="flex-1 bg-white/5 backdrop-blur-md rounded-[24px] border border-white/10 p-5 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FFD700]/10 rounded-2xl flex items-center justify-center text-[#FFD700] shrink-0">
                <Hand className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">REPLAY</p>
                <h3 className="text-lg font-bold italic">BEST SAVES</h3>
              </div>
            </div>
            <button
              onClick={(e) => handleShareMatch(e, "Roll Ball Best Saves Replay", "Watch spectacular goal saves on roller skates in Roll Ball!")}
              className="p-2 rounded-xl bg-white/5 hover:bg-[#FFD700] hover:text-black text-gray-300 transition-colors"
              title="Share Best Saves"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 bg-white/5 backdrop-blur-md rounded-[24px] border border-white/10 p-5 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0A3D91]/20 rounded-2xl flex items-center justify-center text-[#0A3D91] shrink-0">
                <Goal className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">EVENTS</p>
                <h3 className="text-lg font-bold italic">FIXTURES</h3>
              </div>
            </div>
            <button
              onClick={(e) => handleShareMatch(e, "Roll Ball Tournament Fixtures", "Official Roll Ball World Cup match schedules and tournament fixtures!")}
              className="p-2 rounded-xl bg-white/5 hover:bg-[#FFD700] hover:text-black text-gray-300 transition-colors"
              title="Share Fixtures"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top Scorer Card */}
        <div className="md:col-span-4 md:row-span-2 bg-[#0A3D91]/20 backdrop-blur-md rounded-[24px] border border-[#0A3D91]/30 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-[#FFD700]">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[10px] font-bold tracking-widest uppercase">TOP SCORER</span>
            </div>
            <button
              onClick={(e) => handleShareMatch(e, "Mahipal Mahala - Roll Ball Top Scorer", "12 Goals scored in Roll Ball World Cup Season!")}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300"
              title="Share Top Scorer Stats"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 className="text-2xl font-black italic">Mahipal Mahala</h3>
            <p className="text-[#FFD700] font-bold text-sm">
              12 Goals <span className="text-white/30 mx-1">•</span> Season
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
