
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AlertsList from './components/AlertsList';
import TransactionDetails from './components/TransactionDetails';
import { MOCK_ALERTS } from './constants';
import { Alert, AlertStatus } from './types';
import { FilterCriteria } from './components/FilterModal';
import { SortCriteria } from './components/SortModal';
import { supabase } from './lib/supabase';

export type ActiveModal = 'filter' | 'sort' | 'history' | null;
export type DbStatus = 'connected' | 'disconnected' | 'connecting';

const ITEMS_PER_PAGE = 10;
const MAX_RECORDS_LIMIT = 40000; // Updated limit to reflect user's data scale

const App: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState({ pending: 0, fraud: 0, legit: 0 });
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<DbStatus>('connecting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<string>('');
  const [language, setLanguage] = useState<'EN' | 'AR'>('EN');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string>('alerts');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria | null>(null);
  
  const [sortCriteriaList, setSortCriteriaList] = useState<SortCriteria[]>([
    { attribute: 'Date / Time', order: 'Descending' }
  ]);

  const fetchStatusCounts = useCallback(async () => {
     try {
       // Using head: true and count: exact for extreme efficiency on large tables (40k+)
       const [pendingRes, fraudRes, legitRes] = await Promise.all([
         supabase.from('alerts').select('*', { count: 'exact', head: true }).or('status.eq.PENDING,status.is.null'),
         supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('status', 'CONFIRMED_FRAUD'),
         supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('status', 'CONFIRMED_LEGITIMATE')
       ]);

       setStatusCounts({
         pending: pendingRes.count || 0,
         fraud: fraudRes.count || 0,
         legit: legitRes.count || 0
       });
     } catch (e) { 
       console.error('Counts fetch failed', e); 
     }
  }, []);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setDbStatus('connecting');
    
    try {
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from('alerts')
        .select(`
          id, source, status, feedback, alert_data,
          transactions!inner (
            id, trn_code, date, time, amount, currency, merchant_name, merchant_type, type, country, channel, pos_number, atm_number, website_url,
            accounts!inner (
              account_no, type,
              customers!inner (
                name, cif, segment, gender, dob, nationality, member_since, mobile, branch
              )
            )
          )
        `, { count: 'exact' });

      if (filterCriteria?.customerName) {
        query = query.ilike('transactions.accounts.customers.name', `%${filterCriteria.customerName}%`);
      }
      if (filterCriteria?.cif) {
        query = query.eq('transactions.accounts.customers.cif', filterCriteria.cif);
      }

      // We allow sorting but apply a range for performance
      const { data, error, count } = await query
        .order('id', { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (data) {
        const mapped: Alert[] = data.map((item: any) => {
          const trn = item.transactions;
          const acc = trn?.accounts;
          const cust = acc?.customers;
          
          let alertDateStr = 'N/A';
          if (item.alert_data) {
            const alertDateObj = new Date(item.alert_data);
            alertDateStr = alertDateObj.toLocaleDateString('en-GB');
          }

          return {
            id: item.id,
            status: (item.status?.toUpperCase() || AlertStatus.PENDING) as AlertStatus,
            feedback: item.feedback || '',
            source: (item.source || 'AI') as any,
            alertData: `Suspicious activity detected via ${item.source} engine.`,
            alertDate: alertDateStr,
            date: alertDateStr,
            time: trn?.time || '00:00:00',
            trnCode: trn?.trn_code || 'N/A',
            trnDate: trn?.date || 'N/A',
            trnTime: trn?.time || '00:00:00',
            type: trn?.type || 'Transaction',
            amount: parseFloat(trn?.amount || '0'),
            currency: trn?.currency || 'JOD',
            country: trn?.country || 'N/A',
            channel: trn?.channel || 'N/A',
            merchantName: trn?.merchant_name || 'N/A',
            merchantType: trn?.merchant_type || 'N/A',
            posNumber: trn?.pos_number || 'N/A',
            atmNumber: trn?.atm_number || 'N/A',
            websiteUrl: trn?.website_url || 'N/A',
            accountNo: acc?.account_no || 'N/A',
            accountType: acc?.type || 'N/A',
            customerName: cust?.name || 'Unknown',
            cif: cust?.cif || 'N/A',
            segment: cust?.segment || 'Retail',
            gender: cust?.gender || 'N/A',
            dob: cust?.dob || 'N/A',
            nationality: cust?.nationality || 'N/A',
            memberSince: cust?.member_since || 'N/A',
            mobile: cust?.mobile || 'N/A',
            branch: cust?.branch || 'N/A'
          };
        });
        
        setAlerts(mapped);
        setTotalCount(count || 0);
        setDbStatus('connected');
        
        if (mapped.length > 0 && !selectedAlertId) {
          setSelectedAlertId(mapped[0].id);
        }
      }
      fetchStatusCounts();
    } catch (err: any) {
      console.error('Database Sync Error:', err.message);
      setErrorMessage(err.message);
      setDbStatus('disconnected');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterCriteria, fetchStatusCounts]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleSetFilter = (criteria: FilterCriteria | null) => {
    setFilterCriteria(criteria);
    setCurrentPage(1);
    setSelectedAlertId('');
  };

  const selectedAlert = useMemo(() => alerts.find(a => a.id === selectedAlertId) || null, [alerts, selectedAlertId]);

  const isAr = language === 'AR';
  const isDark = theme === 'dark';

  return (
    <div className={`w-full h-full flex items-center justify-center fixed inset-0 transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-gray-200'}`}>
      <div 
        className={`relative flex flex-col overflow-hidden text-xs shadow-2xl transition-colors duration-300 ${isDark ? 'bg-[#121212] text-white' : 'bg-[#F2F4F7] text-[#001D4A]'}`}
        dir={isAr ? 'rtl' : 'ltr'}
        style={{ 
          aspectRatio: '16 / 9', 
          width: 'min(100vw, calc(100vh * 16 / 9))', 
          height: 'min(100vh, calc(100vw * 9 / 16))',
          borderRadius: '4px'
        }}
      >
        <Header language={language} setLanguage={setLanguage} theme={theme} setTheme={setTheme} dbStatus={dbStatus} onRefresh={fetchAlerts} />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} language={language} />
          
          <main className={`flex-1 flex overflow-hidden p-4 gap-4 ${isAr ? 'flex-row-reverse' : 'flex-row'}`}>
            {activeTab === 'alerts' && (
              <>
                <section className="flex-[4.6] flex flex-col overflow-hidden">
                  <AlertsList 
                    alerts={alerts}
                    totalCount={totalCount}
                    selectedId={selectedAlertId} 
                    onSelect={(a) => setSelectedAlertId(a.id)}
                    filterCriteria={filterCriteria}
                    setFilterCriteria={handleSetFilter}
                    sortCriteriaList={sortCriteriaList}
                    setSortCriteriaList={setSortCriteriaList}
                    language={language}
                    theme={theme}
                    activeModal={activeModal}
                    setActiveModal={setActiveModal}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    loading={loading}
                    statusCounts={statusCounts}
                  />
                </section>

                <section className="flex-[5.4] flex flex-col overflow-hidden">
                  {selectedAlert ? (
                    <TransactionDetails 
                      alert={selectedAlert} 
                      allAlerts={alerts}
                      onUpdateStatus={async (id, status, feedback) => {
                        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status, feedback } : a));
                        try {
                           await supabase.from('alerts').update({ status, feedback }).eq('id', id);
                           fetchStatusCounts();
                        } catch (e) {
                           console.error('Update failed:', e);
                        }
                      }}
                      language={language}
                      theme={theme}
                      activeModal={activeModal}
                      setActiveModal={setActiveModal}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 italic bg-white/50 dark:bg-black/20 rounded-xl border border-dashed border-gray-300">
                      {loading ? (isAr ? 'جاري جلب البيانات من الخادم...' : 'Syncing with Server...') : (isAr ? 'لم يتم اختيار تنبيه' : 'No alert selected.')}
                    </div>
                  )}
                </section>
              </>
            )}
          </main>
        </div>

        <footer className="h-7 flex items-center justify-between px-4 text-[10px] font-medium text-white/90 shrink-0 border-t border-white/10" style={{ background: '#002060' }}>
          <span>Copyright © Pioneers Information Technologies Co. Ltd. Pio-Tech. All rights reserved.</span>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-1.5">
               <div className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-[#00CC00]' : 'bg-[#FF0000] animate-pulse'}`} />
               <span className={dbStatus === 'disconnected' ? 'text-red-400 font-bold' : ''}>
                 {dbStatus === 'connected' ? `DB LINKED: ${totalCount.toLocaleString()} Alerts (Live Data)` : `SYNC ERROR: ${errorMessage}`}
               </span>
            </div>
            <span className="opacity-30">|</span>
            <span>Fraud Engine v5.3 - Dynamic Count Resolution</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
