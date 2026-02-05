import React, { useState, useRef, useEffect } from 'react';
import { X, ReceiptText, ShieldCheck, MapPin, CreditCard, Landmark, Globe, Calendar, Smartphone, MessageSquareText } from 'lucide-react';
import { Alert } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  alert: Alert | null;
  language?: 'EN' | 'AR';
  theme: 'light' | 'dark';
}

const AlertDetailsModal: React.FC<Props> = ({ isOpen, onClose, alert, language = 'EN', theme }) => {
  const isAr = language === 'AR';
  const isDark = theme === 'dark';
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const t = {
    title: isAr ? 'تفاصيل بيانات الحركة السابقة' : 'Historical Transaction Details',
    customerFeedback: isAr ? 'ملاحظات العميل' : 'Customer Feedback',
    trnCode: isAr ? 'رمز الحركة' : 'Transaction Code',
    dateTime: isAr ? 'تاريخ / وقت الحركة' : 'Transaction Date / Time',
    trnType: isAr ? 'نوع الحركة' : 'Transaction Type',
    accType: isAr ? 'نوع الحساب' : 'Account Type',
    accNo: isAr ? 'رقم الحساب' : 'Account Number',
    initChannel: isAr ? 'قناة البدء' : 'Initiation Channel',
    initCountry: isAr ? 'بلد البدء' : 'Initiation Country'
  };

  useEffect(() => {
    if (isOpen) {
      setPos({ x: 0, y: 0 });
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
  }, [dragging]);

  if (!isOpen || !alert) return null;

  // Helper to derive consistent mock data based on Alert ID
  const getDerivedDetails = (type: string, id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    let accType = isAr ? 'بطاقة ائتمانية' : 'Credit Card';
    let accNo = '4411-7610-7051-5151';
    let channel = isAr ? 'نقطة بيع (POS)' : 'Point of Sale (POS)';
    let extraLabel = isAr ? 'اسم التاجر' : 'Merchant Name';
    let extraValue = isAr ? 'شركة جرير للتسويق' : 'Jarir Marketing Co.';

    if (type === 'Cash Withdrawal') {
      accType = isAr ? (hash % 2 === 0 ? 'بطاقة ائتمانية' : 'بطاقة خصم') : (hash % 2 === 0 ? 'Credit Card' : 'Debit Card');
      accNo = hash % 2 === 0 ? '4411-7610-7051-5151' : '4112-9011-2233-4455';
      channel = isAr ? 'صراف آلي / إيداع' : 'ATM / CDM';
      extraLabel = isAr ? 'رقم الصراف' : 'ATM Number';
      extraValue = 'ATM-7721-AMN';
    } else if (type === 'Online Purchase' || type === 'Online Payment') {
      const pTypesEn = ['Credit Card', 'Virtual Card', 'Debit Card'];
      const pTypesAr = ['بطاقة ائتمانية', 'بطاقة افتراضية', 'بطاقة خصم'];
      accType = isAr ? pTypesAr[hash % 3] : pTypesEn[hash % 3];
      accNo = hash % 3 === 1 ? '4532-2188-4402-9012' : (hash % 3 === 2 ? '4112-9011-2233-4455' : '4411-7610-7051-5151');
      channel = type === 'Online Purchase' ? (isAr ? 'إي-كوميرس' : 'E-Commerce') : (isAr ? (hash % 2 === 0 ? 'تطبيق موبايل' : 'تطبيق ويب') : (hash % 2 === 0 ? 'Mobile App' : 'Web App'));
      extraLabel = isAr ? 'الموقع الإلكتروني' : 'Website';
      extraValue = 'Amazon.com';
    } else if (type === 'Instant Transfer') {
      accType = isAr ? (hash % 2 === 0 ? 'حساب جاري' : 'حساب توفير') : (hash % 2 === 0 ? 'Current Account' : 'Saving Account');
      accNo = hash % 2 === 0 ? '002-880-987654-00' : '002-880-112233-01';
      channel = isAr ? (hash % 2 === 0 ? 'تطبيق موبايل' : 'تطبيق ويب') : (hash % 2 === 0 ? 'Mobile App' : 'Web App');
      extraLabel = isAr ? 'المستفيد' : 'Beneficiary';
      extraValue = isAr ? 'زيد خليل الفايز' : 'Zaid Khalil Al-Fayez';
    }

    const mockFeedbacksEn = [
      "Customer confirmed the transaction was authorized and performed by them during recent travel.",
      "The customer stated they were unaware of this transaction and requested immediate card block.",
      "Verification successful via recorded IVR call. Transaction deemed legitimate.",
      "Transaction was identified as part of a recurring subscription the customer had forgotten about.",
      "Alert resolved after customer provided supporting documents for high-value transfer."
    ];
    const mockFeedbacksAr = [
      "أكد العميل أن الحركة مفوضة وتم تنفيذها من قبله أثناء سفره الأخير.",
      "ذكر العميل أنه لم يكن على علم بهذه الحركة وطلب حظر البطاقة فوراً.",
      "تم التحقق بنجاح عبر مكالمة IVR مسجلة. تم اعتبار الحركة قانونية.",
      "تم تحديد الحركة كجزء من اشتراك متكرر كان العميل قد نسيه.",
      "تم حل التنبيه بعد تقديم العميل للمستندات الداعمة للتحويل عالي القيمة."
    ];
    const feedback = isAr ? mockFeedbacksAr[hash % mockFeedbacksAr.length] : mockFeedbacksEn[hash % mockFeedbacksEn.length];

    return { accType, accNo, channel, extraLabel, extraValue, feedback };
  };

  const details = getDerivedDetails(alert.type, alert.id);

  const InfoRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
    <div className={`flex items-center gap-3 p-2 rounded-md ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
      <div className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-lg ${isDark ? 'bg-[#0056D2]/20 text-[#00AEEF]' : 'bg-blue-50 text-[#0056D2]'}`}>
        <Icon size={14} strokeWidth={2} />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-gray-400 text-[8px] font-bold uppercase tracking-tight leading-none mb-1">{label}</span>
        <span className={`text-[10px] font-bold truncate ${isDark ? 'text-[#00AEEF]' : 'text-[#0056D2]'}`}>{value}</span>
      </div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[150] overflow-hidden"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className={`rounded-lg w-full max-w-xl border transition-colors duration-300 ${isDark ? 'bg-[#1e1e1e] border-[#555]' : 'bg-white border-gray-200'}`}
        style={{ 
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.4)',
          direction: isAr ? 'rtl' : 'ltr'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          onMouseDown={onMouseDown}
          className="modal-header p-3 flex justify-between items-center cursor-move select-none rounded-t-lg"
          style={{ background: 'linear-gradient(to right, #002060 15%, #0037A4 50%, #002060 85%)' }}
        >
          <div className="flex items-center gap-2">
            <ReceiptText size={14} className="text-white" />
            <h3 className={`text-white font-bold ${isAr ? 'text-[14px]' : 'text-[12px]'} uppercase tracking-wider`}>{t.title}</h3>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors cursor-pointer outline-none">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className={`flex items-center justify-between p-3 rounded-lg border-b ${isDark ? 'bg-[#0056D2]/10 border-[#555]' : 'bg-[#EBF5FF] border-blue-100'}`}>
            <div className="flex flex-col">
              <span className="text-[#0056D2] text-[12px] font-bold leading-tight uppercase">{alert.customerName}</span>
              <span className="text-gray-400 text-[9px] font-semibold">{alert.cif}</span>
            </div>
            <div className={`flex flex-col ${isAr ? 'items-start' : 'items-end'}`}>
              <span className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#002060]'}`}>
                {alert.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[10px] font-semibold opacity-80">{alert.currency}</span>
              </span>
              <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter text-white ${
                alert.status === 'CONFIRMED_FRAUD' ? 'bg-[#FF0000]' : 'bg-[#00CC00]'
              }`}>
                {alert.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoRow icon={ShieldCheck} label={t.trnCode} value={alert.trnCode} />
            <InfoRow icon={Calendar} label={t.dateTime} value={`${alert.date} - ${alert.time}`} />
            <InfoRow icon={ReceiptText} label={t.trnType} value={alert.type} />
            <InfoRow icon={CreditCard} label={t.accType} value={details.accType} />
            <InfoRow icon={Landmark} label={t.accNo} value={details.accNo} />
            <InfoRow icon={Smartphone} label={t.initChannel} value={details.channel} />
            <div className="col-span-2">
               <InfoRow icon={Globe} label={t.initCountry} value={alert.country} />
            </div>
            <div className="col-span-2">
               <InfoRow icon={MapPin} label={details.extraLabel} value={details.extraValue} />
            </div>
          </div>

          <div className={`mt-1 flex flex-col p-3 rounded-lg border ${isDark ? 'bg-[#121212] border-[#555]' : 'bg-[#F8FAFC] border-gray-100'}`}>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquareText size={14} className={isDark ? 'text-[#00AEEF]' : 'text-[#0056D2]'} />
              <span className="text-gray-400 text-[9px] font-bold uppercase tracking-tight">{t.customerFeedback}</span>
            </div>
            <p className={`text-[10px] font-medium leading-relaxed italic ${isDark ? 'text-[#00AEEF]' : 'text-[#0056D2]'}`}>
              "{details.feedback}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailsModal;