import React from 'react';
import { Home, LineChart, Settings, SlidersHorizontal } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: 'EN' | 'AR';
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, language }) => {
  const isAr = language === 'AR';
  const tooltipClass = `absolute ${isAr ? 'right-full mr-2' : 'left-full ml-2'} px-2 py-1 bg-[#FFFBEB] text-[#0056D2] ${isAr ? 'text-[11px]' : 'text-[9px]'} font-semibold rounded border border-yellow-200 shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999]`;
  const iconSize = 21.5;
  const strokeWidth = 1.5;

  const labels = {
    home: isAr ? 'الرئيسية' : 'Home',
    business: isAr ? 'خصائص العمل' : 'Business Attributes',
    analytics: isAr ? 'تحليلات التنبيهات' : 'Alerts Analytics',
    settings: isAr ? 'الإعدادات' : 'Settings'
  };

  return (
    <nav 
      className="w-14 flex flex-col items-center pt-7 pb-4 gap-7 shrink-0 h-full rounded-lg shadow-sm z-20"
      style={{ background: 'linear-gradient(to bottom, #002060 0%, #002060 40%, #0037A4 100%)' }}
    >
      <div className="relative group flex items-center">
        <button onClick={() => setActiveTab('alerts')} className={`p-2 rounded-md transition-all ${activeTab === 'alerts' ? 'bg-[#0056D2] text-white' : 'text-white'}`}>
          <Home size={iconSize} strokeWidth={strokeWidth} />
        </button>
        <div className={tooltipClass}>
          {labels.home}
          <div className={`absolute top-1/2 ${isAr ? '-right-1' : '-left-1'} -translate-y-1/2 w-2 h-2 bg-[#FFFBEB] ${isAr ? 'border-r border-t' : 'border-l border-b'} border-yellow-200 rotate-45`} />
        </div>
      </div>
      <div className="relative group flex items-center">
        <button onClick={() => setActiveTab('businessAttributes')} className={`p-2 rounded-md transition-all ${activeTab === 'businessAttributes' ? 'bg-[#0056D2] text-white' : 'text-white'}`}>
          <SlidersHorizontal size={iconSize} strokeWidth={strokeWidth} />
        </button>
        <div className={tooltipClass}>
          {labels.business}
          <div className={`absolute top-1/2 ${isAr ? '-right-1' : '-left-1'} -translate-y-1/2 w-2 h-2 bg-[#FFFBEB] ${isAr ? 'border-r border-t' : 'border-l border-b'} border-yellow-200 rotate-45`} />
        </div>
      </div>
      <div className="relative group flex items-center">
        <button onClick={() => setActiveTab('alertsAnalytics')} className={`p-2 rounded-md transition-all ${activeTab === 'alertsAnalytics' ? 'bg-[#0056D2] text-white' : 'text-white'}`}>
          <LineChart size={iconSize} strokeWidth={strokeWidth} />
        </button>
        <div className={tooltipClass}>
          {labels.analytics}
          <div className={`absolute top-1/2 ${isAr ? '-right-1' : '-left-1'} -translate-y-1/2 w-2 h-2 bg-[#FFFBEB] ${isAr ? 'border-r border-t' : 'border-l border-b'} border-yellow-200 rotate-45`} />
        </div>
      </div>
      <div className="mt-auto mb-2 relative group flex items-center">
        <button onClick={() => setActiveTab('settings')} className={`p-2 rounded-md transition-all ${activeTab === 'settings' ? 'bg-[#0056D2] text-white' : 'text-white'}`}>
          <Settings size={iconSize} strokeWidth={strokeWidth} />
        </button>
        <div className={tooltipClass}>
          {labels.settings}
          <div className={`absolute top-1/2 ${isAr ? '-right-1' : '-left-1'} -translate-y-1/2 w-2 h-2 bg-[#FFFBEB] ${isAr ? 'border-r border-t' : 'border-l border-b'} border-yellow-200 rotate-45`} />
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;