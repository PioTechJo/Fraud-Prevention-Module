
import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check, Search } from 'lucide-react';

export interface FilterCriteria {
  customerName: string;
  date: string;
  time: string;
  statuses: string[];
  trnTypes: string[];
  countries: string[];
  source: string;
  amountFrom: string;
  amountTo: string;
  currencies: string[];
}

const EMPTY_FILTERS: FilterCriteria = {
  customerName: '',
  date: '',
  time: '',
  statuses: [],
  trnTypes: [],
  countries: [],
  source: '',
  amountFrom: '',
  amountTo: '',
  currencies: [],
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterCriteria) => void;
  initialFilters: FilterCriteria | null;
  availableCustomers: { name: string; cif: string }[];
}

const MultiSelect: React.FC<{
  label: string;
  options: string[];
  selected: string[];
  onChange: (vals: string[]) => void;
  searchable?: boolean;
}> = ({ label, options, selected, onChange, searchable = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(i => i !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  const filteredOptions = options.filter(o => 
    o.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-[9px] font-semibold text-gray-400 mb-1 block">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 rounded px-2 py-1 text-[10px] bg-white h-7 flex items-center justify-between focus:border-blue-500 outline-none"
      >
        <span className={`truncate pr-2 ${selected.length === 0 ? 'text-blue-300 font-normal' : 'text-[#0056D2] font-semibold'}`}>
          {selected.length === 0 ? 'Select...' : selected.join(', ')}
        </span>
        <ChevronDown size={12.5} className="text-gray-400 transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-48 overflow-y-auto no-scrollbar scroll-grid">
          {searchable && (
            <div className="sticky top-0 bg-white p-2 border-b border-gray-100 flex items-center gap-2">
              <Search size={10} className="text-gray-400" />
              <input 
                type="text" 
                className="w-full text-[10px] text-[#0056D2] outline-none placeholder-blue-300" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          {filteredOptions.map(opt => (
            <div 
              key={opt}
              onClick={() => toggleOption(opt)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer text-[10px] text-gray-700"
            >
              <div className={`w-3 h-3 rounded border flex items-center justify-center ${selected.includes(opt) ? 'bg-[#0056D2] border-[#0056D2]' : 'border-gray-300'}`}>
                {selected.includes(opt) && <Check size={8} className="text-white" />}
              </div>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchableSingleInput: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { name: string; cif: string }[];
}> = ({ label, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(o => {
    const searchVal = value.toLowerCase().trim();
    if (!searchVal) return true;
    
    // If the value contains a " - ", it means an item was selected.
    // We allow re-searching by ignoring the CIF part if the user is typing again.
    const parts = searchVal.split(' - ');
    const term = parts[0].trim();
    
    return o.name.toLowerCase().includes(term) || o.cif.toLowerCase().includes(term);
  });

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-[9px] font-semibold text-gray-400 mb-1 block">{label}</label>
      <input 
        type="text" 
        className="w-full border border-gray-300 rounded px-2 py-1 text-[10px] text-[#0056D2] font-semibold focus:border-blue-500 outline-none h-7 bg-white placeholder-blue-300 placeholder:font-normal"
        placeholder="Enter name or cif..."
        value={value}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
      />
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-[250px] overflow-y-auto no-scrollbar scroll-grid">
          {filteredOptions.map((opt, i) => (
            <div 
              key={i}
              onClick={() => {
                onChange(`${opt.name} - ${opt.cif}`);
                setIsOpen(false);
              }}
              className={`px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
            >
              <div className="min-w-0">
                {/* Visuals match the grid cell: Name bold, CIF gray below */}
                <div className="text-[9px] font-semibold text-[#001D4A] truncate">{opt.name}</div>
                <div className="text-[8px] text-gray-400">{opt.cif}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterModal: React.FC<Props> = ({ isOpen, onClose, onApply, initialFilters, availableCustomers }) => {
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
    setDragging(true);
    dragStartPos.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
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

  if (!isOpen) return null;

  const trnTypes = ['Cash Withdrawal', 'Direct Purchase', 'Online Purchase', 'Instant Transfer'];
  const currencies = ['JOD', 'SAR', 'AED', 'USD', 'EGP', 'QAR', 'KWD', 'BHD', 'OMR'];
  const statuses = ['Pending Confirmation', 'Confirmed Fraud', 'Confirmed Legitimate'];
  const countryList = [
    'Algeria', 'Bahrain', 'Comoros', 'Djibouti', 'Egypt', 'Iraq', 'Jordan', 'Kuwait', 'Lebanon', 'Libya', 'Mauritania', 'Morocco', 'Oman', 'Palestine', 'Qatar', 'Saudi Arabia', 'Somalia', 'Sudan', 'Syria', 'Tunisia', 'United Arab Emirates', 'Yemen'
  ].sort();

  const formatAmountInput = (val: string) => {
    const cleanValue = val.replace(/[^0-9.]/g, '');
    const parts = cleanValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (parts[1]) {
      parts[1] = parts[1].slice(0, 2);
    }
    return parts.length > 1 ? `${parts[0]}.${parts[1]}` : parts[0];
  };

  const handleAmountChange = (key: 'amountFrom' | 'amountTo', value: string) => {
    const formatted = formatAmountInput(value);
    setFilters(prev => ({ ...prev, [key]: formatted }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    onApply(EMPTY_FILTERS);
  };

  const inputClass = "w-full border border-gray-300 rounded px-2 py-1 text-[10px] text-[#0056D2] font-semibold focus:border-blue-500 outline-none h-7 bg-white placeholder-blue-300 placeholder:font-normal";
  const labelClass = "text-[9px] font-semibold text-gray-400 mb-1 block";

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 pointer-events-none overflow-hidden">
      <div 
        className="bg-white rounded-lg w-full max-w-2xl border border-gray-200 pointer-events-auto"
        style={{ 
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          boxShadow: '0px 15px 15px -2px rgba(0, 0, 0, 0.50)'
        }}
      >
        <div 
          onMouseDown={onMouseDown}
          className="bg-[#001D4A] p-3 flex justify-between items-center cursor-move select-none rounded-t-lg"
        >
          <h3 className="text-white font-bold text-[12px] uppercase tracking-wider">Filter List of Alerts</h3>
          <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-x-6 gap-y-4">
            <div className="col-span-3">
              <SearchableSingleInput 
                label="Customer Name / CIF No"
                value={filters.customerName}
                onChange={(val) => setFilters({ ...filters, customerName: val })}
                options={availableCustomers}
              />
            </div>

            <div>
              <label className={labelClass}>Alert Date</label>
              <input 
                type="date" 
                className={`${inputClass} ${!filters.date ? 'text-blue-300 font-normal' : 'text-[#0056D2] font-semibold'}`}
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              />
            </div>

            <div>
              <label className={labelClass}>Alert Time</label>
              <input 
                type="time" 
                className={`${inputClass} ${!filters.time ? 'text-blue-300 font-normal' : 'text-[#0056D2] font-semibold'}`}
                value={filters.time}
                onChange={(e) => setFilters({ ...filters, time: e.target.value })}
              />
            </div>

            <MultiSelect 
              label="Alert Status"
              options={statuses}
              selected={filters.statuses}
              onChange={(vals) => setFilters({ ...filters, statuses: vals })}
            />

            <MultiSelect 
              label="Trn Type"
              options={trnTypes}
              selected={filters.trnTypes}
              onChange={(vals) => setFilters({ ...filters, trnTypes: vals })}
            />

            <MultiSelect 
              label="Init. Country"
              options={countryList}
              selected={filters.countries}
              onChange={(vals) => setFilters({ ...filters, countries: vals })}
              searchable={true}
            />

            <MultiSelect 
              label="Trn Currency"
              options={currencies}
              selected={filters.currencies}
              onChange={(vals) => setFilters({ ...filters, currencies: vals })}
            />

            <div>
              <label className={labelClass}>Min. Amount</label>
              <input 
                type="text" 
                className={inputClass}
                placeholder="Enter..."
                value={filters.amountFrom}
                onChange={(e) => handleAmountChange('amountFrom', e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Max. Amount</label>
              <input 
                type="text" 
                className={inputClass}
                placeholder="Enter..."
                value={filters.amountTo}
                onChange={(e) => handleAmountChange('amountTo', e.target.value)}
              />
            </div>

            <div className="relative">
              <label className={labelClass}>Alert Source</label>
              <div className="relative">
                <select 
                  className={`${inputClass} appearance-none pr-8 ${filters.source === '' ? 'text-blue-300 font-normal' : 'text-[#0056D2] font-semibold'}`}
                  value={filters.source}
                  onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                >
                  <option value="" className="text-blue-300 font-normal">Select...</option>
                  <option value="AI" className="text-[#0056D2] font-semibold">AI Based</option>
                  <option value="RB" className="text-[#0056D2] font-semibold">RB Based</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown size={12.5} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 mt-4">
            <button 
              type="button"
              onClick={handleReset}
              className="px-5 py-1.5 rounded text-[10px] font-bold border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors uppercase tracking-tight"
            >
              Reset
            </button>
            <button 
              type="submit"
              className="px-9 py-1.5 rounded text-[10px] font-bold bg-[#0056D2] text-white hover:bg-blue-700 transition-colors uppercase shadow-sm tracking-tight"
            >
              Apply Filter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterModal;
