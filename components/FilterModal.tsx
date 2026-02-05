import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, ChevronDown, Check, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export interface FilterCriteria {
  customerName: string;
  cif: string;
  date: string;
  time: string;
  statuses: string[];
  trnTypes: string[];
  countries: string[];
  source: string[];
  amountFrom: string;
  amountTo: string;
  currencies: string[];
}

const EMPTY_FILTERS: FilterCriteria = {
  customerName: '', cif: '', date: '', time: '', statuses: [], trnTypes: [], countries: [], source: [], amountFrom: '', amountTo: '', currencies: [],
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterCriteria) => void;
  initialFilters: FilterCriteria | null;
  availableCustomers: { name: string; cif: string }[];
  language: 'EN' | 'AR';
  theme: 'light' | 'dark';
}

const getBaseInputStyles = (isDark: boolean, hasValue: boolean, isAr: boolean) => {
  const stateColor = hasValue 
    ? (isDark ? 'text-[#00AEEF] font-bold' : 'text-[#0056D2] font-bold')
    : (isDark ? 'text-gray-500 font-normal' : 'text-blue-300 font-normal');

  const placeholderColor = isDark 
    ? 'placeholder:text-gray-500 placeholder:font-normal' 
    : 'placeholder:text-blue-300 placeholder:font-normal';

  const bgColor = isDark ? 'bg-[#121212] border-[#555]' : 'bg-white border-gray-300 focus:border-blue-500';
  const alignment = isAr ? 'text-right' : 'text-left';

  return `w-full border rounded px-2 py-1 text-[10px] h-7 outline-none transition-colors ${stateColor} ${placeholderColor} ${bgColor} ${alignment}`;
};

const translateType = (type: string, isAr: boolean) => {
  if (!isAr) return type;
  const types: Record<string, string> = {
    'Cash Withdrawal': 'سحب نقدي',
    'Online Purchase': 'شراء الكتروني',
    'Online Payment': 'دفع الكتروني',
    'Instant Transfer': 'تحويل فوري',
    'Direct Purchase': 'شراء مباشر'
  };
  return types[type] || type;
};

const translateCountry = (country: string, isAr: boolean) => {
  if (!isAr) return country;
  const countries: Record<string, string> = {
    'Jordan': 'الأردن', 'Saudi Arabia': 'السعودية', 'UAE': 'الإمارات',
    'Egypt': 'مصر', 'USA': 'الولايات المتحدة', 'Qatar': 'قطر',
    'Germany': 'ألمانيا', 'China': 'الصين'
  };
  return countries[country] || country;
};

const translateCurrency = (currency: string, isAr: boolean) => {
  if (!isAr) return currency;
  const currencies: Record<string, string> = {
    'JOD': 'دينار اردني', 'SAR': 'ريال سعودي', 'AED': 'درهم اماراتي',
    'USD': 'دولار امريكي', 'EGP': 'جنيه مصري', 'QAR': 'ريال قطري'
  };
  return currencies[currency] || currency;
};

const translateStatus = (status: string, isAr: boolean) => {
  if (!isAr) return status;
  const statuses: Record<string, string> = {
    'Pending Confirmation': 'بانتظار التأكيد',
    'Confirmed Fraud': 'احتيال مؤكد',
    'Confirmed Legitimate': 'حركة طبيعية'
  };
  return statuses[status] || status;
};

const translateSource = (source: string, isAr: boolean) => {
  if (!isAr) return source;
  const sources: Record<string, string> = {
    'AI': 'ذكاء اصطناعي',
    'RB': 'تعليمات معرفة',
    'IC': 'مكالمة واردة'
  };
  return sources[source] || source;
};

const translateName = (name: string, isAr: boolean) => {
  if (!isAr) return name;
  const mapping: Record<string, string> = {
    'Ayman': 'أيمن', 'Khalid': 'خالد', 'Al-Saadi': 'السعدي',
    'Fatima': 'فاطمة', 'Hassan': 'حسن', 'Al-Mansoori': 'المنصوري',
    'Omar': 'عمر', 'Zaid': 'زيد', 'Al-Fayez': 'الفايز',
    'Laila': 'ليلى', 'Mahmoud': 'محمود'
  };
  return name.split(' ').map(part => mapping[part] || part).join(' ');
};

