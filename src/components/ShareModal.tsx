import React, { useState } from 'react';
import { Share2, Copy, Check, X, MessageCircle, Twitter, Facebook, Send, ExternalLink, Sparkles } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  text?: string;
  url?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  title = 'Roll Ball Videos & Matches Platform',
  text = 'Check out official Roll Ball sport videos, live matches, and federation highlights!',
  url = window.location.href,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = url || window.location.href;
  const shareText = `${title} - ${text}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  // Social URLs
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  const socialPlatforms = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30',
      shareLink: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: 'Twitter / X',
      icon: Twitter,
      color: 'bg-sky-500/20 text-sky-400 border-sky-500/30 hover:bg-sky-500/30',
      shareLink: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
      shareLink: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30',
      shareLink: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#08081a] border border-[#FFD700]/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow backdrop accent */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black italic tracking-tight">
              SHARE ROLL BALL
            </h2>
            <p className="text-xs text-gray-400">
              Spread the action of Roll Ball videos & matches
            </p>
          </div>
        </div>

        {/* Content Preview Box */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-6">
          <span className="text-[10px] font-bold text-[#FFD700] uppercase tracking-wider block mb-1">
            Sharing Item
          </span>
          <h4 className="font-bold text-sm text-white line-clamp-1">{title}</h4>
          <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{text}</p>
        </div>

        {/* Social Buttons Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {socialPlatforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.shareLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2.5 p-3 rounded-2xl border font-bold text-xs transition-all ${platform.color}`}
            >
              <platform.icon className="w-4 h-4 shrink-0" />
              <span>{platform.name}</span>
            </a>
          ))}
        </div>

        {/* Copy Link Input Bar */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
            Direct Link
          </label>
          <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-transparent px-3 text-xs text-gray-300 font-mono outline-none truncate"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
                copied
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[#FFD700] text-black hover:bg-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Native Share Option for Mobile Devices */}
        {'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full mt-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-[#FFD700]" />
            More System Share Options
          </button>
        )}

      </div>
    </div>
  );
}
