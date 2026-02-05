
import React, { useState, useRef, useEffect, useMemo } from 'react';
// Added Lightbulb to the imports to fix the "Cannot find name 'Lightbulb'" error
import { X, Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Info, MessageSquareText, FileText, ReceiptText, Lightbulb } from 'lucide-react';
import { Alert, AlertStatus } from '../types';
import { AI_TRIGGERS } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
  language: 'EN' | 'AR';
  theme: 'light' | 'dark';
}

type FilterPeriod = '7D' | 'MTD' | 'QTD' | 'YTD' | 'ALL' | 'SPECIFIC';

const ITEMS_PER_PAGE = 7;
const TODAY_DATE = new Date(2025, 8, 15); // Sept 15, 2025

const translateTriggerLabel = (label: string, isAr: boolean) => {
  if (!isAr) return label;
  const mappings: Record<string, string> = {
    'Transaction Country Outlier': 'سلوك غير معتاد - بلد الحركة',
    'Merchant Category Deviation': 'سلوك غير معتاد - فئة التاجر',
    'Spending Volume Anomaly': 'سلوك غير معتاد - حجم الإنفاق',
    'Frequency Pattern Deviation': 'سلوك غير معتاد - تكرار الحركات',
    'Non-Typical Channel Usage': 'سلوك غير معتاد - قناة البدء',
    'Device ID Mismatch': 'تعارض معرف الجهاز',
    'Geographic Velocity Outlier': 'سرعة جغرافية غير منطقية',
    'Time of Day Deviation': 'انحراف توقيت الحركة',
    'Large Rounded Amount': 'مبلغ دائري كبير غير معتاد',
    'New Beneficiary Anomaly': 'مستفيد جديد غير معتاد',
    'High Velocity Rule': 'تعليمات - التكرار العالي',
    'Restricted Country Rule': 'تعليمات - بلد محظور',
    'Amount Threshold Rule': 'تعليمات - سقف المبلغ المسموح',
    'Merchant Blocklist Rule': 'تعليمات - قائمة التجار المحظورين',
    'Card Status Rule': 'تعليمات - حالة البطاقة',
    'Transaction Time Anomaly': 'تعليمات - وقت غير معتاد',
    'Authentication Failure Limit': 'تعليمات - فشل التحقق المتكرر',
    'High Risk Merchant Category': 'تعليمات - فئة تاجر عالية المخاطر',
    'Unusual Instant Transfer': 'تعليمات - تحويل فوري مشبوه',
    'Account Activity Spikes': 'تعليمات - نشاط مفاجئ بالحساب',
    'Inbound Call Received': 'تم استلام مكالمة واردة'
  };
  return mappings[label] || label;
};