const CustomDatePicker: React.FC<{
  value: string;
  onChange: (val: string) => void;
  isDark: boolean;
  isAr: boolean;
}> = ({ value, onChange, isDark, isAr }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewDate, setViewDate] = useState(new Date(2025, 8, 15));

  useEffect(() => {
    if (value) {
      const [d, m, y] = value.split('/').map(Number);
      if (!isNaN(d)) setViewDate(new Date(y, m - 1, d));
    }
  }, [value, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const monthData = useMemo(() => {
    const month = viewDate.getMonth();
    const year = viewDate.getFullYear();
    const days = [];
    const totalDays = daysInMonth(month, year);
    const startOffset = firstDayOfMonth(month, year);
    const prevMonthDays = daysInMonth(month - 1, year);
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, month: month - 1, year, current: false });
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, month, year, current: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, month: month + 1, year, current: false });
    }
    return days;
  }, [viewDate]);

  const monthName = viewDate.toLocaleString(isAr ? 'ar-JO' : 'en-US', { month: 'long' });
  const yearValue = viewDate.getFullYear();

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const selectDate = (d: number, m: number, y: number) => {
    const formatted = `${String(d).padStart(2, '0')}/${String(m + 1).padStart(2, '0')}/${y}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const isSelected = (d: number, m: number, y: number) => {
    if (!value) return false;
    const [vd, vm, vy] = value.split('/').map(Number);
    return vd === d && vm === (m + 1) && vy === y;
  };

  const bgColor = isDark ? 'bg-[#121212] border-[#555]' : 'bg-white border-gray-300';
  const textClass = !!value
    ? (isDark ? 'text-[#00AEEF] font-bold' : 'text-[#0056D2] font-bold')
    : (isDark ? 'text-gray-500 font-normal' : 'text-blue-300 font-normal');

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border rounded px-2 py-1 text-[10px] h-7 outline-none transition-colors cursor-pointer flex items-center justify-between ${bgColor}`}
      >
        <span className={textClass}>{value || 'DD/MM/YYYY'}</span>
        <Calendar size={12} className="text-gray-400" />
      </div>
      {isOpen && (
        <div className={`absolute z-[140] w-[210px] mt-1 border rounded-lg shadow-xl p-3 ${isDark ? 'bg-[#1e1e1e] border-[#555]' : 'bg-white border-gray-200'} ${isAr ? 'right-0' : 'left-0'}`}>
          <div className="flex items-center justify-between mb-4 px-1">
            <button type="button" onClick={handlePrevMonth} className={`p-1 rounded-md transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}><ChevronLeft size={14} /></button>
            <span className="text-[11px] font-bold text-[#0056D2] uppercase tracking-tighter">{monthName} {yearValue}</span>
            <button type="button" onClick={handleNextMonth} className={`p-1 rounded-md transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}><ChevronRight size={14} /></button>
          </div>
          <div className="grid grid-cols-7 gap-y-1 mb-1">
            {monthData.map((d, i) => (
              <div key={i} onClick={() => selectDate(d.day, d.month, d.year)} className={`text-center py-1 text-[10px] font-bold cursor-pointer rounded-md transition-all ${isSelected(d.day, d.month, d.year) ? 'bg-[#0056D2] text-white' : d.current ? `text-[#0056D2] ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}` : 'text-gray-400 opacity-40'}`}>{d.day}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CustomTimePicker: React.FC<{
  value: string;
  onChange: (val: string) => void;
  isDark: boolean;
  isAr: boolean;
}> = ({ value, onChange, isDark, isAr }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [h, m] = value ? value.split(':') : ['', ''];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const setTime = (hours: string, minutes: string) => {
    const hh = hours || (h || '00');
    const mm = minutes || (m || '00');
    onChange(`${hh.padStart(2, '0')}:${mm.padStart(2, '0')}`);
  };

  const bgColor = isDark ? 'bg-[#121212] border-[#555]' : 'bg-white border-gray-300';
  const textClass = !!value
    ? (isDark ? 'text-[#00AEEF] font-bold' : 'text-[#0056D2] font-bold')
    : (isDark ? 'text-gray-500 font-normal' : 'text-blue-300 font-normal');

  return (
    <div className="relative w-full" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className={`w-full border rounded px-2 py-1 text-[10px] h-7 outline-none transition-colors cursor-pointer flex items-center justify-between ${bgColor}`}>
        <span className={textClass}>{value || 'HH:MM'}</span>
        <Clock size={12} className="text-gray-400" />
      </div>
      {isOpen && (
        <div className={`absolute z-[140] w-[180px] mt-1 border rounded-lg shadow-xl p-3 ${isDark ? 'bg-[#1e1e1e] border-[#555]' : 'bg-white border-gray-200'} ${isAr ? 'right-0' : 'left-0'}`}>
          <button type="button" onClick={() => setIsOpen(false)} className="w-full mb-3 py-1 bg-[#0056D2] text-white rounded text-[9px] font-bold uppercase tracking-tight">{isAr ? 'تم' : 'Done'}</button>
          <div className="flex gap-2 h-40">
            <div className="flex-1 overflow-y-auto no-scrollbar border-r pr-1">
              {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map(opt => (
                <div key={opt} onClick={() => setTime(opt, m)} className={`text-center py-1 text-[10px] font-bold cursor-pointer rounded transition-all ${h === opt ? 'bg-[#0056D2] text-white' : isDark ? 'text-[#00AEEF] hover:bg-white/10' : 'text-[#0056D2] hover:bg-gray-50'}`}>{opt}</div>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar pl-1">
              {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map(opt => (
                <div key={opt} onClick={() => setTime(h, opt)} className={`text-center py-1 text-[10px] font-bold cursor-pointer rounded transition-all ${m === opt ? 'bg-[#0056D2] text-white' : isDark ? 'text-[#00AEEF] hover:bg-white/10' : 'text-[#0056D2] hover:bg-gray-50'}`}>{opt}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MultiSelect: React.FC<{
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  translate: (opt: string, isAr: boolean) => string;
  isDark: boolean;
  isAr: boolean;
}> = ({ label, options, selected, onChange, translate, isDark, isAr }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleOption = (opt: string) => {
    const next = selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt];
    onChange(next);
  };

  const bgColor = isDark ? 'bg-[#121212] border-[#555]' : 'bg-white border-gray-300';
  const textClass = selected.length > 0 
    ? (isDark ? 'text-[#00AEEF] font-bold' : 'text-[#0056D2] font-bold')
    : (isDark ? 'text-gray-500 font-normal' : 'text-blue-300 font-normal');

  return (
    <div className="relative" ref={containerRef}>
      <label className={`block mb-1 font-semibold text-gray-400 ${isAr ? 'text-[11px]' : 'text-[9px]'}`}>{label}</label>
      <div onClick={() => setIsOpen(!isOpen)} className={`w-full border rounded px-2 py-1 text-[10px] h-7 flex items-center justify-between cursor-pointer overflow-hidden ${bgColor}`}>
        <span className={`truncate mr-1 ${textClass}`}>{selected.length === 0 ? (isAr ? 'الكل' : 'All') : selected.map(s => translate(s, isAr)).join(', ')}</span>
        <ChevronDown size={14} className="text-gray-400 shrink-0" />
      </div>
      {isOpen && (
        <div className={`absolute z-[130] w-full mt-1 border rounded shadow-xl max-h-40 overflow-y-auto no-scrollbar ${isDark ? 'bg-[#1e1e1e] border-[#555]' : 'bg-white border-gray-200'}`}>
          {options.map(opt => (
            <div key={opt} onClick={() => toggleOption(opt)} className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer text-[10px] transition-colors ${isDark ? 'hover:bg-white/5 text-gray-200' : 'hover:bg-gray-50 text-[#002060]'}`}>
              <div className={`w-3 h-3 rounded border flex items-center justify-center shrink-0 ${selected.includes(opt) ? 'bg-[#0056D2] border-[#0056D2]' : (isDark ? 'border-[#555]' : 'border-gray-300')}`}>{selected.includes(opt) && <Check size={10} className="text-white" />}</div>
              <span className={selected.includes(opt) ? 'font-bold' : ''}>{translate(opt, isAr)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchableCombo: React.FC<{
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  isDark: boolean;
  isAr: boolean;
  translate?: (val: string, isAr: boolean) => string;
}> = ({ label, placeholder, value, options, onChange, isDark, isAr, translate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    if (!value) return [];
    const search = value.toLowerCase();
    return options.filter(opt => {
      const display = translate ? translate(opt, isAr) : opt;
      return display.toLowerCase().includes(search) || opt.toLowerCase().includes(search);
    }).slice(0, 8);
  }, [value, options, translate, isAr]);

  return (
    <div className="relative" ref={containerRef}>
      <label className={`block mb-1 font-semibold text-gray-400 ${isAr ? 'text-[11px]' : 'text-[9px]'}`}>{label}</label>
      <div className="relative">
        <input className={getBaseInputStyles(isDark, !!value, isAr)} placeholder={placeholder} value={value} onChange={(e) => { onChange(e.target.value); setIsOpen(true); }} onFocus={() => setIsOpen(true)} />
        <ChevronDown size={14} className={`absolute ${isAr ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer pointer-events-none`} />
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <div className={`absolute z-[120] w-full mt-1 border rounded shadow-xl max-h-40 overflow-y-auto no-scrollbar ${isDark ? 'bg-[#1e1e1e] border-[#555]' : 'bg-white border-gray-200'}`}>
          {filteredOptions.map((opt, i) => (
            <div key={i} onClick={() => { onChange(translate ? translate(opt, isAr) : opt); setIsOpen(false); }} className={`px-3 py-1.5 cursor-pointer text-[10px] font-bold transition-colors ${isDark ? 'hover:bg-white/5 text-[#00AEEF]' : 'hover:bg-gray-50 text-[#0056D2]'} ${isAr ? 'text-right' : 'text-left'}`}>{translate ? translate(opt, isAr) : opt}</div>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterModal: React.FC<Props> = ({ isOpen, onClose, onApply, initialFilters, availableCustomers, language, theme }) => {
  const isDark = theme === 'dark';
  const isAr = language === 'AR';

  const [filters, setFilters] = useState<FilterCriteria>(initialFilters || EMPTY_FILTERS);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setPos({ x: 0, y: 0 });
      setFilters(initialFilters || EMPTY_FILTERS);
    }
  }, [isOpen, initialFilters]);

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
    title: isAr ? 'فلترة قائمة التنبيهات' : 'Filter List of Alerts',
    apply: isAr ? 'تطبيق' : 'Apply',
    reset: isAr ? 'إعادة تعيين' : 'Reset',
    custName: isAr ? 'اسم العميل' : 'Customer Name',
    cif: isAr ? 'رقم العميل' : 'CIF No',
    date: isAr ? 'تاريخ التنبيه' : 'Alert Date',
    time: isAr ? 'وقت التنبيه' : 'Alert Time',
    status: isAr ? 'حالة التنبيه' : 'Alert Status',
    trnType: isAr ? 'نوع الحركة' : 'Trns Type',
    country: isAr ? 'البلد' : 'Init. Country',
    source: isAr ? 'المصدر' : 'Source',
    amountFrom: isAr ? 'أدنى مبلغ' : 'Min. Amount',
    amountTo: isAr ? 'أقصى مبلغ' : 'Max. Amount',
    currency: isAr ? 'عملة الحركة' : 'Trn Currency',
  };

  const handleApply = (e: React.FormEvent) => { e.preventDefault(); onApply(filters); onClose(); };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[100] overflow-hidden" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`rounded-lg w-[580px] border transition-colors duration-300 ${isDark ? 'bg-[#1e1e1e] border-[#555]' : 'bg-white border-gray-200'}`} style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, boxShadow: '0px 15px 15px -2px rgba(0, 0, 0, 0.50)', direction: isAr ? 'rtl' : 'ltr' }} onClick={(e) => e.stopPropagation()}>
        <div onMouseDown={onMouseDown} className="modal-drag-handle p-3 flex justify-between items-center cursor-move select-none rounded-t-lg" style={{ background: 'linear-gradient(to right, #002060 15%, #0037A4 50%, #002060 85%)' }}>
          <h3 className={`text-white font-bold ${isAr ? 'text-[14px]' : 'text-[12px]'} uppercase tracking-wider`}>{t.title}</h3>
          <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors cursor-pointer outline-none"><X size={16} /></button>
        </div>
        <form onSubmit={handleApply} className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1"><SearchableCombo label={t.cif} placeholder={isAr ? 'رقم العميل...' : 'CIF No...'} value={filters.cif} options={Array.from(new Set(availableCustomers.map(c => c.cif)))} onChange={(val) => setFilters({ ...filters, cif: val })} isDark={isDark} isAr={isAr} /></div>
            <div className="col-span-2"><SearchableCombo label={t.custName} placeholder={isAr ? 'بحث عن اسم...' : 'Search Name...'} value={filters.customerName} options={Array.from(new Set(availableCustomers.map(c => c.name)))} onChange={(val) => setFilters({ ...filters, customerName: val })} isDark={isDark} isAr={isAr} translate={translateName} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <MultiSelect label={t.trnType} options={['Cash Withdrawal', 'Online Purchase', 'Online Payment', 'Instant Transfer', 'Direct Purchase']} selected={filters.trnTypes} onChange={(s) => setFilters({ ...filters, trnTypes: s })} translate={translateType} isDark={isDark} isAr={isAr} />
            <div><label className={`block mb-1 font-semibold text-gray-400 ${isAr ? 'text-[11px]' : 'text-[9px]'}`}>{t.date}</label><CustomDatePicker value={filters.date} onChange={(val) => setFilters({ ...filters, date: val })} isDark={isDark} isAr={isAr} /></div>
            <div><label className={`block mb-1 font-semibold text-gray-400 ${isAr ? 'text-[11px]' : 'text-[9px]'}`}>{t.time}</label><CustomTimePicker value={filters.time} onChange={(val) => setFilters({ ...filters, time: val })} isDark={isDark} isAr={isAr} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <MultiSelect label={t.country} options={['Jordan', 'Saudi Arabia', 'UAE', 'Egypt', 'USA', 'Qatar', 'Germany', 'China']} selected={filters.countries} onChange={(s) => setFilters({ ...filters, countries: s })} translate={translateCountry} isDark={isDark} isAr={isAr} />
            <MultiSelect label={t.source} options={['AI', 'RB', 'IC']} selected={filters.source} onChange={(s) => setFilters({ ...filters, source: s })} translate={translateSource} isDark={isDark} isAr={isAr} />
            <MultiSelect label={t.status} options={['Pending Confirmation', 'Confirmed Fraud', 'Confirmed Legitimate']} selected={filters.statuses} onChange={(s) => setFilters({ ...filters, statuses: s })} translate={translateStatus} isDark={isDark} isAr={isAr} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={`block mb-1 font-semibold text-gray-400 ${isAr ? 'text-[11px]' : 'text-[9px]'}`}>{t.amountFrom}</label><input className={getBaseInputStyles(isDark, !!filters.amountFrom, isAr)} placeholder="0.00" value={filters.amountFrom} onChange={(e) => setFilters({ ...filters, amountFrom: e.target.value })} /></div>
            <div><label className={`block mb-1 font-semibold text-gray-400 ${isAr ? 'text-[11px]' : 'text-[9px]'}`}>{t.amountTo}</label><input className={getBaseInputStyles(isDark, !!filters.amountTo, isAr)} placeholder="99,999.00" value={filters.amountTo} onChange={(e) => setFilters({ ...filters, amountTo: e.target.value })} /></div>
            <MultiSelect label={t.currency} options={['JOD', 'SAR', 'AED', 'USD', 'EGP', 'QAR']} selected={filters.currencies} onChange={(s) => setFilters({ ...filters, currencies: s })} translate={translateCurrency} isDark={isDark} isAr={isAr} />
          </div>
          <div className={`pt-4 flex justify-end gap-3 border-t mt-2 ${isDark ? 'border-[#555]' : 'border-gray-100'}`}>
            <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className={`px-5 py-1.5 rounded text-[10px] font-bold border transition-colors uppercase tracking-tight ${isDark ? 'border-[#555] text-gray-400 hover:bg-white/5' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>{t.reset}</button>
            <button type="submit" className="px-9 py-1.5 rounded text-[10px] font-bold bg-[#0056D2] text-white hover:bg-blue-700 transition-colors uppercase shadow-sm tracking-tight">{t.apply}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterModal;