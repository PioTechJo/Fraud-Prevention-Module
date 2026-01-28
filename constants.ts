
import { Alert, AlertStatus, TransactionDetail, Trigger } from './types';

export const COLORS = {
  primary: '#001D4A',
  secondary: '#0056D2',
  fraud: '#FF0000',
  legitimate: '#00CC00',
  pending: '#00AEEF',
  sidebar: '#001B4B',
};

// strictly follow the 3-part rule (First Middle Last) for Arab names
const MOCK_NAMES = [
  'Ayman Khalid Al-Saadi', 'Fatima Hassan Al-Mansoori', 'Omar Zaid Al-Fayez', 'Laila Mahmoud Al-Qasimi',
  'Zaid Ibrahim Al-Hashimi', 'Noura Saleh Al-Dosari', 'Mohammed Rashid Al-Maktoum', 'Sarah Ahmed Al-Thani',
  'Abdullah Youssef Al-Sabah', 'Mariam Khalid Al-Saud', 'Hassan Ali Al-Jaber', 'Reem Nasser Al-Kuwari',
  'Sultan Falah Otaibi', 'Dalal Mohammad Al-Bahar', 'Fahad Abdullah Al-Ghamdi', 'Amna Hassan Al-Sowaidi',
  'Khaled Omar Al-Marri', 'Shamma Rashid Al-Mazrouei', 'Yousef Ahmed Al-Ahmad', 'Huda Saleh Al-Ghoson',
  'Bashar Ibrahim Masri', 'Rania Abdullah Abdallah', 'Ziad Mansour Rahbani', 'Fairuz Nasri Nahar',
  'Saif Islam Qaddafi', 'Mona Mahmoud Shazly', 'Tamer Hosny Al-Fayed', 'Nancy Nabil Ajram',
  'Elissa Zakaria Al-Khoury', 'Amr Abdel Diab', 'Majid Mohammed Al-Futtaim', 'Lubna Khalid Al-Qasimi',
  'Sheikha Mohammad Al-Bahr', 'Raja Easa Gurg', 'Salwa Idriss Al-Idrisi', 'Nabil Abdullah Al-Arabi',
  'Walid Ahmed Al-Ibrahimi', 'Nagieb Abdel Mahfouz', 'Ghada Ahmed Samman', 'Ali Ahmad Said',
  'Mahmoud Ahmed Ali', 'Nizar Tawfiq Qabbani', 'Ahlam Mosteghanemi Hadi', 'Gibran Khalil Gibran',
  'Edward Wadie Said', 'Saber Mohammad Rebai', 'Kadim Jabbar Sahir', 'Assala Nasri Mustafa',
  'Wael Antoine Kfoury', 'Myriam Fares Al-Junaibi', 'Hussain Mohammad Al-Jassmi', 'Balqees Ahmed Al-Fathi',
  'Mohamed Abdu Othman', 'Talal Maddah Sharif', 'Ebadah Johar Al-Maliki', 'Rashed Abdel Majed',
  'Abdul Majeed Abdullah', 'Nawal Kuwaitia Al-Sabah', 'Abdallah Rowaished Al-Mulla', 'Ahlam Shamsi Al-Falasi',
  'Diana Joseph Haddad', 'Yara Ibrahim Barkawi', 'Carole Antoine Samaha', 'Maya Diab Hashem',
  'Haifa Mohammad Wehbe', 'Nadine Nassib Njeim', 'Qusai Khouli Deen', 'Taim Abdo Hasan',
  'Bassem Yakhour Al-Khatib', 'Sulafa Mohammad Memar', 'Amal Mustafa Arafa', 'Kosai Rashid Khauli',
  'Dhafer Abidine Al-Mawla', 'Hend Sabry Al-Mawla', 'Eyad Nassar Al-Urduni', 'Saba Mubarak Al-Hashimi',
  'Muna Mustafa Wassef', 'Yousra Mohammad Al-Masri', 'Adel Emam Al-Bakri', 'Ahmed Zaki Al-Fawwaz',
  'Nour Sherif Al-Gazzar', 'Mahmoud Abdel Aziz', 'Yehia Shamy Al-Fakharany', 'Laila Ahmed Al-Saati',
  'Elham Mohammad Shahin', 'Hala Sedki Al-Roubi', 'Mona Mohammad Zaki', 'Ahmed Helmy Al-Sayed',
  'Karim Abdel Aziz Amin', 'Ahmed Sakka Al-Wasli', 'Amir Mohammad Karara', 'Mohamed Ramadan Al-Prince',
  'Asser Mahmoud Yassin', 'Mustafa Ali Bakr', 'Salem Hassan Al-Jarrah', 'Zaki Fadi Al-Haddad',
  'Ghassan Khalil Rahma', 'Sami Anwar Mansour', 'Rami Youssef Badawi', 'Anas Tariq Al-Said',
  'Hamza Khaled Darwish', 'Bilal Omar Al-Zubi', 'Firas Ahmed Al-Najjar'
];