const AlertsHistoryModal: React.FC<Props> = ({ isOpen, onClose, alerts, language, theme }) => {
  const isAr = language === 'AR';
  const isDark = theme === 'dark';
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterPeriod>('ALL');
  const [specificDate, setSpecificDate] = useState<string>('');
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const primaryBlue = isDark ? 'text-[#00AEEF]' : 'text-[#0056D2]';
  const labelGrey = 'text-gray-400';

  useEffect(() => {
    if (isOpen) {
      setPos({ x: 0, y: 0 });
      setSelectedHistoryId(null);
      setCurrentPage(1);
      setActiveFilter('ALL');
    }
  }, [isOpen]);

  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.modal-header')) {
      setDragging(true);
      dragStartPos.current = { x: e.clientX - pos.x, y: e.clientY - dragStartPos.current.y };
    }
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      setPos({ x: e.clientX - dragStartPos.current.x, y: e.clientY - dragStartPos.current.y });
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
  }, [dragging]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const [d, m, y] = alert.date.split('/').map(Number);
      const alertDate = new Date(y, m - 1, d);
      
      if (activeFilter === '7D') {
        const diffTime = TODAY_DATE.getTime() - alertDate.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24);
        return diffDays >= 0 && diffDays <= 7;
      }
      if (activeFilter === 'MTD') {
        return alertDate.getMonth() === TODAY_DATE.getMonth() && alertDate.getFullYear() === TODAY_DATE.getFullYear();
      }
      if (activeFilter === 'QTD') {
        const currentQuarter = Math.floor(TODAY_DATE.getMonth() / 3);
        const alertQuarter = Math.floor(alertDate.getMonth() / 3);
        return currentQuarter === alertQuarter && alertDate.getFullYear() === TODAY_DATE.getFullYear();
      }
      if (activeFilter === 'YTD') {
        return alertDate.getFullYear() === TODAY_DATE.getFullYear();
      }
      if (activeFilter === 'SPECIFIC' && specificDate) {
        const [sy, sm, sd] = specificDate.split('-').map(Number);
        return d === sd && m === sm && y === sy;
      }
      return true;
    });
  }, [alerts, activeFilter, specificDate]);

  const totalPages = Math.ceil(filteredAlerts.length / ITEMS_PER_PAGE);
  const paginatedAlerts = filteredAlerts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getDerivedDetails = (alert: Alert) => {
    const hash = alert.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const formattedAmt = alert.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    let accType = isAr ? 'بطاقة ائتمانية' : 'Credit Card';
    let accNo = hash % 2 === 0 ? '4411-7610-7051-5151' : '4112-9011-2233-4455';
    let merchant = isAr ? 'متجر أمازون' : 'Amazon Store';

    const triggerLabelEn = alert.source === 'AI' ? AI_TRIGGERS[hash % AI_TRIGGERS.length].label : 'Standard Rule Check';
    const triggerLabel = translateTriggerLabel(triggerLabelEn, isAr);
    const sourceLabel = alert.source === 'AI' ? (isAr ? 'ذكاء اصطناعي' : 'AI-Based') : 
                        alert.source === 'RB' ? (isAr ? 'تعليمات معرفة' : 'Rule Based') : 
                        (isAr ? 'مكالمة واردة' : 'Inbound Call');

    let feedback = alert.feedback || "";
    if (!feedback) {
      if (alert.status === AlertStatus.CONFIRMED_LEGITIMATE) {
        feedback = isAr ? 
          `تأكيد حركة شرعية: تم التحقق من الحركة بمبلغ ${formattedAmt} ${alert.currency} لصالح ${merchant}. المصدر: ${sourceLabel}.` : 
          `Confirmed Legitimate: Validated ${alert.type} of ${formattedAmt} ${alert.currency} for ${merchant}. Source: ${sourceLabel}.`;
      } else {
        feedback = isAr ? 
          `تأكيد احتيال: أبلغ العميل عن حركة غير مصرح بها بمبلغ ${formattedAmt} ${alert.currency}. المصدر: ${sourceLabel}.` : 
          `Confirmed Fraud: Unrecognized activity of ${formattedAmt} ${alert.currency}. Source: ${sourceLabel}.`;
      }
    }

    return { accType, accNo, feedback, triggerLabel, merchant };
  };

  const selectedAlert = useMemo(() => alerts.find(a => a.id === selectedHistoryId), [selectedHistoryId, alerts]);
  const details = useMemo(() => selectedAlert ? getDerivedDetails(selectedAlert) : null, [selectedAlert, isAr]);

  if (!isOpen) return null;

  const periods: { id: FilterPeriod, label: string }[] = [
    { id: '7D', label: isAr ? 'آخر ٧ أيام' : 'Last 7D' },
    { id: 'MTD', label: isAr ? 'هذا الشهر' : 'MTD' },
    { id: 'QTD', label: isAr ? 'هذا الربع' : 'QTD' },
    { id: 'YTD', label: isAr ? 'هذه السنة' : 'YTD' },
    { id: 'ALL', label: isAr ? 'الكل' : 'All' },
    { id: 'SPECIFIC', label: isAr ? 'تاريخ محدد' : 'Specific' }
  ];

  const t = {
    title: isAr ? 'تنبيهات سابقة' : 'ALERTS HISTORY',
    status: isAr ? 'الحالة' : 'Status',
    date: isAr ? 'التاريخ' : 'Date',
    amount: isAr ? 'المبلغ' : 'Amount',
    type: isAr ? 'النوع' : 'Type',
    feedbackCard: isAr ? 'ملاحظات الحركة' : 'Feedback Card',
    detailsCard: isAr ? 'تفاصيل الحركة' : 'Transaction Details',
    merchant: isAr ? 'التاجر' : 'Merchant',
    trigger: isAr ? 'المحفز' : 'Trigger',
    account: isAr ? 'الحساب' : 'Account'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] overflow-hidden" onClick={onClose}>
      <div 
        className={`rounded-lg w-full max-w-5xl border shadow-2xl ${isDark ? 'bg-[#1e1e1e] border-[#555]' : 'bg-white border-gray-200'}`} 
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, maxHeight: '90vh', overflow: 'hidden' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div onMouseDown={onMouseDown} className="modal-header px-4 py-3 flex justify-between items-center cursor-move select-none rounded-t-lg" style={{ background: 'linear-gradient(to right, #002060 15%, #0037A4 50%, #002060 85%)' }}>
          <h3 className="text-white font-bold text-[14px] uppercase tracking-wider">{t.title}</h3>
          <button onClick={onClose} className="text-white hover:text-gray-300 outline-none"><X size={18} /></button>
        </div>

        <div className="p-6 flex flex-col gap-6 overflow-hidden h-[600px]">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className={`flex items-center gap-1 p-1 rounded-lg border ${isDark ? 'bg-white/5 border-[#555]' : 'bg-gray-50 border-gray-200'}`}>
              {periods.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setActiveFilter(p.id); setCurrentPage(1); }}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                    activeFilter === p.id 
                    ? 'bg-[#0056D2] text-white shadow-sm' 
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-[#0056D2]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            
            {activeFilter === 'SPECIFIC' && (
              <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  value={specificDate} 
                  onChange={(e) => { setSpecificDate(e.target.value); setCurrentPage(1); }}
                  className={`px-3 py-1 rounded border text-[10px] font-bold outline-none ${isDark ? 'bg-[#121212] border-[#555] text-[#00AEEF]' : 'bg-white border-gray-300 text-[#0056D2]'}`}
                />
              </div>
            )}
          </div>

          <div className="flex flex-1 gap-6 overflow-hidden">
            {/* Alerts List Table */}
            <div className={`flex-[1.5] flex flex-col border rounded-lg overflow-hidden ${isDark ? 'border-[#555]' : 'border-gray-100'}`}>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <table className="w-full text-left table-fixed border-collapse">
                  <thead className={`sticky top-0 z-10 border-b ${isDark ? 'bg-[#1e1e1e] border-[#555] text-gray-500' : 'bg-white border-gray-100 text-gray-400'} text-[10px] font-bold uppercase`}>
                    <tr>
                      <th className="px-4 py-2 w-[15%] text-center">{t.status}</th>
                      <th className={`px-2 py-2 w-[40%] ${isAr ? 'text-right' : 'text-left'}`}>{t.type}</th>
                      <th className="px-2 py-2 w-[25%]">{t.date}</th>
                      <th className="px-4 py-2 w-[20%] text-right">{t.amount}</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-[#333]' : 'divide-gray-50'}`}>
                    {paginatedAlerts.length > 0 ? paginatedAlerts.map(alert => (
                      <tr 
                        key={alert.id}
                        onClick={() => setSelectedHistoryId(alert.id)}
                        className={`cursor-pointer transition-colors ${
                          selectedHistoryId === alert.id 
                            ? 'bg-[#0056D2] text-white' 
                            : isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="py-3 text-center">
                          <div className={`mx-auto w-2.5 h-2.5 rounded-full ${
                            alert.status === AlertStatus.CONFIRMED_FRAUD ? 'bg-[#FF0000]' : 'bg-[#00CC00]'
                          }`} />
                        </td>
                        <td className={`px-2 py-3 text-[10px] font-bold truncate ${isAr ? 'text-right' : 'text-left'}`}>
                          {alert.type}
                        </td>
                        <td className="px-2 py-3 text-[10px] font-medium opacity-70">
                          {alert.date}
                        </td>
                        <td className="px-4 py-3 text-[10px] font-bold text-right">
                          {alert.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-gray-400 italic text-[10px]">
                          {isAr ? 'لا يوجد تنبيهات مطابقة' : 'No matching alerts found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className={`p-3 border-t flex items-center justify-between ${isDark ? 'border-[#555]' : 'border-gray-100'}`}>
                <span className="text-[9px] font-bold text-gray-400 uppercase">
                  {isAr ? 'صفحة' : 'Page'} {currentPage} {isAr ? 'من' : 'of'} {totalPages || 1}
                </span>
                <div className="flex gap-1">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="p-1 rounded border disabled:opacity-30"><ChevronLeft size={14} className="text-gray-400"/></button>
                  <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(currentPage + 1)} className="p-1 rounded border disabled:opacity-30"><ChevronRight size={14} className="text-gray-400"/></button>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
              {selectedAlert && details ? (
                <>
                  {/* Feedback Card */}
                  <div className={`p-4 border rounded-lg ${isDark ? 'bg-white/5 border-[#555]' : 'bg-blue-50/50 border-blue-100'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquareText size={16} className={isDark ? 'text-[#00AEEF]' : 'text-[#0056D2]'} />
                      <h4 className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#002060]'}`}>{t.feedbackCard}</h4>
                    </div>
                    <div className={`p-3 rounded border italic text-[10px] font-medium leading-relaxed ${isDark ? 'bg-[#121212] border-[#555] text-[#00AEEF]' : 'bg-white border-blue-100 text-[#0056D2]'}`}>
                      "{details.feedback}"
                    </div>
                  </div>

                  {/* Transaction Details Cards */}
                  <div className={`p-4 border rounded-lg flex-1 ${isDark ? 'bg-white/5 border-[#555]' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <div className="flex items-center gap-2 mb-4">
                      <ReceiptText size={16} className={isDark ? 'text-[#00AEEF]' : 'text-[#0056D2]'} />
                      <h4 className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#002060]'}`}>{t.detailsCard}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <DetailItem icon={Info} label={t.merchant} value={details.merchant} isDark={isDark} />
                      <DetailItem icon={FileText} label={t.account} value={`${details.accNo} (${details.accType})`} isDark={isDark} />
                      <DetailItem icon={Calendar} label={t.date} value={`${selectedAlert.date} ${selectedAlert.time}`} isDark={isDark} />
                      <DetailItem icon={Lightbulb} label={t.trigger} value={details.triggerLabel} isDark={isDark} highlight />
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 italic gap-2 opacity-50">
                  <Info size={32} strokeWidth={1} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{isAr ? 'اختر تنبيهاً لعرض التفاصيل' : 'Select an alert to view details'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon: Icon, label, value, isDark, highlight }: { icon: any, label: string, value: string, isDark: boolean, highlight?: boolean }) => (
  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}>
    <div className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg ${highlight ? (isDark ? 'bg-red-500/20 text-red-500' : 'bg-red-50 text-red-600') : (isDark ? 'bg-[#0056D2]/20 text-[#00AEEF]' : 'bg-blue-50 text-[#0056D2]')}`}>
      <Icon size={14} />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-gray-400 text-[8px] font-bold uppercase tracking-tight mb-0.5">{label}</span>
      <span className={`text-[10px] font-bold truncate ${highlight ? 'text-red-500' : (isDark ? 'text-gray-200' : 'text-[#0056D2]')}`}>{value}</span>
    </div>
  </div>
);

export default AlertsHistoryModal;
