import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, ChevronsUp, ChevronsDown } from 'lucide-react';

export interface SortCriteria {
  attribute: string;
  order: 'Ascending' | 'Descending';
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (sorts: SortCriteria[]) => void;
  initialSorts?: SortCriteria[];
  language: 'EN' | 'AR';
  theme: 'light' | 'dark';
}

const SortModal: React.FC<Props> = ({ isOpen, onClose, onApply, initialSorts, language, theme }) => {
  const isDark = theme === 'dark';
  const isAr = language === 'AR';

  const defaultSorts: SortCriteria[] = [
    { attribute: 'Alert Status', order: 'Descending' },
    { attribute: 'Date / Time', order: 'Ascending' },
    { attribute: 'None', order: 'Ascending' },
    { attribute: 'None', order: 'Ascending' },
    { attribute: 'None', order: 'Ascending' },
  ];

  const [sorts, setSorts] = useState<SortCriteria[]>(initialSorts || defaultSorts);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) { 
      setPos({ x: 0, y: 0 }); 
      if (initialSorts) setSorts(initialSorts); 
    }
  }, [isOpen, initialSorts]);

  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.modal-drag-handle')) {
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

  if (!isOpen) return null;

  const t = {
    title: isAr ? 'ترتيب قائمة التنبيهات' : 'Sort List of Alerts',
    sortBy: isAr ? 'ترتيب حسب' : 'Sort By',
    thenBy: isAr ? 'ثم حسب' : 'Then By',
    reset: isAr ? 'إعادة تعيين' : 'Reset',
    sort: isAr ? 'ترتيب' : 'Sort'
  };

  const attributeMap: Record<string, string> = {
    'None': isAr ? 'لا يوجد' : 'None',
    'Alert Status': isAr ? 'حالة التنبيه' : 'Alert Status',
    'Customer Name': isAr ? 'اسم العميل' : 'Customer Name',
    'CIF No': isAr ? 'رقم الملف' : 'CIF No',
    'Date / Time': isAr ? 'التاريخ / الوقت' : 'Date / Time',
    'Transaction Type': isAr ? 'نوع الحركة' : 'Transaction Type',
    'Country': isAr ? 'البلد' : 'Country',
    'Transaction Amount': isAr ? 'مبلغ الحركة' : 'Transaction Amount',
    'Currency Code': isAr ? 'رمز العملة' : 'Currency Code',
    'Alert Source': isAr ? 'مصدر التنبيه' : 'Alert Source'
  };

  const sortAttributes = Object.keys(attributeMap);

  const updateSort = (index: number, updates: Partial<SortCriteria>) => {
    const newSorts = [...sorts];
    newSorts[index] = { ...newSorts[index], ...updates };
    setSorts(newSorts);
  };

  const inputClass = `w-full border rounded px-3 py-1 text-[10px] h-8 transition-colors outline-none appearance-none font-semibold ${isAr ? 'pl-8 pr-3' : 'pr-8 pl-3'} cursor-pointer ${isDark ? 'bg-[#121212] border-[#555] text-white' : 'bg-white border-gray-300 text-[#0056D2] focus:border-blue-500'}`;
  const btnBaseClass = "w-7 h-6 flex items-center justify-center transition-all relative group border rounded";

  return (
    <div 
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-[100] overflow-hidden"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className={`rounded-lg w-[440px] border transition-colors duration-300 ${isDark ? 'bg-[#1e1e1e] border-[#555]' : 'bg-white border-gray-200'}`} 
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, boxShadow: '0px 15px 15px -2px rgba(0, 0, 0, 0.50)', direction: isAr ? 'rtl' : 'ltr' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          onMouseDown={onMouseDown} 
          className="modal-drag-handle p-3 flex justify-between items-center cursor-move select-none rounded-t-lg"
          style={{ background: 'linear-gradient(to right, #002060 15%, #0037A4 50%, #002060 85%)' }}
        >
          <h3 className={`text-white font-bold ${isAr ? 'text-[14px]' : 'text-[12px]'} uppercase tracking-wider`}>{t.title}</h3>
          <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors cursor-pointer outline-none"><X size={16} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onApply(sorts); onClose(); }} className="p-5 space-y-4">
          {sorts.map((sort, index) => (
            <div key={index} className="flex items-center gap-3">
              <label className={`${isAr ? 'text-[11px]' : 'text-[9px]'} font-semibold text-gray-400 w-20 shrink-0`}>{index === 0 ? t.sortBy : t.thenBy}</label>
              <div className="flex items-center gap-1.5 flex-1">
                <div className="relative flex-1">
                  <select className={inputClass} value={sort.attribute} onChange={(e) => updateSort(index, { attribute: e.target.value })}>
                    {sortAttributes.map(attr => (<option key={attr} value={attr} className="font-semibold">{attributeMap[attr]}</option>))}
                  </select>
                  <div className={`absolute inset-y-0 ${isAr ? 'left-0 pl-2' : 'right-0 pr-2'} flex items-center pointer-events-none`}><ChevronDown size={14} className="text-gray-400" /></div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button type="button" disabled={sort.attribute === 'None'} onClick={() => updateSort(index, { order: 'Ascending' })} className={`${btnBaseClass} ${sort.attribute === 'None' ? 'opacity-30 border-gray-200' : (isDark ? 'border-[#555]' : 'border-gray-300')} ${sort.order === 'Ascending' && sort.attribute !== 'None' ? `bg-[#0056D2] text-white border-[#0056D2] z-10` : (isDark ? 'bg-transparent text-gray-400' : 'bg-white text-gray-400 hover:bg-gray-50')}`}><ChevronsUp size={12} /></button>
                  <button type="button" disabled={sort.attribute === 'None'} onClick={() => updateSort(index, { order: 'Descending' })} className={`${btnBaseClass} ${sort.attribute === 'None' ? 'opacity-30 border-gray-200' : (isDark ? 'border-[#555]' : 'border-gray-300')} ${sort.order === 'Descending' && sort.attribute !== 'None' ? `bg-[#0056D2] text-white border-[#0056D2] z-10` : (isDark ? 'bg-transparent text-gray-400' : 'bg-white text-gray-400 hover:bg-gray-50')}`}><ChevronsDown size={12} /></button>
                </div>
              </div>
            </div>
          ))}
          <div className={`pt-4 flex justify-end gap-3 border-t mt-2 ${isDark ? 'border-[#555]' : 'border-gray-100'}`}>
            <button type="button" onClick={() => setSorts(defaultSorts)} className={`px-5 py-1.5 rounded text-[10px] font-bold border transition-colors uppercase tracking-tight ${isDark ? 'border-[#555] text-gray-400 hover:bg-white/5' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>{t.reset}</button>
            <button type="submit" className="px-9 py-1.5 rounded text-[10px] font-bold bg-[#0056D2] text-white hover:bg-blue-700 transition-colors uppercase shadow-sm tracking-tight">{t.sort}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SortModal;