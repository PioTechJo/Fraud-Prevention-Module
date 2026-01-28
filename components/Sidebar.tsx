import React from 'react';
import { 
  Home, 
  LineChart,
  Settings,
  SlidersHorizontal
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const tooltipClass = "absolute left-full ml-2 px-2 py-1 bg-[#FFFBEB] text-[#0056D2] text-[8px] font-bold rounded border border-yellow-200 shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50";

  return (
    <nav 
      className="w-12 flex flex-col items-center py-4 gap-4 shrink-0 h-full rounded-lg shadow-sm z-20"
      style={{ background: 'linear-gradient(to bottom, #002060 0%, #002060 40%, #0037A4 100%)' }}
    >
      {/* First Page: Home */}
      <div className="relative group flex items-center">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`p-1 rounded-md transition-all ${
            activeTab === 'alerts' 
              ? 'bg-[#0056D2] text-white shadow-inner scale-105' 
              : 'text-white hover:bg-white/10'
          }`}
        >
          <Home size={17.5} strokeWidth={1.5} />
        </button>
        <div className={tooltipClass}>
          Home
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#FFFBEB] border-l border-b border-yellow-200 rotate-45" />
        </div>
      </div>

      {/* Second Page: Business Attributes */}
      <div className="relative group flex items-center">
        <button
          onClick={() => setActiveTab('businessAttributes')}
          className={`p-1 rounded-md transition-all ${
            activeTab === 'businessAttributes' 
              ? 'bg-[#0056D2] text-white shadow-inner scale-105' 
              : 'text-white hover:bg-white/10'
          }`}
        >
          <SlidersHorizontal size={17.5} strokeWidth={1.5} />
        </button>
        <div className={tooltipClass}>
          Business Attributes
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#FFFBEB] border-l border-b border-yellow-200 rotate-45" />
        </div>
      </div>

      {/* Third Page: Alerts Analytics */}
      <div className="relative group flex items-center">
        <button
          onClick={() => setActiveTab('alertsAnalytics')}
          className={`p-1 rounded-md transition-all ${
            activeTab === 'alertsAnalytics' 
              ? 'bg-[#0056D2] text-white shadow-inner scale-105' 
              : 'text-white hover:bg-white/10'
          }`}
        >
          <LineChart size={17.5} strokeWidth={1.5} />
        </button>
        <div className={tooltipClass}>
          Alerts Analytics
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#FFFBEB] border-l border-b border-yellow-200 rotate-45" />
        </div>
      </div>

      {/* Bottom Section: Settings */}
      <div className="mt-auto mb-2 relative group flex items-center">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`p-1 text-white hover:bg-white/10 transition-colors rounded-md ${activeTab === 'settings' ? 'bg-[#0056D2]' : ''}`}
        >
          <Settings size={17.5} strokeWidth={1.5} />
        </button>
        <div className={tooltipClass}>
          Settings
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#FFFBEB] border-l border-b border-yellow-200 rotate-45" />
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;