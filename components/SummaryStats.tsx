
import React from 'react';
import { Users, Bell, Wallet, Brain, Key, PhoneIncoming } from 'lucide-react';
import { Alert } from '../types';

interface Props {
  alerts: Alert[];
  language: 'EN' | 'AR';
  theme: 'light' | 'dark';
  totalCounts?: {
    customers: number;
    alerts: number;
    value: number;
    ai: number;
    rule: number;
    inbound: number;
  };
}

const SummaryStats: React.FC<Props> = ({ language, totalCounts }) => {
  const isAr = language === 'AR';
  
  // Use provided counts or fallback to specific reference values from the image
  const uniqueCustomersCount = totalCounts?.customers || 103;
  const totalAlerts = totalCounts?.alerts || 575;
  const totalValue = totalCounts?.value?.toLocaleString() || "302,379";
  const aiBasedCount = totalCounts?.ai || 234;
  const ruleBasedCount = totalCounts?.rule || 246;
  const inboundCallCount = totalCounts?.inbound || 95;

  const chartData = [
    { label: isAr ? 'سحب نقدي' : 'Cash Withdrawal', value: 133 },
    { label: isAr ? 'تحويل فوري' : 'Instant Transfer', value: 111 },
    { label: isAr ? 'شراء مباشر' : 'Direct Purchase', value: 90 },
    { label: isAr ? 'شراء الكتروني' : 'Online Purchase', value: 82 }
  ];

  const maxVal = 160;

  return (
    <div className="flex flex-row items-center bg-[#0056D2] rounded-[24px] text-white px-10 py-5 h-[140px] w-full gap-2 select-none shadow-lg relative overflow-hidden">
      {/* KPI Section - 3 columns, 2 rows */}
      <div className="flex-[7] grid grid-cols-3 gap-x-6 gap-y-4 pr-6">
        <StatItem icon={Users} label={isAr ? "العملاء" : "Customers"} value={uniqueCustomersCount} />
        <StatItem icon={Bell} label={isAr ? "إجمالي التنبيهات" : "Total Alerts"} value={totalAlerts} />
        <StatItem icon={Wallet} label={isAr ? "إجمالي القيمة (JOD)" : "Total Value (JOD)"} value={totalValue} />
        <StatItem icon={Brain} label={isAr ? "ذكاء اصطناعي" : "AI-Based"} value={aiBasedCount} />
        <StatItem icon={Key} label={isAr ? "بناءً على القواعد" : "Rule Based"} value={ruleBasedCount} />
        <StatItem icon={PhoneIncoming} label={isAr ? "مكالمة واردة" : "Inbound Call"} value={inboundCallCount} />
      </div>

      {/* Vertical Divider */}
      <div className="w-[1px] h-20 bg-white/20" />

      {/* Bar Chart Section */}
      <div className="flex-[4] flex items-end justify-between h-full px-6 pb-2 relative">
        <div className="absolute left-6 right-6 bottom-9 h-[0.5px] bg-white/30" />
        {chartData.map((d, i) => (
          <div key={i} className="flex flex-col items-center h-full justify-end z-10 w-12">
            <span className="text-[11px] font-black mb-1.5">{d.value}</span>
            <div 
              className="w-[26px] bg-white rounded-t-[1px] transition-all duration-700" 
              style={{ height: `${(d.value / maxVal) * 60}px` }}
            />
            <div className="mt-2 flex flex-col items-center">
              {d.label.split(' ').map((word, j) => (
                <span key={j} className="text-[8px] font-black uppercase tracking-tighter leading-[1] text-center">{word}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
  <div className="flex items-center gap-3">
    <div className="flex items-center justify-center shrink-0">
       <Icon size={30} strokeWidth={1.5} className="text-white/90" />
    </div>
    <div className="flex flex-col">
      <p className="text-[9px] font-bold leading-none mb-1 opacity-70 uppercase tracking-tight">{label}</p>
      <p className="text-[18px] font-black leading-none tracking-tight">{value}</p>
    </div>
  </div>
);

export default SummaryStats;
