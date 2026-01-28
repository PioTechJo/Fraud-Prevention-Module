
import React, { useMemo } from 'react';
import { Alert } from '../types';

interface Props {
  alerts: Alert[];
}

const AlertsMonthlyChart: React.FC<Props> = ({ alerts }) => {
  // Reference simulation month: Sept 2025
  const MONTHS_ORDER = useMemo(() => {
    const months = [];
    const date = new Date(2025, 8, 1); // Sept 2025
    for (let i = 11; i >= 0; i--) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      months.push({
        label: d.toLocaleString('en-US', { month: 'short', year: '2-digit' }),
        month: d.getMonth() + 1,
        year: d.getFullYear()
      });
    }
    return months;
  }, []);

  const data = useMemo(() => {
    const counts = MONTHS_ORDER.map(m => {
      const count = alerts.filter(alert => {
        const [day, month, year] = alert.date.split('/').map(Number);
        return month === m.month && year === m.year;
      }).length;
      return { ...m, count };
    });

    const maxCount = Math.max(...counts.map(d => d.count), 1);
    return counts.map(d => ({
      ...d,
      height: (d.count / maxCount) * 100
    }));
  }, [alerts, MONTHS_ORDER]);

  return (
    <div className="w-full h-full flex flex-col p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-[#001D4A] font-bold text-[12px] uppercase tracking-tight">Alerts Monthly Growth</h3>
          <p className="text-gray-400 text-[9px] mt-0.5 font-medium">Monthly analysis for the last 12 months</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-[#0056D2] rounded-sm" />
            <span className="text-gray-500 text-[8px] font-bold uppercase">Volume</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative min-h-0">
        {/* Y-Axis Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-4">
          {[0, 1, 2, 3, 4].map((_, i) => (
            <div key={i} className="w-full border-t border-gray-100 border-dashed" />
          ))}
        </div>

        {/* Bars Container */}
        <div className="flex-1 flex items-end justify-between px-2 pb-8 relative z-10">
          {data.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center group cursor-pointer h-full justify-end">
              {/* Tooltip/Count Label */}
              <div className="mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-[#001D4A] text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                  {item.count}
                </span>
              </div>
              
              {/* The Bar */}
              <div 
                className="w-3/5 bg-[#0056D2] rounded-t-sm transition-all duration-500 group-hover:bg-[#0037A4] relative"
                style={{ height: `${item.height}%` }}
              >
                {/* Visual Label Above Bar if not hovered */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-400 group-hover:hidden">
                  {item.count > 0 ? item.count : ''}
                </div>
              </div>

              {/* X-Axis Label */}
              <div className="absolute bottom-0 text-[8px] font-bold text-gray-400 uppercase tracking-tight mt-2 whitespace-nowrap">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertsMonthlyChart;
