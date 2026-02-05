
import React, { useState, useEffect } from 'react';
import { Alert, AlertStatus } from '../types';
import { AI_TRIGGERS } from '../constants';
import { 
  User, Key, Globe, Clock, IdCard, Mars, MapPin, Smartphone, Phone, 
  Mail, ShieldAlert, CreditCard, Mic, MessageSquare, Landmark, Ban, 
  ChevronLeft, ChevronRight, Handshake, Briefcase, History
} from 'lucide-react';
import { ActiveModal } from '../App';

interface Props {
  alert: Alert & { trnDate?: string; trnTime?: string };
  allAlerts: Alert[];
  onUpdateStatus: (id: string, status: AlertStatus, feedback: string) => void;
  language: 'EN' | 'AR';
  theme: 'light' | 'dark';
  activeModal: ActiveModal;
  setActiveModal: (m: ActiveModal) => void;
}

const TransactionDetails: React.FC<Props> = ({ alert, onUpdateStatus, language, theme, setActiveModal }) => {
  const isAr = language === 'AR';
  const isDark = theme === 'dark';
  const [feedback, setFeedback] = useState(alert.feedback || '');

  useEffect(() => { setFeedback(alert.feedback || ''); }, [alert.id, alert.feedback]);

  const t = {
    customerDetails: isAr ? 'تفاصيل العميل' : 'CUSTOMER DETAILS',
    transactionDetails: isAr ? 'تفاصيل الحركة' : 'TRANSACTION DETAILS',
    preventiveActions: isAr ? 'الإجراءات الوقائية' : 'PREVENTIVE ACTIONS',
    alertTriggers: isAr ? 'محفزات التنبيه (ذكاء اصطناعي)' : 'KEY ALERT TRIGGERS (AI-BASED)',
    alertManagement: isAr ? 'إدارة التنبيهات' : 'ALERT MANAGEMENT',
    legitimate: isAr ? 'قانوني' : 'LEGITIMATE',
    fraud: isAr ? 'احتيال' : 'FRAUD',
    history: isAr ? 'سجل التنبيهات' : 'Alerts History'
  };

  return (
    <div className={`flex flex-col h-full overflow-y-auto no-scrollbar gap-4 ${isDark ? 'text-white' : 'text-[#001D4A]'}`}>
      
      {/* CUSTOMER DETAILS PANEL */}
      <div className={`rounded-xl border p-5 shadow-sm ${isDark ? 'bg-[#181818] border-[#333]' : 'bg-white border-gray-100'}`}>
        <h3 className="font-black text-[15px] text-[#002060] dark:text-[#00AEEF] uppercase mb-5 tracking-tight">{t.customerDetails}</h3>
        <div className="grid grid-cols-4 gap-y-5 gap-x-2">
          <DetailIconCard icon={Key} label="CIF No" value={alert.cif} isDark={isDark} />
          <DetailIconCard icon={User} label="Customer Name" value={alert.customerName} isDark={isDark} />
          <DetailIconCard icon={IdCard} label="Customer Type" value="Individual" isDark={isDark} />
          <DetailIconCard icon={Smartphone} label="Mobile No" value={alert.mobile || '+962 79 1234567'} isDark={isDark} />
          
          <DetailIconCard icon={Mars} label="Gender" value={alert.gender || 'Male'} isDark={isDark} />
          <DetailIconCard icon={Clock} label="Date Of Birth" value={alert.dob || '12/04/1985'} isDark={isDark} />
          <DetailIconCard icon={Globe} label="Nationality" value={alert.nationality || 'USA'} isDark={isDark} />
          <DetailIconCard icon={Phone} label="Phone No" value={alert.mobile || '+962 79 9616190'} isDark={isDark} />
          
          <DetailIconCard icon={Handshake} label="Member Since" value={alert.memberSince || '10/05/2012'} isDark={isDark} />
          <DetailIconCard icon={MapPin} label="Branch Name" value={alert.branch || 'Main Branch'} isDark={isDark} />
          <DetailIconCard icon={Briefcase} label="Segment" value={alert.segment || 'Retail'} isDark={isDark} />
          <DetailIconCard icon={Mail} label="Email Address" value="ammar.daghlas@pio-tech.com" isDark={isDark} />
        </div>
      </div>

      {/* TRANSACTION DETAILS AREA */}
      <div className={`rounded-xl border p-5 shadow-sm flex-1 flex flex-col gap-5 ${isDark ? 'bg-[#181818] border-[#333]' : 'bg-white border-gray-100'}`}>
        <div className="flex justify-between items-center">
          <h3 className="font-black text-[15px] text-[#002060] dark:text-[#00AEEF] uppercase tracking-tight">{t.transactionDetails}</h3>
          <button onClick={() => setActiveModal('history')} className="flex items-center gap-1.5 text-gray-400 text-[11px] font-bold uppercase hover:text-[#0056D2] transition-colors">
            <History size={14}/> {t.history}
          </button>
        </div>

        <div className="flex gap-4">
          {/* Main Transaction Info */}
          <div className="flex-[7] relative pt-3">
             <div className={`absolute top-0 left-4 px-3 text-[#FF0000] text-[10px] font-black uppercase tracking-widest border border-red-100 rounded-sm z-10 shadow-sm ${isDark ? 'bg-[#181818]' : 'bg-white'}`}>
               {alert.type || 'ONLINE PAYMENT'}
             </div>
             <div className={`border rounded-xl p-5 grid grid-cols-2 gap-y-2.5 ${isDark ? 'border-[#333]' : 'border-gray-200'}`}>
               <Row label="Trns Code :" value={alert.trnCode || '132951'} isDark={isDark} />
               <Row label="Account Type :" value={alert.accountType || 'Current Account'} isDark={isDark} />
               <Row label="Trns Date :" value={alert.trnDate || alert.date || '15/09/2025'} isDark={isDark} />
               <Row label="Account No :" value={alert.accountNo || '002-880-987654-00'} isDark={isDark} />
               <Row label="Trns Time :" value={alert.trnTime || alert.time || '08:12:56'} isDark={isDark} />
               <Row label="Initiation Channel :" value={alert.channel || 'Web App'} isDark={isDark} />
               <Row label="Trns Amount :" value={alert.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} isDark={isDark} />
               <Row label="Beneficiary Category :" value="Government" isDark={isDark} />
               <Row label="Currency Code :" value={alert.currency || 'USD'} isDark={isDark} />
               <Row label="Beneficiary Name :" value="Tax Department" isDark={isDark} />
               <Row label="Init. Country :" value={alert.country || 'USA'} isDark={isDark} />
               <Row label="Reference No :" value="TXN-882910" isDark={isDark} />
             </div>
          </div>

          {/* Preventive Actions */}
          <div className="flex-[3] relative pt-3">
             <div className={`absolute top-0 left-4 px-3 text-[#FF0000] text-[10px] font-black uppercase tracking-widest border border-red-100 rounded-sm z-10 shadow-sm ${isDark ? 'bg-[#181818]' : 'bg-white'}`}>
               {t.preventiveActions}
             </div>
             <div className={`border rounded-xl p-5 flex flex-col gap-4 h-full ${isDark ? 'border-[#333]' : 'border-gray-200'}`}>
               <div className="flex items-center justify-between">
                 <div className="flex flex-col">
                    <span className="text-gray-400 text-[9px] font-black uppercase tracking-tight leading-none mb-1">Current Account</span>
                    <span className="text-[#0056D2] dark:text-[#00AEEF] text-[12px] font-black leading-none">002-880-987654-00</span>
                 </div>
                 <Ban size={20} className="text-[#FF0000] opacity-80" />
               </div>
               <div className="flex items-center justify-between">
                 <div className="flex flex-col">
                    <span className="text-gray-400 text-[9px] font-black uppercase tracking-tight leading-none mb-1">Web App User ID</span>
                    <span className="text-[#0056D2] dark:text-[#00AEEF] text-[12px] font-black leading-none">WID-45609</span>
                 </div>
                 <Ban size={20} className="text-[#FF0000] opacity-80" />
               </div>
               <div className="flex flex-col gap-1 mt-auto">
                  <div className={`w-full h-px ${isDark ? 'bg-[#333]' : 'bg-gray-100'}`} />
                  <span className="text-gray-300 text-[10px]">-</span>
                  <span className="text-gray-300 text-[10px]">-</span>
               </div>
             </div>
          </div>
        </div>

        {/* AI TRIGGERS SECTION */}
        <div className="relative pt-3">
          <div className={`absolute top-0 left-4 px-3 text-[#FF0000] text-[10px] font-black uppercase tracking-widest border border-red-100 rounded-sm z-10 shadow-sm ${isDark ? 'bg-[#181818]' : 'bg-white'}`}>
            {t.alertTriggers}
          </div>
          <div className={`border rounded-xl p-4 flex items-center gap-4 ${isDark ? 'border-[#333]' : 'border-gray-200'}`}>
            <button className="text-[#0056D2] dark:text-[#00AEEF] hover:bg-blue-50/10 p-1 rounded-full transition-colors"><ChevronLeft size={24}/></button>
            <div className="flex-1 flex gap-3 overflow-hidden">
              {AI_TRIGGERS.map((trig, i) => (
                <div key={i} className={`flex-1 min-w-[140px] rounded-xl p-4 flex flex-col items-center justify-center gap-2 border transition-transform hover:scale-[1.02] ${isDark ? 'bg-white/5 border-white/10' : 'bg-blue-50/50 border-blue-100'}`}>
                  <span className="text-[20px] font-black text-[#FF0000]">{trig.percentage}%</span>
                  <span className="text-[#0056D2] dark:text-[#00AEEF] text-[10px] font-black text-center uppercase leading-tight tracking-tighter line-clamp-2">
                    {trig.label}
                  </span>
                </div>
              ))}
            </div>
            <button className="text-[#0056D2] dark:text-[#00AEEF] hover:bg-blue-50/10 p-1 rounded-full transition-colors"><ChevronRight size={24}/></button>
          </div>
        </div>

        {/* ALERT MANAGEMENT */}
        <div className="relative pt-3">
           <div className={`absolute top-0 left-4 px-3 text-[#FF0000] text-[10px] font-black uppercase tracking-widest border border-red-100 rounded-sm z-10 shadow-sm ${isDark ? 'bg-[#181818]' : 'bg-white'}`}>
             {t.alertManagement}
           </div>
           <div className={`border rounded-xl p-5 flex flex-col gap-4 ${isDark ? 'border-[#333]' : 'border-gray-200'}`}>
             <div className="flex items-center justify-between">
               <div className="flex gap-4">
                 <MgmtIcon Icon={Mic} timestamp={alert.alertDate || "15/09/2025 08:12:56"} active isDark={isDark} />
                 <MgmtIcon Icon={MessageSquare} timestamp={alert.alertDate || "15/09/2025 08:12:56"} active isDark={isDark} />
                 <MgmtIcon Icon={Mail} timestamp={alert.alertDate || "15/09/2025 08:12:56"} active isDark={isDark} />
                 <MgmtIcon Icon={Phone} timestamp="Null" isDark={isDark} />
               </div>
               <div className="flex gap-4">
                 <button 
                  onClick={() => onUpdateStatus(alert.id, AlertStatus.CONFIRMED_LEGITIMATE, feedback)} 
                  className="bg-[#00CC00] text-white px-14 py-3 rounded-full text-[12px] font-black uppercase hover:brightness-110 shadow-lg transition-all active:scale-95"
                 >
                   {t.legitimate}
                 </button>
                 <button 
                  onClick={() => onUpdateStatus(alert.id, AlertStatus.CONFIRMED_FRAUD, feedback)} 
                  className="bg-[#FF0000] text-white px-14 py-3 rounded-full text-[12px] font-black uppercase hover:brightness-110 shadow-lg transition-all active:scale-95"
                 >
                   {t.fraud}
                 </button>
               </div>
             </div>
             <div className="relative">
                <textarea 
                  value={feedback} 
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter Customer Feedback here (optional)..."
                  className={`w-full h-20 border rounded-xl p-4 text-[12px] font-bold outline-none transition-colors placeholder:italic placeholder:font-medium shadow-inner ${isDark ? 'bg-[#121212] border-[#444] text-[#00AEEF] placeholder:text-gray-600' : 'bg-white border-gray-200 text-[#001D4A] focus:border-[#0056D2]'}`}
                />
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value, isDark }: { label: string, value: any, isDark: boolean }) => (
  <div className="flex justify-between items-center pr-4">
    <span className="text-gray-400 font-black uppercase tracking-tight text-[10px]">{label}</span>
    <span className={`font-black text-[12px] text-right truncate pl-4 ${isDark ? 'text-[#00AEEF]' : 'text-[#0056D2]'}`}>{value}</span>
  </div>
);

