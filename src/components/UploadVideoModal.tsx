import React, { useState } from 'react';
import { Upload, X, ShieldAlert, CheckCircle2, AlertTriangle, Sparkles, Video, FileVideo, Image as ImageIcon } from 'lucide-react';
import { Association, VideoItem } from '../types';

interface UploadVideoModalProps {
  isOpen: boolean;
  association: Association | null;
  onClose: () => void;
  onUploadSuccess: (video: VideoItem) => void;
  onPromptLogin: () => void;
}

export default function UploadVideoModal({
  isOpen,
  association,
  onClose,
  onUploadSuccess,
  onPromptLogin
}: UploadVideoModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Highlights');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('#rollball #worldcup');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailBase64, setThumbnailBase64] = useState<string | null>(null);

  // AI Inspection state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{
    tested: boolean;
    isRollBall: boolean;
    reason: string;
    detectedSport?: string;
  }>({ tested: false, isRollBall: false, reason: '' });

  const [publishing, setPublishing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  if (!association) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="w-full max-w-md bg-[#08081a] border border-[#FFD700]/30 rounded-3xl p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black italic">ASSOCIATION LOGIN REQUIRED</h2>
          <p className="text-sm text-gray-300">
            Only authorized Roll Ball Association accounts can upload official match & tournament videos.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                onPromptLogin();
              }}
              className="flex-1 py-3 rounded-xl bg-[#FFD700] text-black font-black uppercase text-sm hover:bg-white transition-colors"
            >
              Log In Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // File handler for Thumbnail
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailBase64(reader.result as string);
        setAiResult({ tested: false, isRollBall: false, reason: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  // Video File handler
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setAiResult({ tested: false, isRollBall: false, reason: '' });
    }
  };

  // Trigger Roll Ball AI Inspection
  const handleTestAiInspection = async () => {
    if (!title.trim()) {
      setUploadError('Please enter a video title before running AI inspection.');
      return;
    }

    setIsAnalyzing(true);
    setUploadError(null);

    try {
      const res = await fetch('/api/verify-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category,
          description: description.trim(),
          tags: tags.trim(),
          thumbnailBase64
        })
      });

      const data = await res.json();

      setAiResult({
        tested: true,
        isRollBall: Boolean(data.isRollBall),
        reason: data.reason || (data.isRollBall ? 'AI verified Roll Ball sport content.' : 'Rejected: Non-Roll Ball content.'),
        detectedSport: data.detectedSport || 'Unknown'
      });
    } catch (err) {
      setUploadError('Error during AI verification.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Publish Form Submit
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setUploadError('Video title is required.');
      return;
    }

    // Run AI verification if not tested yet
    let currentIsRollBall = aiResult.isRollBall;
    let currentReason = aiResult.reason;

    if (!aiResult.tested) {
      setIsAnalyzing(true);
      try {
        const res = await fetch('/api/verify-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            category,
            description: description.trim(),
            tags: tags.trim(),
            thumbnailBase64
          })
        });
        const data = await res.json();
        currentIsRollBall = Boolean(data.isRollBall);
        currentReason = data.reason || '';
        setAiResult({
          tested: true,
          isRollBall: currentIsRollBall,
          reason: currentReason,
          detectedSport: data.detectedSport
        });
      } catch (e) {
        // fallback
      } finally {
        setIsAnalyzing(false);
      }
    }

    if (!currentIsRollBall) {
      setUploadError(`🔴 UPLOAD REJECTED: Only Roll Ball sport videos are allowed on this platform! AI Content Filter detected: ${currentReason || 'Non-Roll Ball content'}`);
      return;
    }

    setPublishing(true);
    setUploadError(null);

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          associationId: association.code,
          associationName: association.name,
          title: title.trim(),
          category,
          description: description.trim(),
          thumbnailUrl: thumbnailBase64 || undefined,
          duration: '06:30'
        })
      });

      const data = await res.json();

      if (data.success && data.video) {
        onUploadSuccess(data.video);
        onClose();
      } else {
        setUploadError(data.error || 'Failed to upload video.');
      }
    } catch (err) {
      setUploadError('Failed to publish video.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#08081a] border border-[#FFD700]/30 rounded-3xl p-6 md:p-8 shadow-2xl relative my-8">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Association Badge Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 pr-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A3D91] border border-[#FFD700]/50 flex items-center justify-center font-bold text-[#FFD700] text-sm">
              {association.code.slice(0, 3)}
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#FFD700] uppercase tracking-wider block">
                Logged in Association
              </span>
              <h3 className="font-bold text-sm text-white truncate max-w-xs md:max-w-md">
                {association.name} ({association.code})
              </h3>
            </div>
          </div>
        </div>

        <h2 className="text-xl md:text-2xl font-black italic tracking-tight mb-2">
          UPLOAD ROLL BALL VIDEO
        </h2>
        <p className="text-xs text-gray-400 mb-6">
          Strict Policy: AI automatically inspects uploads to ensure ONLY Roll Ball sport videos are published.
        </p>

        <form onSubmit={handlePublish} className="space-y-4">
          
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">
              Video Title <span className="text-[#FFD700]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. World Cup 2026: India vs Kenya Unbelievable Roller Skate Goals"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setAiResult({ tested: false, isRollBall: false, reason: '' });
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold outline-none focus:border-[#FFD700] transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-[#08081a] border border-white/10 rounded-xl text-sm font-semibold text-white outline-none focus:border-[#FFD700]"
              >
                <option value="Highlights">Highlights</option>
                <option value="Best Goals">Best Goals</option>
                <option value="Interviews">Interviews & Press</option>
                <option value="Full Matches">Full Matches</option>
                <option value="Training & Drills">Training & Drills</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">
                Tags
              </label>
              <input
                type="text"
                placeholder="#rollball #skating #goal"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:border-[#FFD700]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">
              Match Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe the Roll Ball tournament match, teams, roller skating actions, or players..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setAiResult({ tested: false, isRollBall: false, reason: '' });
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:border-[#FFD700]"
            />
          </div>

          {/* Video & Thumbnail Upload Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Video File selection */}
            <div className="border border-dashed border-white/20 rounded-2xl p-4 text-center bg-white/5 hover:border-[#FFD700]/50 transition-colors relative">
              <FileVideo className="w-8 h-8 text-[#FFD700] mx-auto mb-2" />
              <span className="text-xs font-bold block text-white">
                {videoFile ? videoFile.name : 'Select Video File (.mp4, .mov)'}
              </span>
              <span className="text-[10px] text-gray-400 block mt-1">Official Roll Ball Match Clip</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            {/* Thumbnail Selection */}
            <div className="border border-dashed border-white/20 rounded-2xl p-4 text-center bg-white/5 hover:border-[#FFD700]/50 transition-colors relative">
              {thumbnailBase64 ? (
                <div className="relative w-full h-20 rounded-lg overflow-hidden">
                  <img src={thumbnailBase64} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-bold text-[#FFD700]">
                    Thumbnail Ready
                  </span>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <span className="text-xs font-bold block text-white">Upload Thumbnail Image</span>
                  <span className="text-[10px] text-gray-400 block mt-1">PNG, JPG thumbnail cover</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* AI ROLL BALL CONTENT FILTER INSPECTOR */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-black border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FFD700]" />
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  Gemini AI Roll Ball Content Filter
                </span>
              </div>
              <button
                type="button"
                onClick={handleTestAiInspection}
                disabled={isAnalyzing || !title.trim()}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-[#FFD700] border border-[#FFD700]/30 transition-all flex items-center gap-1.5 disabled:opacity-40"
              >
                {isAnalyzing ? 'Analyzing...' : 'Run AI Inspection'}
              </button>
            </div>

            {aiResult.tested ? (
              aiResult.isRollBall ? (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-emerald-400 uppercase tracking-wider text-[11px]">
                      🟢 VERIFIED: ROLL BALL CONTENT CONFIRMED
                    </span>
                    <span>{aiResult.reason}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-red-400 uppercase tracking-wider text-[11px]">
                      🔴 REJECTED: NON-ROLL BALL VIDEO DETECTED
                    </span>
                    <span>Only Roll Ball sport videos are allowed! {aiResult.reason}</span>
                  </div>
                </div>
              )
            ) : (
              <p className="text-[11px] text-gray-400 italic">
                AI will inspect the video title and description to confirm it is about Roll Ball on roller skates. Non-Roll Ball videos (cricket, soccer, dance, memes) are automatically blocked.
              </p>
            )}
          </div>

          {uploadError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
              {uploadError}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={publishing || isAnalyzing}
              className={`flex-1 py-3.5 rounded-xl font-black uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                aiResult.tested && !aiResult.isRollBall
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-[#FFD700] text-black hover:bg-white shadow-[#FFD700]/20'
              }`}
            >
              {publishing ? (
                <span className="animate-pulse">PUBLISHING TO FEED...</span>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  PUBLISH ROLL BALL VIDEO
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
