import React from 'react';
import { Users, Bell, Wallet, Brain, Settings2 } from 'lucide-react';
import { Alert, AlertStatus } from '../types';

interface Props {
  alerts: Alert[];
}

const SummaryStats: React.FC<Props> = ({ alerts }) => {
  const totalAlerts = alerts.length;
  
  // Calculate unique customers based on unique CIF values
  const uniqueCustomersCount = new Set(alerts.map(a => a.cif)).size;
  
  // Directly calculate counts based on the 'source' column in the grid
  const aiBasedCount = alerts.filter(a => a.source === 'AI').length;
  const ruleBasedCount = alerts.filter(a => a.source === 'RB').length;
  
  // Counts based on the "Sts" column bullets
  const pendingCount = alerts.filter(a => a.status === AlertStatus.PENDING).length;
  const fraudCount = alerts.filter(a => a.status === AlertStatus.CONFIRMED_FRAUD).length;
  const legitimateCount = alerts.filter(a => a.status === AlertStatus.CONFIRMED_LEGITIMATE).length;

  // Conversion rates to JOD
  // USD -> JOD: 0.709
  // SAR -> JOD: 0.189
  // AED -> JOD: 0.193
  const totalValueJOD = alerts.reduce((acc, alert) => {
    let amountInJOD = alert.amount;
    if (alert.currency === 'USD') amountInJOD = alert.amount * 0.709;
    else if (alert.currency === 'SAR') amountInJOD = alert.amount * 0.189;
    else if (alert.currency === 'AED') amountInJOD = alert.amount * 0.193;
    return acc + amountInJOD;
  }, 0);

  const getPercentage = (count: number) => {
    if (totalAlerts === 0) return '0%';
    return `${(count / totalAlerts) * 100}%`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Stat Cards Row - Background color set to #0056D2 to match selected row background. Rounded corners increased from md to lg. */}
      <div className="flex justify-center gap-x-10 bg-[#0056D2] rounded-lg text-white py-3 px-6 mt-[5px] shadow-sm">
        <div className="flex items-center gap-2.5">
          <Users size={24} strokeWidth={1} className="text-white" />
          <div className="w-[0.5px] h-6 bg-white/40 shrink-0" />
          <div>
            <p className="text-[7px] uppercase font-normal text-white/80 leading-none mb-0.5">Customers</p>
            <p className="text-[13px] font-bold">{uniqueCustomersCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Bell size={24} strokeWidth={1} className="text-white" />
          <div className="w-[0.5px] h-6 bg-white/40 shrink-0" />
          <div>
            <p className="text-[7px] uppercase font-normal text-white/80 leading-none mb-0.5">Total Alerts</p>
            <p className="text-[13px] font-bold">{totalAlerts}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Wallet size={24} strokeWidth={1} className="text-white" />
          <div className="w-[0.5px] h-6 bg-white/40 shrink-0" />
          <div>
            <p className="text-[7px] uppercase font-normal text-white/80 leading-none mb-0.5">Total Value (JOD)</p>
            <p className="text-[13px] font-bold">
              {totalValueJOD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Brain size={24} strokeWidth={1} className="text-white" />
          <div className="w-[0.5px] h-6 bg-white/40 shrink-0" />
          <div>
            <p className="text-[7px] uppercase font-normal text-white/80 leading-none mb-0.5">AI-Based</p>
            <p className="text-[13px] font-bold">{aiBasedCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Settings2 size={24} strokeWidth={1} className="text-white" />
          <div className="w-[0.5px] h-6 bg-white/40 shrink-0" />
          <div>
            <p className="text-[7px] uppercase font-normal text-white/80 leading-none mb-0.5">Rule Based</p>
            <p className="text-[13px] font-bold">{ruleBasedCount}</p>
          </div>
        </div>
      </div>

      {/* Distribution Progress Bar (Stacked Bar Chart) - Rounded corners increased from sm to rounded. */}
      <div className="self-center w-2/3 relative h-[21.5] flex rounded overflow-hidden text-[11px] font-bold text-white shadow-inner mt-6 bg-gray-100">
        {/* Pending Confirmation (Blue) */}
        <div 
          className="h-full bg-[#00AEEF] flex items-center justify-center transition-all duration-300" 
          style={{ width: getPercentage(pendingCount) }}
          title="Pending Confirmation"
        >
          {pendingCount > 0 && pendingCount}
        </div>
        {/* Confirmed Fraud (Red) */}
        <div 
          className="h-full bg-[#FF0000] flex items-center justify-center transition-all duration-300" 
          style={{ width: getPercentage(fraudCount) }}
          title="Confirmed Fraud"
        >
          {fraudCount > 0 && fraudCount}
        </div>
        {/* Confirmed Legitimate (Green) */}
        <div 
          className="h-full bg-[#00CC00] flex items-center justify-center transition-all duration-300" 
          style={{ width: getPercentage(legitimateCount) }}
          title="Confirmed Legitimate"
        >
          {legitimateCount > 0 && legitimateCount}
        </div>
      </div>

      {/* Legend Row */}
      <div className="flex justify-center gap-6 text-[9px] font-semibold">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-[#00AEEF] rounded-full" /> 
          <span className="text-[#00AEEF]">Pending Confirmation</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-[#FF0000] rounded-full" /> 
          <span className="text-[#FF0000]">Confirmed Fraud</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-[#00CC00] rounded-full" /> 
          <span className="text-[#00CC00]">Confirmed Legitimate</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;