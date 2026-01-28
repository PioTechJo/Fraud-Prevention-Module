import React, { useState, useMemo } from 'react';
import { Alert, AlertStatus } from '../types';
import { SELECTED_TRANSACTION, AI_TRIGGERS } from '../constants';
import { CheckCircle2, XCircle, User, Key, Globe, Briefcase, Calendar, Clock, Handshake, IdCard, Mars, Venus, MapPin, Smartphone, Phone, Mail } from 'lucide-react';
import AlertDetailsModal from './AlertDetailsModal';
import AlertsHistoryModal from './AlertsHistoryModal';

interface Props {
  alert: Alert;
  allAlerts: Alert[];
  onUpdateStatus: (id: string, status: AlertStatus) => void;
}

// Simulation date constant
const TODAY_DATE = '15/09/2025';

// Pre-defined list of user IDs for Attended By column
const ATTENDED_BY_USERS = [
  'USR12845', 'USR21903', 'USR88122', 'USR45091', 'USR77301',
  'USR33210', 'USR90442', 'USR11567', 'USR66782', 'USR54109'
];

// Data for Online Purchases - Updated countries to Arab countries
const WEBSITE_DATA = [
  { name: 'Temu', country: 'UAE', url: 'www.temu.com' },
  { name: 'Ali-Baba', country: 'Jordan', url: 'www.alibaba.com' },
  { name: 'Amazon', country: 'UAE', url: 'www.amazon.ae' },
  { name: 'Noon', country: 'Saudi Arabia', url: 'www.noon.com' },
  { name: 'Namshi', country: 'UAE', url: 'www.namshi.com' },
  { name: 'Jarir', country: 'Saudi Arabia', url: 'www.jarir.com' },
  { name: 'OpenSooq', country: 'Jordan', url: 'www.opensooq.com' },
];

// Data for Instant Transfers - Arabic names in English characters
const BENEFICIARY_NAMES = [
  'Ayman Khalid Al-Saadi', 'Fatima Hassan Al-Mansoori', 'Omar Zaid Al-Fayez', 
  'Laila Mahmoud Al-Qasimi', 'Zaid Ibrahim Al-Hashimi', 'Noura Saleh Al-Dosari', 
  'Mohammed Rashid Al-Maktoum', 'Sarah Ahmed Al-Thani', 'Abdullah Youssef Al-Sabah', 
  'Mariam Khalid Al-Saud', 'Hassan Ali Al-Jaber', 'Reem Nasser Al-Kuwari',
  'Sultan Al-Otaibi', 'Dalal Al-Bahar', 'Fahad Al-Ghamdi', 'Amna Al-Sowaidi', 
  'Khaled Al-Marri', 'Shamma Al-Mazrouei', 'Yousef Al-Ahmad', 'Huda Al-Ghoson'
];

const GLOBAL_BANKS = [
  'HSBC Holdings', 'JPMorgan Chase', 'Bank of America', 'BNP Paribas', 'Mitsubishi UFJ Financial',
  'Barclays', 'Deutsche Bank', 'Santander Group', 'Standard Chartered', 'Citigroup',
  'Société Générale', 'UBS Group', 'Credit Suisse', 'Royal Bank of Canada', 'Wells Fargo'
];

// Country-specific data for Cash Withdrawals - replaced USA with Kuwait
const COUNTRY_DATA: Record<string, { banks: string[]; cities: string[] }> = {
  'Jordan': {
    banks: ['Arab Bank', 'Housing Bank', 'Bank of Jordan', 'Jordan Islamic Bank'],
    cities: ['Amman', 'Zarqa', 'Irbid', 'Aqaba']
  },
  'Saudi Arabia': {
    banks: ['Al Rajhi Bank', 'SNB (AlAhli)', 'Riyad Bank', 'Banque Saudi Fransi'],
    cities: ['Riyadh', 'Jeddah', 'Dammam', 'Mecca']
  },
  'UAE': {
    banks: ['Emirates NBD', 'FAB', 'ADCB', 'Dubai Islamic Bank'],
    cities: ['Dubai', 'Abu Dhabi', 'Inter-Sharjah', 'Ajman']
  },
  'Kuwait': {
    banks: ['National Bank of Kuwait (NBK)', 'Gulf Bank', 'Burgan Bank', 'KFH'],
    cities: ['Kuwait City', 'Al Ahmadi', 'Hawalli', 'Salmiya']
  },
  'Egypt': {
    banks: ['National Bank of Egypt', 'Banque Misr', 'CIB Egypt', 'QNB Alahli'],
    cities: ['Cairo', 'Alexandria', 'Giza', 'Sharm El-Sheikh']
  }
};

const DEFAULT_DATA = {
  banks: ['International Arab Bank', 'Global Trust Bank'],
  cities: ['Capital City', 'Central District']
};

