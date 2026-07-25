import React, { useState } from 'react';
import { Play, Clock, Upload, ShieldCheck, Sparkles, Share2 } from 'lucide-react';
import kenyaIndiaThumbnail from '../assets/images/kenya_vs_india_thumbnail_1784986390312.jpg';
import { VideoItem } from '../types';

interface VideosProps {
  customVideos: VideoItem[];
  onOpenUpload: () => void;
  onOpenShare?: (title?: string, text?: string) => void;
}

export default function Videos({ customVideos, onOpenUpload, onOpenShare }: VideosProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Highlights', 'Best Goals', 'Interviews', 'Full Matches', 'Training & Drills'];

  const filteredCustomVideos = activeCategory === 'All'
    ? customVideos
    : customVideos.filter(v => v.category.toLowerCase() === activeCategory.toLowerCase());

  const handleShare = (e: React.MouseEvent, title: string, description: string) => {
    e.stopPropagation();
    if (onOpenShare) {
      onOpenShare(title, description || 'Watch official Roll Ball sports video!');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-24">
      
      {/* Top Banner for Association Upload */}
      <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-[#0A3D91]/40 via-[#050510] to-[#FFD700]/10 border border-[#FFD700]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black italic text-white flex items-center gap-2">
              ROLL BALL ASSOCIATION PORTAL
              <span className="text-[10px] bg-[#FFD700] text-black px-2 py-0.5 rounded font-black tracking-wider uppercase">
                AI Filter Active
              </span>
            </h3>
            <p className="text-xs text-gray-300">
              Any Roll Ball Association ID can log in and publish official Roll Ball videos. AI automatically verifies sports content.
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => onOpenShare && onOpenShare("Roll Ball Video Hub", "Explore official Roll Ball sport videos and match broadcasts!")}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase transition-all flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-4 h-4 text-[#FFD700]" />
            Share Hub
          </button>
          <button
            onClick={onOpenUpload}
            className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-[#FFD700] text-black font-black uppercase text-xs tracking-wider hover:bg-white transition-all shrink-0 flex items-center justify-center gap-2 shadow-lg shadow-[#FFD700]/20"
          >
            <Upload className="w-4 h-4" />
            Upload Video
          </button>
        </div>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-5 py-2 rounded-full font-bold text-sm transition-colors border ${
              activeCategory === cat 
                ? 'bg-[#FFD700] text-black border-[#FFD700]' 
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Custom Association Uploaded Videos */}
      {filteredCustomVideos.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#FFD700] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Association Uploads ({filteredCustomVideos.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCustomVideos.map((video) => (
              <div key={video.id} className="flex flex-col gap-3 group cursor-pointer relative">
                <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-[#FFD700]/40 bg-gray-900 shadow-lg shadow-[#0A3D91]/20">
                  <img 
                    src={video.thumbnailUrl || kenyaIndiaThumbnail} 
                    alt={video.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 bg-[#0A3D91] border border-[#FFD700]/50 px-2 py-1 rounded text-[10px] font-black text-[#FFD700] uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <ShieldCheck className="w-3 h-3 text-[#FFD700]" />
                    {video.associationName.split(' ')[0]}
                  </div>

                  {/* Share button overlay */}
                  <button
                    onClick={(e) => handleShare(e, video.title, `Official video by ${video.associationName}`)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-[#FFD700] flex items-center justify-center transition-all shadow-md z-10 border border-white/10"
                    title="Share Video"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#FFD700] text-black flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1 backdrop-blur-sm">
                    <Clock className="w-3 h-3 text-[#FFD700]" />
                    {video.duration}
                  </div>
                </div>

                <div className="flex gap-3 justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0A3D91] border border-[#FFD700] flex items-center justify-center font-black text-[#FFD700] text-xs shrink-0 mt-0.5">
                      {video.associationId.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight text-white group-hover:text-[#FFD700] transition-colors line-clamp-2">
                        {video.title}
                      </h4>
                      <div className="text-xs font-medium text-gray-400 mt-1 flex items-center gap-1">
                        <span>{video.associationName}</span>
                        <span>•</span>
                        <span className="text-[#FFD700] font-bold">AI Verified</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleShare(e, video.title, video.description)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                    title="Share Video"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Broadcast Videos Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
          Official Tournament Matches & Highlights
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="flex flex-col gap-3 group cursor-pointer relative">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-gray-900">
                <img 
                  src={kenyaIndiaThumbnail} 
                  alt="Video Thumbnail" 
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${item % 2 === 0 ? 'hue-rotate-15' : ''}`}
                />

                <button
                  onClick={(e) => handleShare(e, `World Cup 2026: Epic Final Moments - Game ${item}`, "Check out this official Roll Ball World Cup match clip!")}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-[#FFD700] flex items-center justify-center transition-all shadow-md z-10 border border-white/10"
                  title="Share Video"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                    <Play className="w-5 h-5 text-white fill-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1 backdrop-blur-sm">
                  <Clock className="w-3 h-3" />
                  {12 + item}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
                </div>
              </div>
              
              <div className="flex gap-3 justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0 mt-1 border border-white/5 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/identicon/svg?seed=RBV" alt="Channel" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight text-white group-hover:text-[#FFD700] transition-colors line-clamp-2">
                      World Cup 2026: Epic Final Moments & Highlights - Game {item}
                    </h4>
                    <div className="text-xs font-medium text-gray-400 mt-1">
                      Roll Ball Official • {item * 12}K views • {item} days ago
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => handleShare(e, `World Cup 2026: Epic Final Moments - Game ${item}`, "Watch official Roll Ball World Cup match highlights.")}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                  title="Share Video"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