// Simulation Reference Date: 15 Sept 2025
const START_TIMESTAMP = new Date(2025, 8, 15, 8, 0, 0).getTime();
const END_TIMESTAMP = new Date(2025, 8, 15, 14, 37, 15).getTime();

// Requested Historical range: 10 Jun 2025 to 14 Sep 2025
const HIST_START = new Date(2025, 5, 10, 0, 0, 0).getTime(); 
const HIST_END = new Date(2025, 8, 14, 23, 59, 59).getTime();

const formatDateTime = (timestamp: number) => {
  const dateObj = new Date(timestamp);
  const d = dateObj.getDate().toString().padStart(2, '0');
  const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const y = dateObj.getFullYear();
  const hh = dateObj.getHours().toString().padStart(2, '0');
  const mm = dateObj.getMinutes().toString().padStart(2, '0');
  const ss = dateObj.getSeconds().toString().padStart(2, '0');
  return { date: `${d}/${m}/${y}`, time: `${hh}:${mm}:${ss}` };
};

const getRandomAmount = (min: number, max: number) => Math.random() * (max - min) + min;
const getRandomTrnCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. Generate active alerts for "Today" (137 items)
const rawTodayAlerts = Array.from({ length: 137 }).map((_, i) => {
  let status: AlertStatus;
  if (i < 74) status = AlertStatus.PENDING;
  else if (i < 74 + 30) status = AlertStatus.CONFIRMED_FRAUD;
  else status = AlertStatus.CONFIRMED_LEGITIMATE;

  const nameIndex = i % MOCK_NAMES.length;
  const customerName = MOCK_NAMES[nameIndex];
  const cif = `${12345600 + nameIndex}`;
  const timestamp = START_TIMESTAMP + Math.random() * (END_TIMESTAMP - START_TIMESTAMP);
  const { date, time } = formatDateTime(timestamp);

  let currency, amount, country;
  const trnTypes = ['Cash Withdrawal', 'Direct Purchase', 'Online Purchase', 'Instant Transfer'];
  if (i % 4 === 0) { currency = 'JOD'; amount = getRandomAmount(25, 450); country = 'Jordan'; }
  else if (i % 4 === 1) { currency = 'SAR'; amount = getRandomAmount(150, 3400); country = 'Saudi Arabia'; }
  else if (i % 4 === 2) { currency = 'AED'; amount = getRandomAmount(150, 5500); country = 'UAE'; }
  else { currency = 'EGP'; amount = getRandomAmount(50, 2000); country = 'Egypt'; }

  return {
    id: `AL-${i}`,
    trnCode: getRandomTrnCode(),
    customerName,
    cif,
    date,
    time,
    type: trnTypes[Math.floor(Math.random() * trnTypes.length)],
    country,
    amount,
    currency,
    source: (i % 2 === 0 ? 'AI' : 'RB') as 'AI' | 'RB',
    status,
    _timestamp: timestamp,
  };
});