const TransactionDetails: React.FC<Props> = ({ alert, allAlerts, onUpdateStatus }) => {
  const [feedback, setFeedback] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyAlertForDetails, setHistoryAlertForDetails] = useState<Alert | null>(null);

  // Filter historical alerts for the currently selected customer
  const historyAlerts = useMemo(() => {
    return allAlerts.filter(a => a.cif === alert.cif && a.date !== TODAY_DATE);
  }, [allAlerts, alert.cif]);

  // Helper for deterministic randomness based on string
  const getSeed = (str: string) => {
    let seed = 0;
    for (let i = 0; i < str.length; i++) {
      seed = (seed << 5) - seed + str.charCodeAt(i);
      seed |= 0;
    }
    return seed;
  };

  const nextInt = (seed: number) => {
    return (seed * 1103515245 + 12345) & 0x7fffffff;
  };

  // Generate deterministic details for the customer based on CIF and Name
  const customerDetails = useMemo(() => {
    const cifNum = alert.cif.replace(/[^0-9]/g, '');
    const names = alert.customerName.split(' ').filter(n => n.trim().length > 0);
    const firstName = names[0] || '';
    const seed = getSeed(cifNum);

    // Profile Details
    const segments = ['Retail', 'Premier', 'Private Banking', 'Corporate'];
    const riskLevels = ['Low', 'Medium', 'High'];
    const categories = ['Individual', 'Joint', 'Minor'];
    
    const segment = segments[Math.abs(seed) % segments.length];
    const riskLevel = riskLevels[Math.abs(seed) % riskLevels.length];
    const category = categories[Math.abs(seed) % categories.length];
    
    // Determine gender based on first name
    const femaleNames = [
      'Fatima', 'Laila', 'Noura', 'Sarah', 'Mariam', 'Reem', 'Dalal', 'Amna', 
      'Shamma', 'Huda', 'Rania', 'Fairuz', 'Mona', 'Nancy', 'Elissa', 'Lubna', 
      'Sheikha', 'Raja', 'Salwa', 'Ghada', 'Ahlam', 'Assala', 'Myriam', 'Balqees', 
      'Nawal', 'Diana', 'Yara', 'Carole', 'Maya', 'Haifa', 'Nadine', 'Sulafa', 
      'Amal', 'Hend', 'Saba', 'Muna', 'Yousra', 'Elham', 'Hala'
    ];
    const gender = femaleNames.includes(firstName) ? 'Female' : 'Male';

    const dob = `12/04/${1970 + (Math.abs(seed) % 30)}`;
    const memberSince = `10/05/${2005 + (Math.abs(seed) % 18)}`;
    const branchName = `Branch ${(Math.abs(seed) % 35 + 1).toString().padStart(2, '0')}`;

    // User IDs
    const initials = (names[0]?.[0] + (names[1]?.[0] || 'X') + (names[names.length - 1]?.[0] || 'Z')).toUpperCase();
    let mobileSuffix = '';
    let suffixSeed = seed;
    for (let i = 0; i < 5; i++) {
      suffixSeed = nextInt(suffixSeed);
      mobileSuffix += (suffixSeed % 10).toString();
    }
    const mobileId = `${initials}${mobileSuffix}`;

    // Generate email based ID for webId and Email Address field
    const emailLastName = names[names.length - 1]?.toLowerCase().replace(/[^a-z]/g, '') || 'customer';
    const domain = (Math.abs(seed) % 2 === 0) ? 'gmail.com' : 'yahoo.com';
    const webId = `${names[0]?.[0]?.toLowerCase() || 'u'}.${emailLastName}@${domain}`;

    // Contact Numbers
    const cCode = '+962';
    const mobileNetworkCodes = ['79', '78', '77'];
    const mCode = mobileNetworkCodes[Math.abs(seed) % mobileNetworkCodes.length];
    const mobileNo = `${cCode} ${mCode} ${Math.abs(nextInt(seed) % 10000000).toString().padStart(7, '0')}`;
    
    const phoneNetworkCodes = ['6', '2', '7', '3'];
    const pCode = phoneNetworkCodes[Math.abs(nextInt(seed)) % phoneNetworkCodes.length];
    const phoneNo = `${cCode} ${pCode} ${Math.abs(nextInt(nextInt(seed)) % 10000000).toString().padStart(7, '0')}`;

    const genAccNo = (type: string) => {
      let typeSeed = getSeed(cifNum + type);
      if (type === 'Current') return `${((Math.abs(typeSeed) % 65) + 1).toString().padStart(3, '0')}-510-${cifNum.slice(-8)}-01`;
      if (type === 'Saving') return `${((Math.abs(typeSeed) % 65) + 1).toString().padStart(3, '0')}-520-${cifNum.slice(-8)}-01`;
      return `${Math.abs(nextInt(typeSeed) % 9000 + 1000)}-${Math.abs(nextInt(typeSeed) % 9000 + 1000)}-${Math.abs(nextInt(typeSeed) % 9000 + 1000)}-${Math.abs(nextInt(typeSeed) % 9000 + 1000)}`;
    };

    return {
      segment,
      riskLevel,
      category,
      gender,
      dob,
      memberSince,
      branchName,
      mobileId,
      webId,
      mobileNo,
      phoneNo,
      creditCard: genAccNo('Credit'),
      debitCard: genAccNo('Debit'),
      currentAccount: genAccNo('Current'),
      savingAccount: genAccNo('Saving'),
    };
  }, [alert.cif, alert.customerName]);

  const { initiationChannel, accountType, accountNo } = useMemo(() => {
    let channel = 'Point of Sale (POS)';
    if (alert.type === 'Online Purchase') channel = 'E-Commerce Website';
    else if (alert.type === 'Cash Withdrawal') channel = 'ATM';
    else if (alert.type === 'Instant Transfer') channel = 'Payment Hub';

    let type = 'Credit Card';
    if (alert.type === 'Cash Withdrawal') type = 'Debit Card';
    else if (alert.type === 'Instant Transfer') type = 'Current Account';
    
    let no = customerDetails.creditCard;
    if (type === 'Debit Card') no = customerDetails.debitCard;
    if (type === 'Current Account') no = customerDetails.currentAccount;
    
    return { initiationChannel: channel, accountType: type, accountNo: no };
  }, [alert.type, customerDetails]);

  const dynamicDetails = useMemo(() => {
    let seed = getSeed(alert.cif + alert.id);
    const absSeed = Math.abs(seed);
    if (alert.type === 'Cash Withdrawal') {
      const data = COUNTRY_DATA[alert.country] || DEFAULT_DATA;
      const bank = data.banks[absSeed % data.banks.length];
      const city = data.cities[(absSeed >> 2) % data.cities.length];
      return { bank, city, atmNo: `${Math.abs(nextInt(absSeed) % 900 + 100)}-${Math.abs(nextInt(absSeed) % 9000 + 1000)}` };
    }
    if (alert.type === 'Online Purchase') {
      const website = WEBSITE_DATA[absSeed % WEBSITE_DATA.length];
      return { websiteName: website.name, websiteCountry: website.country, websiteUrl: website.url };
    }
    if (alert.type === 'Instant Transfer') {
      const beneficiary = BENEFICIARY_NAMES[absSeed % BENEFICIARY_NAMES.length];
      const bank = GLOBAL_BANKS[(absSeed >> 3) % GLOBAL_BANKS.length];
      return { beneficiaryName: beneficiary, transferBank: bank, iban: `JO${Math.abs(nextInt(absSeed) % 90 + 10)}BANK${Math.abs(nextInt(absSeed) % 1000000000000000000)}` };
    }
    return null;
  }, [alert.type, alert.cif, alert.country, alert.id]);

  const sortedPreventiveActions = useMemo(() => {
    const actions = [
      { label: customerDetails.currentAccount, sub: "Current Account", status: (accountType === 'Current Account' ? 'error' : 'success') as 'success' | 'error' },
      { label: customerDetails.savingAccount, sub: "Saving Account", status: 'success' as 'success' | 'error' },
      { label: customerDetails.creditCard, sub: "Credit Card", status: (accountType === 'Credit Card' ? 'error' : 'success') as 'success' | 'error' },
      { label: customerDetails.debitCard, sub: "Debit Card", status: (accountType === 'Debit Card' ? 'error' : 'success') as 'success' | 'error' },
      { label: customerDetails.mobileId, sub: "User-ID ( Mobile Banking )", status: 'success' as 'error' | 'success' },
      { label: customerDetails.webId, sub: "User-ID ( Internet Banking )", status: 'success' as 'error' | 'success' },
    ];
    return [...actions].sort((a, b) => (a.status === 'error' ? -1 : (b.status === 'error' ? 1 : 0)));
  }, [customerDetails, accountType]);

  const labelClass = "text-gray-400 text-[9px] font-bold leading-none mb-0.5";
  const iconContainerClass = "w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-[#0056D2] shrink-0";
  const contactIconContainerClass = "w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-[#FF0000] shrink-0";
  const valueClass = "text-[#001D4A] text-[11px] font-bold leading-tight";
  const ICON_SIZE = 20.5;
  const GLOBAL_STROKE_WIDTH = 1.75; // 2.0 - 0.25

  return (
    <>
      {/* 1. CUSTOMER DETAILS */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col shrink-0 overflow-hidden text-xs">
        <div className="p-6">
          <h2 className="text-[#001D4A] font-bold text-[15px] uppercase tracking-tight mb-8">Customer Details</h2>
          
          {/* Shifted the entire grid stack right by 1 unit (ml-1) */}
          <div className="flex flex-col gap-y-7 ml-1">
            {/* GRID 1: Profile Information - Reformed to 3 Columns x 3 Rows - gap-y reduced from 6 to 3 */}
            <div className="grid grid-cols-3 gap-x-8 gap-y-3 w-full">
              {/* ROW 1 */}
              <div className="flex items-center gap-3">
                <div className={iconContainerClass}>
                  <Key size={ICON_SIZE} strokeWidth={GLOBAL_STROKE_WIDTH} />
                </div>
                <div className="min-w-0">
                  <p className={labelClass}>CIF No</p>
                  <p className={`${valueClass} truncate`}>{alert.cif}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={iconContainerClass}>
                  <User size={ICON_SIZE} strokeWidth={GLOBAL_STROKE_WIDTH} />
                </div>
                <div className="min-w-0">
                  <p className={labelClass}>Customer Name</p>
                  <p className={`${valueClass} truncate`}>{alert.customerName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={iconContainerClass}>
                  <Briefcase size={ICON_SIZE} strokeWidth={GLOBAL_STROKE_WIDTH} />
                </div>
                <div className="min-w-0">
                  <p className={labelClass}>Segment</p>
                  <p className={`${valueClass} truncate`}>{customerDetails.segment}</p>
                </div>
              </div>

              {/* ROW 2 */}
              <div className="flex items-center gap-3">
                <div className={iconContainerClass}>
                  {customerDetails.gender === 'Male' ? <Mars size={ICON_SIZE} strokeWidth={GLOBAL_STROKE_WIDTH} /> : <Venus size={ICON_SIZE} strokeWidth={GLOBAL_STROKE_WIDTH} />}
                </div>
                <div className="min-w-0">
                  <p className={labelClass}>Gender</p>
                  <p className={`${valueClass} truncate`}>{customerDetails.gender}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={iconContainerClass}>
                  <Calendar size={ICON_SIZE} strokeWidth={GLOBAL_STROKE_WIDTH} />
                </div>
                <div className="min-w-0">
                  <p className={labelClass}>Date Of Birth</p>
                  <p className={`${valueClass} truncate`}>{customerDetails.dob}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={iconContainerClass}>
                  <Globe size={ICON_SIZE} strokeWidth={GLOBAL_STROKE_WIDTH} />
                </div>
                <div className="min-w-0">
                  <p className={labelClass}>Nationality</p>
                  <p className={`${valueClass} truncate`}>{alert.country}</p>
                </div>
              </div>

              {/* ROW 3 */}
              <div className="flex items-center gap-3">
                <div className={iconContainerClass}>
                  <Handshake size={ICON_SIZE} strokeWidth={GLOBAL_STROKE_WIDTH} />
                </div>
                <div className="min-w-0">
                  <p className={labelClass}>Member Since</p>
                  <p className={`${valueClass} truncate`}>{customerDetails.memberSince}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={iconContainerClass}>
                  <MapPin size={ICON_SIZE} strokeWidth={GLOBAL_STROKE_WIDTH} />
                </div>
                <div className="min-w-0">
                  <p className={labelClass}>Branch Name</p>
                  <p className={`${valueClass} truncate`}>{customerDetails.branchName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={iconContainerClass}>
                  <IdCard size={ICON_SIZE} strokeWidth={GLOBAL_STROKE_WIDTH} />
                </div>
                <div className="min-w-0">
                  <p className={labelClass}>Customer Type</p>
                  <p className={`${valueClass} truncate`}>Individual</p>
                </div>
              </div>
            </div>

            {/* GRID 2: Contact Information - 3-column layout - gap-y reduced from 4 to 1, pt reduced from 8 to 5 */}
            <div className="grid grid-cols-3 gap-x-8 gap-y-1 w-full border-t border-gray-100 pt-5">
              {/* Mobile No */}
              <div className="flex items-center gap-3">
                <div className={contactIconContainerClass}>
                  <Smartphone size={ICON_SIZE} strokeWidth={GLOBAL_STROKE_WIDTH} />
                </div>
                <div className="min-w-0">
                  <p className={labelClass}>Mobile No</p>
                  <p className={`${valueClass} truncate`}>{customerDetails.mobileNo}</p>
                </div>
              </div>

              {/* Phone No */}
              <div className="flex items-center gap-3">
                <div className={contactIconContainerClass}>
                  <Phone size={ICON_SIZE} strokeWidth={GLOBAL_STROKE_WIDTH} />
                </div>
                <div className="min-w-0">
                  <p className={labelClass}>Phone No</p>
                  <p className={`${valueClass} truncate`}>{customerDetails.phoneNo}</p>
                </div>
              </div>

              {/* Email Address */}
              <div className="flex items-center gap-3">
                <div className={contactIconContainerClass}>
                  <Mail size={ICON_SIZE} strokeWidth={GLOBAL_STROKE_WIDTH} />
                </div>
                <div className="min-w-0">
                  <p className={labelClass}>Email Address</p>
                  <p className={`${valueClass} truncate`}>{customerDetails.webId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TRANSACTION DETAILS */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-5 pb-5 pt-7 flex flex-col gap-5 flex-1 overflow-y-auto no-scrollbar scroll-grid">
        <div className="flex justify-between items-center">
          <h2 className="text-[#001D4A] font-bold text-[15px] uppercase tracking-tight">Transaction Details</h2>
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1 text-gray-500 text-[9px] font-medium hover:text-[#0056D2] transition-colors mr-1 outline-none"
          >
            <Clock size={12} className="ml-0.5" /> Alerts History
          </button>
        </div>

        <div className="border border-gray-200 rounded-md p-3 relative shrink-0">
          <div className="absolute -top-3 left-4 bg-white px-2">
            <span className="text-[#FF0000] text-[9px] font-bold uppercase">{alert.type}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-0.5 text-[9px]">
            <DetailRow label="Trns Code" value={alert.trnCode} />
            <DetailRow label="Account Type" value={accountType} />
            <DetailRow label="Trns Date" value={alert.date} />
            <DetailRow label="Account No" value={accountNo} />
            <DetailRow label="Trns Time" value={alert.time} />
            <DetailRow label="Initiation Channel" value={initiationChannel} />
            <DetailRow label="Trns Amount" value={alert.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
            {alert.type === 'Cash Withdrawal' ? (
              <DetailRow label="ATM Number" value={dynamicDetails?.atmNo || '000-0000'} />
            ) : alert.type === 'Online Purchase' ? (
              <DetailRow label="Website Name" value={dynamicDetails?.websiteName || 'Global Mall'} />
            ) : alert.type === 'Instant Transfer' ? (
              <DetailRow label="Beneficiary Name" value={dynamicDetails?.beneficiaryName || 'Receiver'} />
            ) : (
              <DetailRow label="POS Number" value={SELECTED_TRANSACTION.posNumber} />
            )}
            <DetailRow label="Currency" value={alert.currency} />
            {alert.type === 'Cash Withdrawal' ? (
              <DetailRow label="Bank Name" value={dynamicDetails?.bank || 'Local Bank'} />
            ) : alert.type === 'Online Purchase' ? (
              <DetailRow label="Website Country" value={dynamicDetails?.websiteCountry || 'Jordan'} />
            ) : alert.type === 'Instant Transfer' ? (
              <DetailRow label="Bank Name" value={dynamicDetails?.transferBank || 'Global Bank'} />
            ) : (
              <DetailRow label="Merchant Name" value={SELECTED_TRANSACTION.merchantName} />
            )}
            <DetailRow label="Country" value={alert.country} />
            {alert.type === 'Cash Withdrawal' ? (
              <DetailRow label="City" value={dynamicDetails?.city || 'Main City'} />
            ) : alert.type === 'Online Purchase' ? (
              <DetailRow label="Website URL" value={dynamicDetails?.websiteUrl || 'www.merchant.com'} />
            ) : alert.type === 'Instant Transfer' ? (
              <DetailRow label="IBAN" value={dynamicDetails?.iban || 'JO00BANK000000000000000000'} />
            ) : (
              <DetailRow label="Merchant Type" value={SELECTED_TRANSACTION.merchantType} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 shrink-0">
          <div className="border border-gray-200 rounded-md pt-2 pb-1.5 px-3 relative h-[108px]">
            <div className="absolute -top-3 left-4 bg-white px-2">
              <span className="text-[#FF0000] text-[9px] font-bold uppercase">Alert Trigger ( {alert.source} )</span>
            </div>
            <div className="mt-1 max-h-full overflow-y-auto no-scrollbar scroll-grid">
              <ul className="flex flex-col gap-0.5">
                {AI_TRIGGERS.map((trigger, i) => (
                  <li key={i} className="flex items-center justify-between text-[9px]">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-700 font-bold w-6 shrink-0">{trigger.percentage}%</span>
                      <span className="text-gray-500 truncate max-w-[120px]">{trigger.label}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border border-gray-200 rounded-md pt-2 pb-1.5 px-3 relative h-[108px]">
            <div className="absolute -top-3 left-4 bg-white px-2">
              <span className="text-[#FF0000] text-[9px] font-bold uppercase">Preventive Actions</span>
            </div>
            <div className="mt-1 flex flex-col gap-1 max-h-full overflow-y-auto no-scrollbar scroll-grid">
              {sortedPreventiveActions.map((action, index) => (
                <ActionRow key={index} label={action.label} sub={action.sub} status={action.status} />
              ))}
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-md pt-5 pb-4 px-2 relative shrink-0">
          <div className="absolute -top-3 left-4 bg-white px-2 h-6 flex items-center">
            <span className="text-[#FF0000] text-[10px] font-bold uppercase leading-none">Alert Management</span>
          </div>
          <div className="flex gap-5 items-center">
            <div className="flex-1 ml-3 relative border border-gray-200 rounded-lg h-[52px] bg-white">
              <textarea 
                className="w-full h-full bg-transparent text-blue-800 text-[9px] italic leading-tight p-2 resize-none outline-none no-scrollbar placeholder:text-gray-300 rounded-lg overflow-y-auto"
                placeholder="Enter customer feedback here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 w-24 shrink-0 mr-3">
              <button onClick={() => onUpdateStatus(alert.id, AlertStatus.CONFIRMED_LEGITIMATE)} className="w-full py-1 bg-[#00CC00] text-white rounded-full font-bold text-[8px] shadow-sm hover:bg-green-700 transition-all uppercase tracking-tight">Legitimate</button>
              <button onClick={() => onUpdateStatus(alert.id, AlertStatus.CONFIRMED_FRAUD)} className="w-full py-1 bg-[#FF0000] text-white rounded-full font-bold text-[8px] shadow-sm hover:bg-red-700 transition-all uppercase tracking-tight">Fraud</button>
            </div>
          </div>
        </div>
      </div>

      <AlertDetailsModal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} alert={historyAlertForDetails} />
      <AlertsHistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        alerts={historyAlerts}
      />
    </>
  );
};

const DetailRow: React.FC<{ label: string; value: string; valueColor?: string }> = ({ label, value, valueColor = 'text-[#0056D2]' }) => (
  <div className="flex justify-between items-center py-0 border-b border-gray-50 last:border-0">
    <span className="text-gray-400 font-medium whitespace-nowrap">{label} :</span>
    <span className={`${valueColor} font-bold text-right ml-4 truncate`}>{value}</span>
  </div>
);

const ActionRow: React.FC<{ label: string; sub: string; status: 'success' | 'error' }> = ({ label, sub, status }) => (
  <div className="flex items-center justify-between border-b border-gray-50 pb-0.5 last:border-0 last:pb-0">
    <div className="flex flex-col min-w-0">
      <span className="text-[#0056D2] font-bold text-[8px] leading-tight truncate">{label}</span>
      <span className="text-gray-400 text-[7px] font-medium leading-tight truncate">{sub}</span>
    </div>
    <div className="relative group shrink-0 ml-2 cursor-help flex items-center">
      {status === 'success' ? (
        <>
          <CheckCircle2 size={11} className="text-[#00CC00]" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-[#FFFBEB] text-[#00CC00] text-[7px] font-bold px-1.5 py-0.5 rounded border border-yellow-200 shadow-sm whitespace-nowrap z-20">Active</div>
        </>
      ) : (
        <>
          <XCircle size={11} className="text-[#FF0000]" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-[#FFFBEB] text-[#FF0000] text-[7px] font-bold px-1.5 py-0.5 rounded border border-yellow-200 shadow-sm whitespace-nowrap z-20">Blocked</div>
        </>
      )}
    </div>
  </div>
);

export default TransactionDetails;