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
}

const SortModal: React.FC<Props> = ({ isOpen, onClose, onApply, initialSorts }) => {
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

  const sortAttributes = [
    'None',
    'Alert Status',
    'Customer Name',
    'CIF No',
    'Date / Time',
    'Transaction Type',
    'Country',
    'Transaction Amount',
    'Currency Code',
    'Alert Source'
  ];

  const updateSort = (index: number, updates: Partial<SortCriteria>) => {
    const newSorts = [...sorts];
    newSorts[index] = { ...newSorts[index], ...updates };
    setSorts(newSorts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(sorts);
    onClose();
  };

  const handleReset = () => {
    setSorts(defaultSorts);
  };

  const inputClass = "w-full border border-gray-300 rounded px-3 py-1 text-[10px] text-[#0056D2] font-semibold focus:border-blue-500 outline-none h-8 bg-white appearance-none pr-8 cursor-pointer";
  const btnBaseClass = "w-7 h-6 flex items-center justify-center transition-all relative group border rounded";

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 pointer-events-none overflow-hidden">
      <div 
        className="bg-white rounded-lg w-[440px] border border-gray-200 pointer-events-auto"
        style={{ 
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          boxShadow: '0px 15px 15px -2px rgba(0, 0, 0, 0.50)'
        }}
      >
        <div 
          onMouseDown={onMouseDown}
          className="bg-[#001D4A] p-3 flex justify-between items-center cursor-move select-none rounded-t-lg"
        >
          <h3 className="text-white font-bold text-[12px] uppercase tracking-wider">Sort List of Alerts</h3>
          <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {sorts.map((sort, index) => (
            <div key={index} className="flex items-center gap-3">
              <label className="text-[9px] font-bold text-gray-400 w-14 shrink-0">
                {index === 0 ? 'Sort By' : 'Then By'}
              </label>
              <div className="flex items-center gap-1.5 flex-1">
                {/* Attribute Dropdown */}
                <div className="relative flex-1">
                  <select 
                    className={inputClass}
                    value={sort.attribute}
                    onChange={(e) => updateSort(index, { attribute: e.target.value })}
                  >
                    {sortAttributes.map(attr => (
                      <option key={attr} value={attr}>{attr}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>

                {/* Button Group Container with Gap */}
                <div className="flex gap-1 shrink-0">
                  {/* Ascending Order Button */}
                  <button
                    type="button"
                    disabled={sort.attribute === 'None'}
                    onClick={() => updateSort(index, { order: 'Ascending' })}
                    className={`${btnBaseClass} ${sort.attribute === 'None' ? 'opacity-30 cursor-not-allowed border-gray-200' : 'border-gray-300'} ${sort.order === 'Ascending' && sort.attribute !== 'None' ? 'bg-[#0056D2] text-white border-[#0056D2] z-10' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
                  >
                    <ChevronsUp size={12} />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-[#FFFBEB] text-[#001D4A] text-[8px] font-bold px-2 py-0.5 rounded border border-yellow-200 shadow-sm whitespace-nowrap z-20">
                      Ascending Order
                    </div>
                  </button>

                  {/* Descending Order Button */}
                  <button
                    type="button"
                    disabled={sort.attribute === 'None'}
                    onClick={() => updateSort(index, { order: 'Descending' })}
                    className={`${btnBaseClass} ${sort.attribute === 'None' ? 'opacity-30 cursor-not-allowed border-gray-200' : 'border-gray-300'} ${sort.order === 'Descending' && sort.attribute !== 'None' ? 'bg-[#0056D2] text-white border-[#0056D2] z-10' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
                  >
                    <ChevronsDown size={12} />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-[#FFFBEB] text-[#001D4A] text-[8px] font-bold px-2 py-0.5 rounded border border-yellow-200 shadow-sm whitespace-nowrap z-20">
                      Descending Order
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-2">
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
              Sort
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SortModal;