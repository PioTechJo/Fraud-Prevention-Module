
import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, Sun, Moon, LogOut, Database, RefreshCw } from 'lucide-react';
import { DbStatus } from '../App';

interface HeaderProps {
  language: 'EN' | 'AR';
  setLanguage: (lang: 'EN' | 'AR') => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  dbStatus: DbStatus;
  onRefresh?: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, theme, setTheme, dbStatus, onRefresh }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isAr = language === 'AR';
  const isDark = theme === 'dark';

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

  const tooltipClass = `absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#FFFBEB] text-[#0056D2] ${isAr ? 'text-[11px]' : 'text-[9px]'} font-semibold rounded border border-yellow-200 shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999]`;
  const arrowClass = "absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#FFFBEB] border-l border-t border-yellow-200 rotate-45";

  const statusColor = dbStatus === 'connected' ? 'bg-[#00CC00]' : dbStatus === 'disconnected' ? 'bg-[#FF0000]' : 'bg-yellow-400 animate-pulse';
  const statusLabel = dbStatus === 'connected' ? (isAr ? 'متصل بقاعدة البيانات' : 'Connected to DB') : dbStatus === 'disconnected' ? (isAr ? 'غير متصل' : 'Disconnected') : (isAr ? 'جاري الاتصال...' : 'Connecting...');

  return (
    <header 
      className={`h-[76px] flex items-center justify-between px-4 shrink-0 border-b relative z-50 transition-colors duration-300 ${isDark ? 'border-[#555]' : 'border-[#002b6b]'}`}
      style={{ 
        background: 'linear-gradient(to right, #002060 15%, #0037A4 50%, #002060 85%)',
        boxShadow: isDark ? '0 5px 8px rgba(120, 120, 120, 0.35)' : '0 5px 8px rgba(0, 0, 0, 0.6)' 
      }}
    >
      <div className="flex items-center gap-2 translate-y-2">
        <div className="flex flex-col">
          <span className="text-white font-bold text-[18px] leading-none tracking-tight">PIO-TECH</span>
          <span className="text-[9px] text-gray-400 font-semibold">SOLUTIONS</span>
        </div>
      </div>

      <div className="flex flex-col items-center translate-y-2">
        <h1 className="text-white font-medium text-[19px] tracking-wider uppercase leading-tight">
          Fraud Prevention Module
        </h1>
        <div className="flex items-center gap-3 mt-0.5">
          <p className="text-[11px] font-semibold text-gray-400">
            {isAr ? 'الإثنين، 15 سبتمبر 2025' : 'Monday, 15 Sep 2025'}
          </p>
          <div className="w-[1px] h-2.5 bg-gray-400" />
          <p className="text-[11px] font-semibold tracking-wide text-gray-400">
            {isAr ? 'أحمد عبد الله' : 'Ahmad Abdullah'}
          </p>
          <div className="relative group">
            <button className="text-gray-400 hover:text-white transition-colors flex items-center outline-none">
              <LogOut size={12} className={isAr ? 'rotate-180' : ''} />
            </button>
            <div className={tooltipClass}>
              {isAr ? 'تسجيل الخروج' : 'Logout'}
              <div className={arrowClass} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 translate-y-2">
        {/* Connection Status Indicator */}
        <div className="relative group flex items-center gap-1 mr-1">
          <button onClick={onRefresh} className="p-1.5 hover:bg-white/10 rounded-md transition-all text-white/80 hover:text-white">
            <RefreshCw size={16} className={dbStatus === 'connecting' ? 'animate-spin' : ''} />
          </button>
          <div className={`w-3 h-3 rounded-full border border-white/20 ${statusColor} shadow-[0_0_8px_rgba(0,0,0,0.3)]`} />
          <div className={tooltipClass}>
            {statusLabel}
            <div className={arrowClass} />
          </div>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="p-1.5 hover:bg-white/10 rounded-md transition-all group relative overflow-visible"
        >
          <div className={`transition-transform duration-300 ${isDark ? 'rotate-0' : 'rotate-[360deg]'}`}>
            {isDark ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-white/80 group-hover:text-white" />
            )}
          </div>
          <div className={tooltipClass}>
            {isDark ? (isAr ? 'الوضع المضيء' : 'Light Mode') : (isAr ? 'الوضع المظلم' : 'Dark Mode')}
            <div className={arrowClass} />
          </div>
        </button>

        {/* Language Switcher */}
        <div className={`flex rounded-md p-0.5 border ${isDark ? 'bg-white/5 border-[#555]' : 'bg-white/5 border-white/10'}`}>
          <div className="relative group">
            <button 
              onClick={() => setLanguage('EN')}
              className={`px-2.5 py-1 rounded text-[9px] font-bold transition-all duration-200 ${
                language === 'EN' 
                  ? 'bg-[#0056D2] text-white shadow-sm' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <div className={tooltipClass}>
              {isAr ? 'الإنجليزية' : 'English'}
              <div className={arrowClass} />
            </div>
          </div>
          <div className="relative group">
            <button 
              onClick={() => setLanguage('AR')}
              className={`px-2.5 py-1 rounded text-[9px] font-bold transition-all duration-200 ${
                language === 'AR' 
                  ? 'bg-[#0056D2] text-white shadow-sm' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              AR
            </button>
            <div className={tooltipClass}>
              {isAr ? 'العربية' : 'Arabic'}
              <div className={arrowClass} />
            </div>
          </div>
        </div>

        {/* Fullscreen Toggle */}
        <button 
          onClick={toggleFullscreen}
          className="p-1.5 hover:bg-white/10 rounded-md transition-colors group relative overflow-visible"
        >
          {isFullscreen ? (
            <Minimize2 size={18} className="text-white/80 group-hover:text-white" />
          ) : (
            <Maximize2 size={18} className="text-white/80 group-hover:text-white" />
          )}
          <div className={tooltipClass}>
            {isFullscreen ? (isAr ? 'خروج من ملء الشاشة' : 'Exit Fullscreen') : (isAr ? 'ملء الشاشة' : 'Enter Fullscreen')}
            <div className={arrowClass} />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
