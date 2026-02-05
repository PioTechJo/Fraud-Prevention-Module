
import React from 'react';
import { Filter, ArrowUpDown, RotateCcw, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Alert, AlertStatus } from '../types';
import SummaryStats from './SummaryStats';
import { ActiveModal } from '../App';

interface Props {
  alerts: Alert[];
  totalCount: number;
  selectedId: string;
  onSelect: (alert: Alert) => void;
  filterCriteria: any;
  setFilterCriteria: any;
  sortCriteriaList: any;
  setSortCriteriaList: any;
  language: 'EN' | 'AR';
  theme: 'light' | 'dark';
  activeModal: ActiveModal;
  setActiveModal: (m: ActiveModal) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  loading: boolean;
  statusCounts?: { pending: number; fraud: number; legit: number };
}

const ITEMS_PER_PAGE = 10;

const StatusBar: React.FC<{ language: 'EN' | 'AR', counts?: { pending: number; fraud: number; legit: number } }> = ({ language, counts }) => {
  const isAr = language === 'AR';
  
  // Dynamic counts passed from DB
  const pending = counts?.pending ?? 0;
  const fraud = counts?.fraud ?? 0;
  const legit = counts?.legit ?? 0;
  const total = pending + fraud + legit || 1;

  const pendingPct = (pending / total) * 100;
  const fraudPct = (fraud / total) * 100;
  const legitPct = (legit / total) * 100;

  return (
    <div className="flex flex-col items-center w-full px-12 py-2 mt-2">
      <div className="w-full flex justify-between px-2 mb-1.5 font-black text-[13px]">
         <span className="text-[#00AEEF] transition-all duration-500" style={{ transform: `translateX(${Math.min(pendingPct, 15)}%)` }}>{pending.toLocaleString()}</span>
         <span className="text-[#FF0000] transition-all duration-500">{fraud.toLocaleString()}</span>
         <span className="text-[#00CC00]">{legit.toLocaleString()}</span>
      </div>
      <div className="w-full h-3.5 flex rounded-full overflow-hidden shadow-inner border border-gray-100 bg-gray-50">
        <div className="bg-[#00AEEF] h-full transition-all duration-700" style={{ width: `${pendingPct}%` }} />
        <div className="bg-[#FF0000] h-full transition-all duration-700" style={{ width: `${fraudPct}%` }} />
        <div className="bg-[#00CC00] h-full transition-all duration-700" style={{ width: `${legitPct}%` }} />
      </div>
      <div className="flex gap-8 mt-3 text-[10px] font-black uppercase tracking-tight">
        <div className="flex items-center gap-1.5">
           <div className="w-2.5 h-2.5 rounded-full bg-[#00AEEF]" />
           <span className="text-gray-400">{isAr ? 'بانتظار التأكيد' : 'Pending Confirmation'}</span>
        </div>
        <div className="flex items-center gap-1.5">
           <div className="w-2.5 h-2.5 rounded-full bg-[#FF0000]" />
           <span className="text-gray-400">{isAr ? 'احتيال مؤكد' : 'Confirmed Fraud'}</span>
        </div>
        <div className="flex items-center gap-1.5">
           <div className="w-2.5 h-2.5 rounded-full bg-[#00CC00]" />
           <span className="text-gray-400">{isAr ? 'حركة طبيعية' : 'Confirmed Legitimate'}</span>
        </div>
      </div>
    </div>
  );
};

