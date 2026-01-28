import React, { useState, useEffect } from 'react';
import { User, Maximize2, Minimize2 } from 'lucide-react';

const Header: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <header 
      className="h-[64px] bg-[#001D4A] flex items-center justify-between px-4 shrink-0 border-b border-[#002b6b] relative z-50"
      style={{ boxShadow: '0 5px 8px rgba(0, 0, 0, 0.6)' }}
    >
      <div className="flex items-center gap-2">
        {/* Mock Logo */}
        <div className="flex flex-col">
          <span className="text-white font-bold text-base leading-none tracking-tight">PIO-TECH</span>
          <span className="text-[7px] text-gray-400 font-medium">SOLUTIONS</span>
        </div>
      </div>

      <h1 className="text-white font-medium text-[19px] tracking-wider uppercase">
        Fraud Prevention Module
      </h1>

      <div className="flex items-center gap-4 text-white">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-semibold leading-none">Ahmad Abdullah</p>
            <p className="text-[9px] text-gray-400">Monday, 15 Sep 2025</p>
          </div>
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
            <User size={18} className="text-white" />
          </div>
        </div>
        
        <div className="w-[1px] h-6 bg-white/10 mx-1" />

        <button 
          onClick={toggleFullscreen}
          className="p-1.5 hover:bg-white/10 rounded-md transition-colors group relative"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 size={18} className="text-white/80 group-hover:text-white" />
          ) : (
            <Maximize2 size={18} className="text-white/80 group-hover:text-white" />
          )}
          <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-[#FFFBEB] text-[#0056D2] text-[8px] font-bold rounded border border-yellow-200 shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;