import React, { useState } from 'react';
import { ShieldCheck, Lock, Building, X, KeyRound, Sparkles } from 'lucide-react';
import { Association } from '../types';

interface AssociationLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (assoc: Association) => void;
}

const PRESET_ASSOCIATIONS = [
  { code: 'IRBF-2026', name: 'International Roll Ball Federation (IRBF)', country: 'Global' },
  { code: 'RBFI-IND-101', name: 'Roll Ball Federation of India (RBFI)', country: 'India' },
  { code: 'KRBA-KEN-202', name: 'Kenya Roll Ball Association (KRBA)', country: 'Kenya' },
  { code: 'RBAE-EUR-303', name: 'European Roll Ball Association', country: 'Europe' },
];

export default function AssociationLoginModal({ isOpen, onClose, onLoginSuccess }: AssociationLoginModalProps) {
  const [assocId, setAssocId] = useState('');
  const [customName, setCustomName] = useState('');
  const [passCode, setPassCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePresetSelect = (preset: typeof PRESET_ASSOCIATIONS[0]) => {
    setAssocId(preset.code);
    setCustomName(preset.name);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assocId.trim()) {
      setError('Please enter or select a Roll Ball Association ID.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/association/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          associationId: assocId.trim(),
          passCode,
          customName: customName.trim() || undefined
        })
      });

      const data = await res.json();

      if (data.success && data.association) {
        onLoginSuccess(data.association);
        onClose();
      } else {
        setError(data.error || 'Login failed. Please check Association ID.');
      }
    } catch (err) {
      setError('Connection error while verifying Association ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#08081a] border border-[#FFD700]/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Top Glow Accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#0A3D91]/30 rounded-full blur-3xl pointer-events-none"></div>

        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black italic tracking-tight">
              ASSOCIATION LOGIN
            </h2>
            <p className="text-xs text-gray-400">
              Verified Roll Ball Associations only (Upload Access)
            </p>
          </div>
        </div>

        {/* Preset Badges */}
        <div className="mb-6">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
            Quick Select Registered Associations:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_ASSOCIATIONS.map((preset) => (
              <button
                key={preset.code}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`text-left p-2.5 rounded-xl border text-xs font-semibold transition-all flex flex-col justify-between ${
                  assocId === preset.code
                    ? 'border-[#FFD700] bg-[#FFD700]/10 text-white shadow-sm shadow-[#FFD700]/20'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#FFD700]">{preset.code}</span>
                  <span className="text-[10px] text-gray-400">{preset.country}</span>
                </div>
                <span className="truncate text-gray-300 mt-1">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">
              Association ID / Code
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="e.g. IRBF-2026 or RBFI-IND-101"
                value={assocId}
                onChange={(e) => {
                  setAssocId(e.target.value);
                  setError(null);
                }}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold tracking-wide outline-none focus:border-[#FFD700] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">
              Association Full Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Gujarat State Roll Ball Association"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:border-[#FFD700] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">
              Security Passcode
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="Enter Association Passcode"
                value={passCode}
                onChange={(e) => setPassCode(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:border-[#FFD700] transition-colors"
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              Passcode ensures official association authorization for uploading videos.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#FFD700] text-black font-black uppercase tracking-wider text-sm hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#FFD700]/20 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">VERIFYING ASSOCIATION...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                AUTHENTICATE & LOG IN
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
