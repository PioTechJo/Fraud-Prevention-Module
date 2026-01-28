
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, RotateCcw, ReceiptText, Rocket, ShieldCheck, MessageSquareText } from 'lucide-react';
import { Alert, AlertStatus } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
}

type FilterPeriod = '7D' | 'MTD' | 'QTD' | 'YTD' | 'ALL' | 'SPECIFIC';

const AlertsHistoryModal: React.FC<Props> = ({ isOpen, onClose, alerts }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterPeriod>('ALL');
  const [specificDate, setSpecificDate] = useState<string>('');
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setPos({ x: 0, y: 0 });
      setActiveFilter('ALL');
      setSpecificDate('');
      setSelectedHistoryId(null);
    }
  }, [isOpen]);

  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.modal-header')) {
      setDragging(true);
      dragStartPos.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    }
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      setPos({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y,
      });
    };
    const onMouseUp = () => setDragging(false);

    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, pos]);

  const parseDate = (dateStr: string) => {
    const [d, m, y] = dateStr.split('/').map(Number);
    return new Date(y, m - 1, d);
  };

  const filteredAlerts = useMemo(() => {
    const referenceDate = new Date(2025, 8, 15); // Simulation anchor: Sept 15, 2025
    
    return alerts.filter(alert => {
      // Handle Specific Date Filter
      if (activeFilter === 'SPECIFIC' && specificDate) {
        const [year, month, day] = specificDate.split('-');
        const formattedTarget = `${day}/${month}/${year}`;
        return alert.date === formattedTarget;
      }

      const alertDate = parseDate(alert.date);
      
      switch (activeFilter) {
        case '7D':
          const sevenDaysAgo = new Date(referenceDate);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return alertDate >= sevenDaysAgo;
        case 'MTD':
          return alertDate.getMonth() === referenceDate.getMonth() && 
                 alertDate.getFullYear() === referenceDate.getFullYear();
        case 'QTD':
          // Q3 starts on July 1st (month index 6)
          const quarterStart = new Date(2025, 6, 1);
          return alertDate >= quarterStart;
        case 'YTD':
          return alertDate.getFullYear() === referenceDate.getFullYear();
        case 'ALL':
        default:
          return true;
      }
    });
  }, [alerts, activeFilter, specificDate]);

  const customerInfo = useMemo(() => {
    if (alerts.length > 0) {
      return { name: alerts[0].customerName, cif: alerts[0].cif };
    }
    return null;
  }, [alerts]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSpecificDate(val);
    if (val) {
      setActiveFilter('SPECIFIC');
    } else {
      setActiveFilter('ALL');
    }
  };

  const handlePeriodClick = (period: FilterPeriod) => {
    setActiveFilter(period);
    setSpecificDate('');
    setSelectedHistoryId(null);
  };

  if (!isOpen) return null;

  const filterBtnClass = (filter: FilterPeriod) => `
    w-8 h-6 rounded text-[9px] font-bold tracking-tight transition-all flex items-center justify-center
    ${activeFilter === filter 
      ? 'bg-[#0056D2] text-white shadow-sm' 
      : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-[#0056D2]'}
  `;

  const inputClass = "w-full border border-gray-300 rounded px-2 py-0 text-[10px] outline-none transition-all h-6 bg-white focus:border-blue-500 placeholder-blue-300 placeholder:not-italic placeholder:font-normal";
  const labelClass = "text-[9px] font-semibold text-gray-400 block";

  // Action button class for historical alerts
  const actionBtnClass = "w-6 h-6 rounded-md transition-all flex items-center justify-center relative group";
  
  // Custom Tooltip class
  const tooltipClass = "absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-[#FFFBEB] text-[#0056D2] text-[8px] font-bold px-1.5 py-0.5 rounded border border-yellow-200 shadow-sm whitespace-nowrap z-30 pointer-events-none";

  // Sizing constants to ensure exactly 5 rows are visible
  const ROW_HEIGHT = 36;
  const HEADER_HEIGHT = 26;
  const GRID_CONTAINER_HEIGHT = (ROW_HEIGHT * 5) + HEADER_HEIGHT;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] pointer-events-none overflow-hidden">
      <div 
        className="bg-white rounded-lg w-full max-w-3xl border border-gray-200 pointer-events-auto transition-transform duration-300 ease-out animate-in fade-in zoom-in-95 flex flex-col h-auto"
        style={{ 
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.4), 0px 10px 10px -5px rgba(0, 0, 0, 0.2)',
          maxHeight: '90vh'
        }}
      >
        <div 
          onMouseDown={onMouseDown}
          className="modal-header bg-[#001D4A] px-3 py-[10px] flex justify-between items-center cursor-move select-none rounded-t-lg shrink-0 mt-[-5px]"
        >
          <h3 className="text-white font-bold text-[12px] uppercase tracking-wider">ALERTS HISTORY</h3>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-300 transition-colors cursor-pointer outline-none p-0.5"
          >
            <X size={16} />
          </button>
        </div>

        {/* Customer Context (CIF below Customer Name, aligned horizontally to middle) */}
        {customerInfo && (
          <div className="bg-gray-50 px-6 py-2.5 flex flex-col items-center justify-center border-b border-gray-100 shrink-0">
            <span className="text-[#0056D2] text-[14px] font-bold truncate max-w-full leading-tight text-center">
              {customerInfo.name}
            </span>
            <span className="text-gray-400 text-[10px] font-medium tracking-tight leading-tight mt-0.5 text-center">
              {customerInfo.cif}
            </span>
          </div>
        )}

        {/* Filter Toolbar - Increased pt from 12px (py-3) to 17px to move content down by 5px */}
        <div className="bg-white px-6 pt-[17px] pb-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 h-6">
            <span className={labelClass}>Filter Period:</span>
            <div className="flex items-center gap-1 h-6">
              <button onClick={() => handlePeriodClick('7D')} className={filterBtnClass('7D')}>7D</button>
              <button onClick={() => handlePeriodClick('MTD')} className={filterBtnClass('MTD')}>MTD</button>
              <button onClick={() => handlePeriodClick('QTD')} className={filterBtnClass('QTD')}>QTD</button>
              <button onClick={() => handlePeriodClick('YTD')} className={filterBtnClass('YTD')}>YTD</button>
              <button onClick={() => handlePeriodClick('ALL')} className={filterBtnClass('ALL')}>ALL</button>
            </div>
          </div>

          <div className="flex items-center gap-2 h-6 self-end">
            <span className={labelClass}>Specific Date</span>
            <div className="flex items-center gap-1.5 h-6">
              <input 
                type="date" 
                value={specificDate}
                onChange={handleDateChange}
                className={`${inputClass} w-32 ${!specificDate ? 'text-blue-300 font-normal' : 'text-[#0056D2] font-semibold'}`}
              />
              {specificDate && (
                <button 
                  onClick={() => handlePeriodClick('ALL')}
                  className="text-gray-400 hover:text-[#E31B23] transition-colors p-0.5 h-6 flex items-center"
                  title="Reset date filter"
                >
                  <RotateCcw size={12} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid Container - Fixed height for exactly 5 rows */}
        <div 
          className="flex flex-col mt-[5px] shrink-0" 
          style={{ height: `${GRID_CONTAINER_HEIGHT}px` }}
        >
          <div className="overflow-y-auto no-scrollbar scroll-grid h-full">
            <table className="w-full text-left text-[9px] table-fixed border-collapse">
              <thead className="sticky top-0 bg-white border-b border-gray-100 text-gray-400 font-semibold text-[7px] z-10">
                <tr className="whitespace-nowrap" style={{ height: `${HEADER_HEIGHT}px` }}>
                  <th className="pl-6 font-medium w-[6%] align-middle">Sts</th>
                  <th className="px-6 font-medium w-[18%] align-middle">Date / Time</th>
                  <th className="px-6 font-medium w-[24%] align-middle">Trn Type / Country</th>
                  <th className="px-6 font-medium w-[18%] align-middle">Amount / Currency</th>
                  <th className="px-6 font-medium w-[9%] align-middle">Source</th>
                  <th className="px-6 font-medium w-[25%] align-middle text-center">Alert Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map((alert) => (
                    <tr 
                      key={alert.id} 
                      onClick={() => setSelectedHistoryId(alert.id)}
                      className={`cursor-pointer transition-colors ${
                        selectedHistoryId === alert.id ? 'bg-[#0056D2] text-white' : 'hover:bg-gray-50'
                      }`}
                      style={{ height: `${ROW_HEIGHT}px` }}
                    >
                      <td className="pl-6 align-middle">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          alert.status === AlertStatus.CONFIRMED_FRAUD ? 'bg-[#FF0000]' :
                          alert.status === AlertStatus.CONFIRMED_LEGITIMATE ? 'bg-[#00CC00]' :
                          'bg-[#00AEEF]'
                        }`} />
                      </td>
                      <td className="px-6 align-middle">
                        <div className={`text-[9px] font-medium leading-none mb-0.5 ${selectedHistoryId === alert.id ? 'text-white' : 'text-[#001D4A]'}`}>{alert.date}</div>
                        <div className={`text-[8px] leading-none ${selectedHistoryId === alert.id ? 'text-blue-100' : 'text-gray-400'}`}>{alert.time}</div>
                      </td>
                      <td className="px-6 align-middle">
                        <div className={`text-[9px] font-medium truncate leading-none mb-0.5 ${selectedHistoryId === alert.id ? 'text-white' : 'text-[#001D4A]'}`}>{alert.type}</div>
                        <div className={`text-[8px] truncate leading-none ${selectedHistoryId === alert.id ? 'text-blue-100' : 'text-gray-400'}`}>{alert.country}</div>
                      </td>
                      <td className="px-6 align-middle">
                        <div className={`text-[9px] font-semibold leading-none mb-0.5 ${selectedHistoryId === alert.id ? 'text-white' : 'text-[#001D4A]'}`}>
                          {alert.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className={`text-[8px] leading-none ${selectedHistoryId === alert.id ? 'text-blue-100' : 'text-gray-400'}`}>{alert.currency}</div>
                      </td>
                      <td className="px-6 align-middle">
                        <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${
                          selectedHistoryId === alert.id ? 'bg-white/20' : 'text-blue-600'
                        }`}>
                          {alert.source}
                        </span>
                      </td>
                      <td className="px-6 align-middle text-center">
                        {selectedHistoryId === alert.id && (
                          <div className="flex justify-center gap-2">
                            <button className={`${actionBtnClass} bg-white/20 hover:bg-white/30 text-white border border-white/30`}>
                              <ReceiptText size={12} />
                              <div className={tooltipClass}>Transaction Details</div>
                            </button>
                            <button className={`${actionBtnClass} bg-white/20 hover:bg-white/30 text-white border border-white/30`}>
                              <Rocket size={12} />
                              <div className={tooltipClass}>Alert Trigger</div>
                            </button>
                            <button className={`${actionBtnClass} bg-white/20 hover:bg-white/30 text-white border border-white/30`}>
                              <ShieldCheck size={12} />
                              <div className={tooltipClass}>Preventive Actions</div>
                            </button>
                            <button className={`${actionBtnClass} bg-white/20 hover:bg-white/30 text-white border border-white/30`}>
                              <MessageSquareText size={12} />
                              <div className={tooltipClass}>Customer Feedback</div>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic text-[11px]">
                      No historical records found for this selection.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Footer with Alert Count */}
        <div className="h-[41px] bg-white border-t border-gray-100 shrink-0 rounded-b-lg flex items-center justify-center">
          <span className="text-gray-400 text-[10px] font-semibold tracking-tight">
            Total Historical Alerts: <span className="text-[#0056D2]">{filteredAlerts.length}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlertsHistoryModal;