// 2. Extract unique customers from today's list
const uniqueCustomers = Array.from(new Set(rawTodayAlerts.map(a => a.cif))).map(cif => {
  const alert = rawTodayAlerts.find(a => a.cif === cif);
  return { cif, name: alert?.customerName || '' };
});

// 3. Generate 0 to 8 historical rows for each unique customer
const historicalAlerts: any[] = [];
uniqueCustomers.forEach(({ cif, name }) => {
  const rowCount = Math.floor(Math.random() * 9); 
  
  for (let j = 0; j < rowCount; j++) {
    const timestamp = HIST_START + Math.random() * (HIST_END - HIST_START);
    const { date, time } = formatDateTime(timestamp);
    const source: 'AI' | 'RB' = Math.random() > 0.5 ? 'AI' : 'RB';
    // Ensure historical status is only Confirmed Fraud or Confirmed Legitimate
    const status = Math.random() > 0.85 ? AlertStatus.CONFIRMED_FRAUD : AlertStatus.CONFIRMED_LEGITIMATE;

    let currency, amount, country;
    const rnd = Math.random();
    if (rnd < 0.25) { currency = 'JOD'; amount = getRandomAmount(50, 600); country = 'Jordan'; }
    else if (rnd < 0.5) { currency = 'SAR'; amount = getRandomAmount(200, 4000); country = 'Saudi Arabia'; }
    else if (rnd < 0.75) { currency = 'AED'; amount = getRandomAmount(300, 5000); country = 'UAE'; }
    else { currency = 'QAR'; amount = getRandomAmount(100, 2500); country = 'Qatar'; }

    const type = ['Online Purchase', 'Cash Withdrawal', 'Instant Transfer', 'Direct Purchase'][Math.floor(Math.random() * 4)];

    historicalAlerts.push({
      id: `AL-HIST-${cif}-${j}`,
      trnCode: getRandomTrnCode(),
      customerName: name,
      cif,
      date,
      time,
      type,
      country,
      amount,
      currency,
      source,
      status,
      _timestamp: timestamp,
    });
  }
});

// 4. Combine and Sort
export const MOCK_ALERTS: Alert[] = [...rawTodayAlerts, ...historicalAlerts]
  .sort((a, b) => {
    const isTodayA = a.date === '15/09/2025';
    const isTodayB = b.date === '15/09/2025';
    if (isTodayA && !isTodayB) return -1;
    if (!isTodayA && isTodayB) return 1;
    
    if (a.status !== b.status) {
      const statusPriority = { [AlertStatus.PENDING]: 0, [AlertStatus.CONFIRMED_FRAUD]: 1, [AlertStatus.CONFIRMED_LEGITIMATE]: 2 };
      return (statusPriority as any)[a.status] - (statusPriority as any)[b.status];
    }
    return b._timestamp - a._timestamp;
  })
  .map(({ _timestamp, ...alert }) => alert as Alert);

// Fix: Removed 'amountValue' property as it is not present in the TransactionDetail interface.
export const SELECTED_TRANSACTION: TransactionDetail = {
  code: '123456',
  date: '15/09/2025',
  time: '10:23:17',
  amount: '1,255.00',
  currency: 'SAR',
  country: 'Saudi Arabia',
  accountType: 'Credit Card',
  accountNo: '4411-7610-7051-5151',
  channel: 'Point of Sale (POS)',
  posNumber: '01-12345',
  merchantName: 'Jarir Marketing Company',
  merchantType: 'Electronics & Books',
};

export const AI_TRIGGERS: Trigger[] = [
  { percentage: 31, label: 'Transaction Country' },
  { percentage: 22, label: 'Merchant Type' },
  { percentage: 22, label: 'Account Type' },
  { percentage: 10, label: 'Total Purchasing Amount (90 Days)' },
  { percentage: 12, label: 'Transaction Frequency (30 Days)' },
];
