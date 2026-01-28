import React, { useState, useMemo } from 'react';
import { Filter, ArrowUpDown, RotateCcw } from 'lucide-react';
import { Alert, AlertStatus } from '../types';
import SummaryStats from './SummaryStats';
import FilterModal, { FilterCriteria } from './FilterModal';
import SortModal, { SortCriteria } from './SortModal';

interface Props {
  alerts: Alert[];
  displayAlerts: Alert[];
  selectedId: string;
  onSelect: (alert: Alert) => void;
  filterCriteria: FilterCriteria | null;
  setFilterCriteria: (f: FilterCriteria | null) => void;
  sortCriteriaList: SortCriteria[];
  setSortCriteriaList: (s: SortCriteria[]) => void;
}

const AlertsList: React.FC<Props> = ({ 
  alerts, 
  displayAlerts, 
  selectedId, 
  onSelect,
  filterCriteria,
  setFilterCriteria,
  sortCriteriaList,
  setSortCriteriaList
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const availableCustomers = useMemo(() => {
    const seenCifs = new Set();
    const unique = [];
    for (const alert of alerts) {
      if (!seenCifs.has(alert.cif)) {
        seenCifs.add(alert.cif);
        unique.push({ name: alert.customerName, cif: alert.cif });
      }
    }
    return unique.sort((a, b) => a.name.localeCompare(b.name));
  }, [alerts]);

  const handleReset = () => {
    setFilterCriteria(null);
    setSortCriteriaList([
      { attribute: 'Alert Status', order: 'Descending' },
      { attribute: 'Date / Time', order: 'Ascending' },
      { attribute: 'None', order: 'Ascending' },
      { attribute: 'None', order: 'Ascending' },
      { attribute: 'None', order: 'Ascending' },
    ]);
  };

  const isSortActive = useMemo(() => {
    const isDefault = 
      sortCriteriaList[0].attribute === 'Alert Status' && 
      sortCriteriaList[0].order === 'Descending' &&
      sortCriteriaList[1].attribute === 'Date / Time' && 
      sortCriteriaList[1].order === 'Ascending' &&
      sortCriteriaList.slice(2).every(s => s.attribute === 'None');
    return !isDefault;
  }, [sortCriteriaList]);

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      <div className="p-6 flex justify-between items-center border-b border-gray-100">
        <h2 className="text-[#001D4A] font-bold text-[15px] uppercase tracking-tight">List of Alerts</h2>
        <div className="flex gap-6 text-gray-500 text-[9px] font-medium items-center">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className={`flex items-center gap-1 hover:text-[#0056D2] transition-colors ${filterCriteria ? 'text-[#0056D2] font-bold' : ''}`}
          >
            <Filter size={12} /> Filter
          </button>
          <button 
            onClick={() => setIsSortOpen(true)}
            className={`flex items-center gap-1 hover:text-[#0056D2] transition-colors ${isSortActive ? 'text-[#0056D2] font-bold' : ''}`}
          >
            <ArrowUpDown size={12} /> Sort
          </button>
          <button 
            onClick={handleReset}
            className="flex items-center gap-1 hover:text-[#0056D2] transition-colors"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* Centered internal width by using px-7 (increased width by 0.5 total units compared to px-8) */}
      <div className="px-7 py-5">
        <SummaryStats alerts={displayAlerts} />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar scroll-grid mt-3 px-7">
        <table className="w-full text-left text-[11px] table-fixed">
          <thead className="sticky top-0 bg-white border-b border-gray-100 text-gray-400 font-semibold text-[11px] z-10">
            <tr className="whitespace-nowrap">
              <th className="py-3 font-medium w-[5%] text-center">Sts</th>
              <th className="px-2 py-3 font-medium w-[34%]">Customer Name / CIF</th>
              <th className="px-6 py-3 font-medium w-[15%]">Date / Time</th>
              <th className="px-6 py-3 font-medium w-[19%]">Trn Type / Country</th>
              <th className="px-6 py-3 font-medium w-[18%]">Amount / Currency</th>
              <th className="px-6 py-3 font-medium w-[9%]">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {displayAlerts.length > 0 ? (
              displayAlerts.map((alert) => (
                <tr 
                  key={alert.id}
                  onClick={() => onSelect(alert)}
                  className={`cursor-pointer transition-colors group ${
                    selectedId === alert.id ? 'bg-[#0056D2] text-white' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="py-2 text-center">
                    <div className={`mx-auto w-2.5 h-2.5 rounded-full shrink-0 ${
                      alert.status === AlertStatus.CONFIRMED_FRAUD ? 'bg-[#FF0000]' :
                      alert.status === AlertStatus.CONFIRMED_LEGITIMATE ? 'bg-[#00CC00]' :
                      'bg-[#00AEEF]'
                    }`} />
                  </td>
                  <td className="px-2 py-2 truncate">
                    <div className="min-w-0">
                      <div className={`text-[11px] font-semibold truncate ${selectedId === alert.id ? 'text-white' : 'text-[#001D4A]'}`}>
                        {alert.customerName}
                      </div>
                      <div className={`text-[10px] ${selectedId === alert.id ? 'text-blue-100' : 'text-gray-400'}`}>
                        {alert.cif}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    <div className={`text-[11px] font-medium ${selectedId === alert.id ? 'text-white' : 'text-[#001D4A]'}`}>
                      {alert.date}
                    </div>
                    <div className={`text-[10px] ${selectedId === alert.id ? 'text-blue-100' : 'text-gray-400'}`}>
                      {alert.time}
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    <div className={`text-[11px] font-medium truncate ${selectedId === alert.id ? 'text-white' : 'text-[#001D4A]'}`}>
                      {alert.type}
                    </div>
                    <div className={`text-[10px] truncate ${selectedId === alert.id ? 'text-blue-100' : 'text-gray-400'}`}>
                      {alert.country}
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    <div className={`text-[11px] font-semibold ${selectedId === alert.id ? 'text-white' : 'text-[#001D4A]'}`}>
                      {alert.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`text-[10px] ${selectedId === alert.id ? 'text-blue-100' : 'text-gray-400'}`}>
                      {alert.currency}
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                      selectedId === alert.id ? 'bg-white/20' : 'text-blue-600'
                    }`}>
                      {alert.source}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic text-[11px]">
                  No alerts match your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with white background and height of 11 */}
      <div className="h-11 w-full bg-white border-t border-gray-100 shrink-0" />

      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApply={setFilterCriteria}
        initialFilters={filterCriteria}
        availableCustomers={availableCustomers}
      />

      <SortModal 
        isOpen={isSortOpen} 
        onClose={() => setIsSortOpen(false)} 
        onApply={setSortCriteriaList}
        initialSorts={sortCriteriaList}
      />
    </div>
  );
};

export default AlertsList;