const DetailIconCard = ({ icon: Icon, label, value, isDark }: any) => (
  <div className="flex items-center gap-3">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${isDark ? 'bg-white/5 border-white/10 text-[#00AEEF]' : 'bg-blue-50 text-[#0056D2] border-blue-100'}`}>
      <Icon size={22} strokeWidth={1.5} />
    </div>
    <div className="flex flex-col min-w-0">
      <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1.5 tracking-tight">{label}</p>
      <p className={`text-[12px] font-black leading-none truncate ${isDark ? 'text-[#00AEEF]' : 'text-[#0056D2]'}`}>{value}</p>
    </div>
  </div>
);

const MgmtIcon = ({ Icon, timestamp, active, isDark }: any) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${!active ? (isDark ? 'bg-black/20 text-gray-700 border-[#333]' : 'bg-gray-50 text-gray-300 border-gray-100') : (isDark ? 'bg-white/5 text-[#00AEEF] border-white/20' : 'bg-blue-50 text-[#0056D2] border-blue-100 shadow-sm')}`}>
      <Icon size={22} strokeWidth={1.5} />
    </div>
    <div className="flex flex-col items-center leading-none h-[18px] justify-center">
       {timestamp === 'Null' ? <span className="text-gray-300 text-[10px] font-black uppercase tracking-tighter">Null</span> : (
         <>
           <span className="text-gray-400 text-[8px] font-black tracking-tighter">{timestamp.split(' ')[0]}</span>
           <span className="text-gray-400 text-[8px] font-black tracking-tighter">{timestamp.split(' ')[1]}</span>
         </>
       )}
    </div>
  </div>
);

export default TransactionDetails;
