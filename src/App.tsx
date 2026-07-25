import { useState, useEffect } from 'react';
import Header from './components/Header';
import { BottomNav } from './components/Navigation';
import Home from './views/Home';
import Live from './views/Live';
import Videos from './views/Videos';
import Tournaments from './views/Tournaments';
import Profile from './views/Profile';
import AssociationLoginModal from './components/AssociationLoginModal';
import UploadVideoModal from './components/UploadVideoModal';
import ShareModal from './components/ShareModal';
import { ViewType, Association, VideoItem } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [association, setAssociation] = useState<Association | null>(null);
  const [customVideos, setCustomVideos] = useState<VideoItem[]>([]);

  // Modal controls
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  // Share modal state
  const [shareData, setShareData] = useState<{
    isOpen: boolean;
    title: string;
    text: string;
  }>({
    isOpen: false,
    title: 'Roll Ball Videos & Live Broadcasts',
    text: 'Check out official Roll Ball sport videos, live tournament streams, and roller skating goals!',
  });

  // Restore saved association session on load
  useEffect(() => {
    const saved = localStorage.getItem('rollball_association');
    if (saved) {
      try {
        setAssociation(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }

    // Fetch initial videos from server
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.videos)) {
          setCustomVideos(data.videos);
        }
      })
      .catch(err => console.error('Failed to load videos:', err));
  }, []);

  const handleLoginSuccess = (assoc: Association) => {
    setAssociation(assoc);
    localStorage.setItem('rollball_association', JSON.stringify(assoc));
  };

  const handleLogoutAssociation = () => {
    setAssociation(null);
    localStorage.removeItem('rollball_association');
  };

  const handleUploadSuccess = (newVideo: VideoItem) => {
    setCustomVideos(prev => [newVideo, ...prev]);
    // Switch to videos view so uploader immediately sees their new Roll Ball video
    setCurrentView('videos');
  };

  const handleOpenShare = (title?: string, text?: string) => {
    setShareData({
      isOpen: true,
      title: title || 'Roll Ball Videos & Live Broadcasts',
      text: text || 'Check out official Roll Ball sport videos, live tournament streams, and roller skating goals!',
    });
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': 
        return <Home onOpenShare={handleOpenShare} />;
      case 'live': 
        return <Live onOpenShare={handleOpenShare} />;
      case 'videos': 
        return <Videos customVideos={customVideos} onOpenUpload={() => setIsUploadOpen(true)} onOpenShare={handleOpenShare} />;
      case 'tournaments': 
        return <Tournaments onOpenShare={handleOpenShare} />;
      case 'profile': 
        return (
          <Profile
            association={association}
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenUpload={() => setIsUploadOpen(true)}
            onLogoutAssociation={handleLogoutAssociation}
          />
        );
      default: 
        return <Home onOpenShare={handleOpenShare} />;
    }
  };

  return (
    <div className="h-screen w-full bg-[#050510] text-white font-sans overflow-hidden relative flex flex-col">
      <div className="absolute top-[-50px] right-[-50px] w-80 h-80 bg-[#0A3D91] rounded-full blur-[100px] opacity-30 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-50px] left-[-50px] w-96 h-96 bg-[#0A3D91] rounded-full blur-[120px] opacity-20 pointer-events-none z-0"></div>
      
      <Header
        association={association}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenShare={handleOpenShare}
      />
      
      <main className="flex-grow px-4 md:px-8 pb-24 overflow-y-auto z-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav currentView={currentView} onChangeView={setCurrentView} />

      {/* Association Login Modal */}
      <AssociationLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Video Upload Modal with Gemini AI Inspection */}
      <UploadVideoModal
        isOpen={isUploadOpen}
        association={association}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        onPromptLogin={() => setIsLoginOpen(true)}
      />

      {/* Universal Share Modal */}
      <ShareModal
        isOpen={shareData.isOpen}
        onClose={() => setShareData(prev => ({ ...prev, isOpen: false }))}
        title={shareData.title}
        text={shareData.text}
      />
    </div>
  );
}
