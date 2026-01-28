
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AlertsList from './components/AlertsList';
import TransactionDetails from './components/TransactionDetails';
import AlertsMonthlyChart from './components/AlertsMonthlyChart';
import { MOCK_ALERTS } from './constants';
import { Alert, AlertStatus } from './types';
import { FilterCriteria } from './components/FilterModal';
import { SortCriteria } from './components/SortModal';
import { Settings, BarChart3, TrendingUp, AlertCircle, FileText, SlidersHorizontal, Zap, ShieldCheck, Mail, ChevronDown, Plus, Edit2, Trash2, Power } from 'lucide-react';

const App: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [selectedAlertId, setSelectedAlertId] = useState<string>('');
  const [userHasSelectedManually, setUserHasSelectedManually] = useState(false);
  
  // Default tab set to alerts (Home)
  const [activeTab, setActiveTab] = useState<string>('alerts');
  
  // Sub-navigation for Alerts Analytics
  const [activeSubPage, setActiveSubPage] = useState<string>('page1');

  // Sub-navigation for Business Attributes
  const [activeBusinessSubPage, setActiveBusinessSubPage] = useState<string>('rules');
  
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria | null>(null);
  const [sortCriteriaList, setSortCriteriaList] = useState<SortCriteria[]>([
    { attribute: 'Alert Status', order: 'Descending' },
    { attribute: 'Date / Time', order: 'Ascending' },
    { attribute: 'None', order: 'Ascending' },
    { attribute: 'None', order: 'Ascending' },
    { attribute: 'None', order: 'Ascending' },
  ]);

  const displayAlerts = useMemo(() => {
    let result = [...alerts];
    if (filterCriteria) {
      result = result.filter(alert => {
        const searchLower = filterCriteria.customerName.toLowerCase();
        const matchName = !filterCriteria.customerName || 
          (alert.customerName.toLowerCase().includes(searchLower) || 
           alert.cif.toLowerCase().includes(searchLower));
        
        let matchDate = true;
        if (filterCriteria.date) {
          const [year, month, day] = filterCriteria.date.split('-');
          const formattedFilterDate = `${day}/${month}/${year}`;
          matchDate = alert.date === formattedFilterDate;
        }

        const matchTime = !filterCriteria.time || alert.time.startsWith(filterCriteria.time);
        const matchStatus = filterCriteria.statuses.length === 0 || 
          filterCriteria.statuses.some(s => {
            if (s === 'Pending Confirmation') return alert.status === AlertStatus.PENDING;
            if (s === 'Confirmed Fraud') return alert.status === AlertStatus.CONFIRMED_FRAUD;
            if (s === 'Confirmed Legitimate') return alert.status === AlertStatus.CONFIRMED_LEGITIMATE;
            return false;
          });

        const matchType = filterCriteria.trnTypes.length === 0 || filterCriteria.trnTypes.includes(alert.type);
        const matchCountry = filterCriteria.countries.length === 0 || filterCriteria.countries.includes(alert.country);
        const matchCurrency = filterCriteria.currencies.length === 0 || filterCriteria.currencies.includes(alert.currency);
        const matchSource = !filterCriteria.source || 
          (filterCriteria.source === 'AI' && alert.source === 'AI') || 
          (filterCriteria.source === 'RB' && alert.source === 'RB');

        const cleanAmtFrom = filterCriteria.amountFrom.replace(/,/g, '');
        const cleanAmtTo = filterCriteria.amountTo.replace(/,/g, '');
        const amtFrom = cleanAmtFrom ? parseFloat(cleanAmtFrom) : -Infinity;
        const amtTo = cleanAmtTo ? parseFloat(cleanAmtTo) : Infinity;
        const matchAmount = alert.amount >= amtFrom && alert.amount <= amtTo;

        return matchName && matchDate && matchTime && matchStatus && matchType && matchCountry && matchSource && matchCurrency && matchAmount;
      });
    }

    result.sort((a, b) => {
      for (const criteria of sortCriteriaList) {
        if (criteria.attribute === 'None') continue;
        let valA: any = '';
        let valB: any = '';
        switch (criteria.attribute) {
          case 'Alert Status': valA = a.status; valB = b.status; break;
          case 'Customer Name': valA = a.customerName.toLowerCase(); valB = b.customerName.toLowerCase(); break;
          case 'CIF No': valA = a.cif; valB = b.cif; break;
          case 'Date / Time':
            const [dA, mA, yA] = a.date.split('/');
            const [dB, mB, yB] = b.date.split('/');
            valA = `${yA}-${mA}-${dA} ${a.time}`;
            valB = `${yB}-${mB}-${dB} ${b.time}`;
            break;
          case 'Transaction Type': valA = a.type.toLowerCase(); valB = b.type.toLowerCase(); break;
          case 'Country': valA = a.country.toLowerCase(); valB = b.country.toLowerCase(); break;
          case 'Transaction Amount': valA = a.amount; valB = b.amount; break;
          case 'Currency Code': valA = a.currency; valB = b.currency; break;
          case 'Alert Source': valA = a.source; valB = b.source; break;
          default: continue;
        }
        if (valA === valB) continue;
        const comparison = valA > valB ? 1 : -1;
        return criteria.order === 'Ascending' ? comparison : -comparison;
      }
      return 0;
    });
    return result;
  }, [alerts, filterCriteria, sortCriteriaList]);

  useEffect(() => {
    if (displayAlerts.length > 0) {
      const isStillVisible = displayAlerts.some(a => a.id === selectedAlertId);
      if (!selectedAlertId || (!isStillVisible && !userHasSelectedManually) || !isStillVisible) {
        setSelectedAlertId(displayAlerts[0].id);
        setUserHasSelectedManually(false);
      }
    } else {
      setSelectedAlertId('');
    }
  }, [displayAlerts, selectedAlertId, userHasSelectedManually]);

  useEffect(() => {
    const handleScrollAttempt = (e: WheelEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      const isScrollableGrid = target.closest('.scroll-grid');
      const isInputText = target.tagName === 'TEXTAREA' || (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'text');
      if (!isScrollableGrid && !isInputText) {
        e.preventDefault();
      }
    };
    window.addEventListener('wheel', handleScrollAttempt, { passive: false });
    window.addEventListener('touchmove', handleScrollAttempt, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleScrollAttempt);
      window.removeEventListener('touchmove', handleScrollAttempt);
    };
  }, []);

  const selectedAlert = useMemo(() => {
    return alerts.find(a => a.id === selectedAlertId) || displayAlerts[0] || null;
  }, [alerts, selectedAlertId, displayAlerts]);

  const handleUpdateStatus = (id: string, newStatus: AlertStatus) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status: newStatus } : alert
    ));
  };

  const handleManualSelection = (alert: Alert) => {
    setSelectedAlertId(alert.id);
    setUserHasSelectedManually(true);
  };

  const renderBusinessAttributes = () => {
    const subPages = [
      { id: 'rules', label: 'Rule-Based Scenarios' },
      { id: 'actions', label: 'Preventive Actions' },
      { id: 'e-comm', label: 'E-Communication' },
    ];

    const inputClass = "w-full border border-gray-300 rounded px-2 py-1 text-[10px] text-[#0056D2] font-semibold focus:border-blue-500 outline-none h-8 bg-white placeholder-blue-300 placeholder:font-normal";
    const labelClass = "text-[9px] font-semibold text-gray-400 mb-1 block";

    return (
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Sub-Navigation Tabs (Pill Buttons Style) - Aligned to the center */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center h-10 shrink-0">
          <div className="flex gap-2">
            {subPages.map((page) => (
              <button
                key={page.id}
                onClick={() => setActiveBusinessSubPage(page.id)}
                className={`px-5 py-1 rounded-full text-[9px] font-semibold tracking-wider transition-all ${
                  activeBusinessSubPage === page.id 
                    ? 'bg-[#0056D2] text-white shadow-md scale-[1.02] font-bold' 
                    : 'text-gray-400 hover:text-[#0056D2] hover:bg-blue-50'
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {activeBusinessSubPage === 'rules' ? (
          <div className="flex-1 flex gap-4 overflow-hidden">
            {/* Left Column: Define New Scenario */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                <h3 className="text-[#001D4A] font-bold text-[12px] uppercase tracking-tight">Define New Scenario</h3>
                <Zap size={14} className="text-[#0056D2]" />
              </div>
              <div className="p-6 flex-1 overflow-y-auto no-scrollbar scroll-grid space-y-4">
                <div>
                  <label className={labelClass}>Scenario Name</label>
                  <input type="text" placeholder="Enter scenario name..." className={inputClass} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Triggering Modality</label>
                    <div className="relative">
                      <select className={`${inputClass} appearance-none pr-8 text-blue-300 font-normal`}>
                        <option>Select modality...</option>
                        <option>Transaction Amount</option>
                        <option>Merchant Category</option>
                        <option>Country Mismatch</option>
                        <option>Frequency Threshold</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Trigger Level</label>
                    <div className="relative">
                      <select className={`${inputClass} appearance-none pr-8 text-blue-300 font-normal`}>
                        <option>Select level...</option>
                        <option>High Risk</option>
                        <option>Medium Risk</option>
                        <option>Low Risk</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Condition Logic (JSON)</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-[10px] text-[#0056D2] font-mono focus:border-blue-500 outline-none h-24 bg-gray-50/50 resize-none no-scrollbar" 
                    placeholder='{ "amount": { ">": 5000 }, "frequency": { ">": 3 } }'
                  />
                </div>

                <div>
                  <label className={labelClass}>Preventive Action</label>
                  <div className="relative">
                    <select className={`${inputClass} appearance-none pr-8 text-blue-300 font-normal`}>
                      <option>Select action...</option>
                      <option>Block Card</option>
                      <option>Limit Transaction</option>
                      <option>Customer Confirmation Required</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 flex justify-end shrink-0">
                <button className="px-6 py-2 bg-[#0056D2] text-white rounded font-bold text-[9px] uppercase tracking-wider shadow-sm hover:bg-blue-700 transition-all flex items-center gap-2">
                  <Plus size={14} /> Save Scenario
                </button>
              </div>
            </div>

            {/* Right Column: Current Scenarios */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                <h3 className="text-[#001D4A] font-bold text-[12px] uppercase tracking-tight">Current Scenarios</h3>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-[#0056D2] rounded text-[8px] font-bold">
                  Active: 4
                </div>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar scroll-grid">
                <table className="w-full text-left text-[9px]">
                  <thead className="sticky top-0 bg-white border-b border-gray-100 text-gray-400 font-semibold text-[7.5px] uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-2.5">Scenario Name</th>
                      <th className="px-4 py-2.5">Modality</th>
                      <th className="px-4 py-2.5 text-center">Status</th>
                      <th className="px-4 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { name: 'High Value Int. Purchase', mod: 'Amount', status: 'Active' },
                      { name: 'Excessive Daily ATM WDL', mod: 'Frequency', status: 'Active' },
                      { name: 'Gambling Merchant Limit', mod: 'Category', status: 'Active' },
                      { name: 'Dormant Account Activity', mod: 'Dormancy', status: 'Inactive' },
                      { name: 'Multiple Country Velocity', mod: 'Geo-Velo', status: 'Active' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 group">
                        <td className="px-4 py-3 font-semibold text-[#001D4A]">{row.name}</td>
                        <td className="px-4 py-3 text-gray-500">{row.mod}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-[3.4px] rounded-full text-[7px] font-bold uppercase transition-colors shadow-sm ${
                            row.status === 'Active' 
                              ? 'bg-[#00CC00] text-white' 
                              : row.status === 'Inactive' 
                                ? 'bg-[#FF0000] text-white' 
                                : 'bg-gray-200 text-gray-600'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1 text-gray-400 hover:text-[#0056D2] transition-colors"><Edit2 size={12} /></button>
                            <button className="p-1 text-gray-400 hover:text-[#E31B23] transition-colors"><Power size={12} /></button>
                            <button className="p-1 text-gray-400 hover:text-red-700 transition-colors"><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100 text-[8px] text-gray-400 font-medium italic shrink-0 text-center">
                Displaying 5 of 12 rule-based scenarios.
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center p-8 text-center overflow-hidden">
            {activeBusinessSubPage === 'actions' && (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-[#00CC00]">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-[#001D4A] font-bold text-lg uppercase tracking-wider">Preventive Actions</h2>
                <p className="text-gray-400 text-xs mt-2 max-w-xs">Configuration of automated account blocks and preventive measures is under development.</p>
              </div>
            )}
            {activeBusinessSubPage === 'e-comm' && (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4 text-purple-600">
                  <Mail size={32} />
                </div>
                <h2 className="text-[#001D4A] font-bold text-lg uppercase tracking-wider">E-Communication</h2>
                <p className="text-gray-400 text-xs mt-2 max-w-xs">Configuration of automated email and SMS notification services for fraud alerts is under development.</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderAlertsAnalytics = () => {
    const subPages = [
      { id: 'page1', label: 'Page 1' },
      { id: 'page2', label: 'Page 2' },
      { id: 'page3', label: 'Page 3' },
    ];

    return (
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Sub-Navigation Tabs (Pill Buttons Style) - Centered */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center h-10 shrink-0">
          <div className="flex gap-2">
            {subPages.map((page) => (
              <button
                key={page.id}
                onClick={() => setActiveSubPage(page.id)}
                className={`px-5 py-1 rounded-full text-[9px] font-semibold tracking-wider transition-all ${
                  activeSubPage === page.id 
                    ? 'bg-[#0056D2] text-white shadow-md scale-[1.02] font-bold' 
                    : 'text-gray-400 hover:text-[#0056D2] hover:bg-blue-50'
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {activeSubPage === 'page1' && (
            <>
              <div className="flex-[2] grid grid-cols-3 gap-4 shrink-0">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400 text-[9px] font-bold uppercase tracking-tight">Detection Accuracy</span>
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                      <TrendingUp size={16} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[#001D4A] text-2xl font-bold leading-tight">94.2%</h4>
                    <p className="text-green-600 text-[8px] font-bold mt-1 flex items-center gap-1">
                      +2.4% <span className="text-gray-400 font-medium">vs last month</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400 text-[9px] font-bold uppercase tracking-tight">Average Response</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <BarChart3 size={16} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[#001D4A] text-2xl font-bold leading-tight">12.5m</h4>
                    <p className="text-blue-600 text-[8px] font-bold mt-1 flex items-center gap-1">
                      -1.2m <span className="text-gray-400 font-medium">improvement</span>
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400 text-[9px] font-bold uppercase tracking-tight">High Risk Alerts</span>
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                      <AlertCircle size={16} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[#001D4A] text-2xl font-bold leading-tight">42</h4>
                    <p className="text-red-600 text-[8px] font-bold mt-1 flex items-center gap-1">
                      +12% <span className="text-gray-400 font-medium">escalation rate</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-[5] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-0">
                <AlertsMonthlyChart alerts={alerts} />
              </div>
            </>
          )}

          {(activeSubPage === 'page2' || activeSubPage === 'page3') && (
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                <FileText size={32} />
              </div>
              <h2 className="text-[#001D4A] font-bold text-lg uppercase tracking-wider">
                {activeSubPage === 'page2' ? 'Analytics View 2' : 'Analytics View 3'}
              </h2>
              <p className="text-gray-400 text-xs mt-2 max-w-xs">
                Detailed reporting and visualization options for this section are under development.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAlertsView = () => (
    <>
      <section className="flex-[5.25] flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <AlertsList 
          alerts={alerts}
          displayAlerts={displayAlerts}
          selectedId={selectedAlertId} 
          onSelect={handleManualSelection}
          filterCriteria={filterCriteria}
          setFilterCriteria={setFilterCriteria}
          sortCriteriaList={sortCriteriaList}
          setSortCriteriaList={setSortCriteriaList}
        />
      </section>

      <section className="flex-[5] flex flex-col gap-4 overflow-hidden">
        {selectedAlert ? (
          <TransactionDetails 
            alert={selectedAlert} 
            allAlerts={alerts}
            onUpdateStatus={handleUpdateStatus}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-400 italic">
            No alert selected.
          </div>
        )}
      </section>
    </>
  );

  const renderPlaceholder = (title: string) => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg m-4 border border-dashed border-gray-200">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
        <Settings size={32} className="animate-spin-slow" />
      </div>
      <h2 className="text-[#001D4A] font-bold text-lg uppercase tracking-wider">{title}</h2>
      <p className="text-gray-400 text-xs mt-2 max-w-xs">This module is currently under development. Please check back later for updates.</p>
    </div>
  );

  return (
    <div className="w-full h-full bg-[#111] flex items-center justify-center overflow-hidden fixed inset-0">
      <div 
        className="relative bg-[#F2F4F7] shadow-2xl flex flex-col overflow-hidden text-xs"
        style={{
          aspectRatio: '16 / 9',
          width: '100%',
          maxHeight: '100%',
          maxWidth: 'calc(100vh * 16 / 9)',
        }}
      >
        <Header />

        <div className="flex flex-1 overflow-hidden">
          {/* Main content area shifted right by 0.5 units (pl-0.5 to pl-1) */}
          <main className="flex-1 flex overflow-hidden pt-4 pb-4 pr-4 pl-1 gap-4">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {activeTab === 'alerts' && renderAlertsView()}
            {activeTab === 'businessAttributes' && renderBusinessAttributes()}
            {activeTab === 'alertsAnalytics' && renderAlertsAnalytics()}
            {activeTab === 'settings' && renderPlaceholder('SETTINGS')}
            
            {/* Catch-all/Default */}
            {activeTab !== 'alerts' && activeTab !== 'businessAttributes' && activeTab !== 'alertsAnalytics' && activeTab !== 'settings' && renderAlertsView()}
          </main>
        </div>

        <footer className="bg-[#001D4A] text-white py-1.5 px-4 text-[9px] flex justify-between items-center shrink-0">
          <span>Copyright 2019-2029 Pioneers Information Technologies Co. Ltd. Pio-Tech. All rights reserved.</span>
        </footer>
      </div>
    </div>
  );
};

export default App;
