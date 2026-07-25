import { Home, PlaySquare, Video, Trophy, User } from 'lucide-react';
import { ViewType } from '../types';

interface NavigationProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
}

const navItems: { id: ViewType; label: string; icon: any }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'live', label: 'Live', icon: PlaySquare },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'tournaments', label: 'Tournaments', icon: Trophy },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNav({ currentView, onChangeView }: NavigationProps) {
  return (
    <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[600px] bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-2 z-20 flex justify-between items-center shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 transition-all group ${
              isActive ? 'text-[#FFD700] bg-white/5 rounded-2xl' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? '' : 'group-hover:text-white'}`} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[9px] font-bold uppercase ${isActive ? 'text-[#FFD700]' : 'text-gray-400'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export function Sidebar({ currentView, onChangeView }: NavigationProps) {
  // Hide sidebar completely in this theme since we use the floating bottom nav on all screens
  return null;
}