const AlertsList: React.FC<Props> = ({ 
  alerts, totalCount, selectedId, onSelect, setFilterCriteria,
  language, theme, setActiveModal, currentPage, setCurrentPage, loading, statusCounts
}) => {
  const isAr = language === 'AR';
  const isDark = theme === 'dark';

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const t = {
    title: isAr ? 'قائمة التنبيهات' : 'LIST OF ALERTS',
    filter: isAr ? 'فلترة' : 'Filter',
    sort: isAr ? 'ترتيب' : 'Sort',
    reset: isAr ? 'إعادة تعيين' : 'Reset',
    sts: isAr ? 'الحالة' : 'Sts',
    customer: isAr ? 'العميل' : 'Customer Name / CIF',
    dateTime: isAr ? 'التاريخ / الوقت' : 'Date / Time',
    trnType: isAr ? 'نوع الحركة' : 'Trn Type / Country',
    amount: isAr ? 'المبلغ' : 'Amount / Currency',
    source: isAr ? 'المصدر' : 'Source',
    page: isAr ? 'صفحة' : 'Page',
    of: isAr ? 'من' : 'of'
  };

  // Prepare dynamic counts for SummaryStats
  const summaryCounts = {
    customers: 103, // Mocked for now as it requires another expensive query
    alerts: totalCount,
    value: 302379, // Mocked
    ai: statusCounts ? Math.round(totalCount * 0.4) : 0, // Mocked ratio
    rule: statusCounts ? Math.round(totalCount * 0.45) : 0, // Mocked ratio
    inbound: statusCounts ? Math.round(totalCount * 0.15) : 0 // Mocked ratio
  };

  return (
    <div className={`flex flex-col h-full rounded-xl shadow-sm border overflow-hidden ${isDark ? 'bg-[#181818] border-[#333]' : 'bg-white border-gray-100'}`}>
      <div className="px-6 py-4 flex justify-between items-center shrink-0">
        <h2 className="font-black text-[18px] text-[#002060] dark:text-[#00AEEF] tracking-tight">{t.title}</h2>
        <div className="flex gap-6 text-gray-400 text-[11px] font-bold uppercase tracking-widest">
          <button onClick={() => setActiveModal('filter')} className="flex items-center gap-1.5 hover:text-[#0056D2] transition-colors"><Filter size={15} /> {t.filter}</button>
          <button onClick={() => setActiveModal('sort')} className="flex items-center gap-1.5 hover:text-[#0056D2] transition-colors"><ArrowUpDown size={15} /> {t.sort}</button>
          <button onClick={() => setFilterCriteria(null)} className="flex items-center gap-1.5 hover:text-[#0056D2] transition-colors"><RotateCcw size={15} /> {t.reset}</button>
        </div>
      </div>

      <div className="px-4 flex flex-col items-center">
        <SummaryStats alerts={alerts} language={language} theme={theme} totalCounts={summaryCounts} />
        <StatusBar language={language} counts={statusCounts} />
      </div>

      <div className="flex-1 relative overflow-hidden flex flex-col mt-4">
        {loading && (
          <div className="absolute inset-0 bg-white/60 dark:bg-black/60 z-20 flex flex-col items-center justify-center gap-3 backdrop-blur-[1px]">
             <Loader2 size={32} className="text-[#0056D2] animate-spin" />
             <span className="text-[11px] font-black text-[#0056D2] uppercase tracking-widest">{isAr ? 'جاري التحميل...' : 'Syncing Records...'}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <table className="w-full text-left table-fixed border-collapse">
            <thead className={`sticky top-0 z-10 border-b ${isDark ? 'bg-[#181818] border-[#333]' : 'bg-white border-gray-100'} text-[10px] font-bold text-gray-400 uppercase tracking-tight`}>
              <tr>
                <th className="py-2 w-[8%] text-center">{t.sts}</th>
                <th className="px-2 py-2 w-[28%]">{t.customer}</th>
                <th className="px-2 py-2 w-[18%]">{t.dateTime}</th>
                <th className="px-2 py-2 w-[18%]">{t.trnType}</th>
                <th className="px-2 py-2 w-[18%]">{t.amount}</th>
                <th className="px-2 py-2 w-[10%] text-center">{t.source}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {alerts.length > 0 ? alerts.map(alert => (
                <tr 
                  key={alert.id} 
                  onClick={() => onSelect(alert)}
                  className={`cursor-pointer transition-all ${selectedId === alert.id ? 'bg-[#0056D2] text-white shadow-md' : (isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50')}`}
                >
                  <td className="py-3 text-center">
                    <div className={`mx-auto w-2.5 h-2.5 rounded-full ring-2 ${selectedId === alert.id ? 'ring-white/20' : (isDark ? 'ring-white/5' : 'ring-white/10')} ${alert.status === AlertStatus.CONFIRMED_FRAUD ? 'bg-[#FF0000]' : alert.status === AlertStatus.CONFIRMED_LEGITIMATE ? 'bg-[#00CC00]' : 'bg-[#00AEEF]'}`} />
                  </td>
                  <td className="px-2 py-3">
                    <p className="text-[11px] font-black leading-none mb-1 truncate">{alert.customerName}</p>
                    <p className={`text-[9px] font-bold opacity-60`}>{alert.cif}</p>
                  </td>
                  <td className="px-2 py-3">
                    <p className="text-[11px] font-black leading-none mb-1">{alert.date}</p>
                    <p className={`text-[9px] font-bold opacity-60`}>{alert.time}</p>
                  </td>
                  <td className="px-2 py-3">
                    <p className="text-[11px] font-black leading-none mb-1 truncate uppercase">{alert.type}</p>
                    <p className={`text-[9px] font-bold opacity-60 uppercase`}>{alert.country}</p>
                  </td>
                  <td className="px-2 py-3">
                    <p className="text-[11px] font-black leading-none mb-1">{alert.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <p className={`text-[9px] font-bold opacity-60`}>{alert.currency}</p>
                  </td>
                  <td className="px-2 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black ${selectedId === alert.id ? 'bg-white/20' : (isDark ? 'bg-white/10 text-[#00AEEF]' : 'bg-blue-50 text-[#0056D2]')}`}>{alert.source}</span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 italic font-bold uppercase tracking-widest opacity-40">
                    {loading ? 'Fetching...' : 'No Results Found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGING FOOTER */}
        <div className={`shrink-0 h-10 border-t flex items-center justify-between px-6 ${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-gray-100'}`}>
          <div className="flex gap-1.5">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(1)}
              className={`p-1 rounded transition-colors ${isDark ? 'text-gray-500 hover:text-white disabled:opacity-20' : 'text-gray-400 hover:text-[#0056D2] disabled:opacity-30'}`}
            >
              <ChevronsLeft size={16} strokeWidth={2.5} />
            </button>
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`p-1 rounded transition-colors ${isDark ? 'text-gray-500 hover:text-white disabled:opacity-20' : 'text-gray-400 hover:text-[#0056D2] disabled:opacity-30'}`}
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
          </div>
          
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
            {t.page} {currentPage} {t.of} {totalPages || 1}
          </span>

          <div className="flex gap-1.5">
            <button 
              disabled={currentPage === totalPages || totalPages === 0} 
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`p-1 rounded transition-colors ${isDark ? 'text-gray-500 hover:text-white disabled:opacity-20' : 'text-gray-400 hover:text-[#0056D2] disabled:opacity-30'}`}
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0} 
              onClick={() => setCurrentPage(totalPages)}
              className={`p-1 rounded transition-colors ${isDark ? 'text-gray-500 hover:text-white disabled:opacity-20' : 'text-gray-400 hover:text-[#0056D2] disabled:opacity-30'}`}
            >
              <ChevronsRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsList;
