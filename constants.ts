
import { Alert, AlertStatus, TransactionDetail, Trigger } from './types';

export const COLORS = {
  primary: '#002060',
  secondary: '#0056D2',
  fraud: '#FF0000',
  legitimate: '#00CC00',
  pending: '#00AEEF',
  sidebar: '#001B4B',
  grayText: '#94A3B8',
};

const MOCK_NAMES = [
  'Ayman Khalid Al-Saadi', 'Fatima Hassan Al-Mansoori', 'Omar Zaid Al-Fayez', 'Laila Mahmoud Al-Gharbi',
  'Zaid Ibrahim Al-Hashimi', 'Noura Saleh Al-Dosari', 'Mohammed Rashid Al-Harbi', 'Sarah Ahmed Al-Otaibi',
  'Abdullah Youssef Al-Ghamdi', 'Mariam Khalid Al-Mutairi', 'Hassan Ali Al-Jaber', 'Reem Nasser Al-Qahtani',
  'Sultan Falah Al-Shammari', 'Dalal Mohammad Al-Bahar', 'Fahad Abdullah Al-Zahrani', 'Amna Hassan Al-Sowaidi',
  'Khaled Omar Al-Marri', 'Shamma Rashid Al-Mazrouei', 'Yousef Ahmed Al-Enezi', 'Huda Saleh Al-Ghoson'
];

const START_TIMESTAMP = new Date(2025, 8, 15, 8, 0, 0).getTime();
const END_TIMESTAMP = new Date(2025, 8, 15, 15, 0, 0).getTime();

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
const getRandomTrnCode = () => 'T' + Math.floor(100000 + Math.random() * 900000).toString();

export const MOCK_ALERTS: Alert[] = Array.from({ length: 500 }).map((_, i) => {
  const trnTimestamp = START_TIMESTAMP + (i * (END_TIMESTAMP - START_TIMESTAMP) / 500);
  const alertTimestamp = trnTimestamp + (Math.random() * 60000); 
  
  const trnDt = formatDateTime(trnTimestamp);
  const alertDt = formatDateTime(alertTimestamp);
  
  const source: 'AI' | 'RB' | 'IC' = i % 3 === 0 ? 'AI' : (i % 3 === 1 ? 'RB' : 'IC');
  
  const alertDataMap = {
    'AI': 'Anomaly: Behavioral spending frequency deviates from established customer baseline.',
    'RB': 'Rule: Transaction amount exceeds daily card limit for non-authenticated POS.',
    'IC': 'Inbound: Customer flagged a suspected unauthorized login attempt on the mobile app.'
  };

  const type = i % 2 === 0 ? 'Online Purchase' : 'Direct Purchase';

  return {
    id: `AL-20250915-${i.toString().padStart(4, '0')}`,
    trnCode: getRandomTrnCode(),
    customerName: MOCK_NAMES[i % MOCK_NAMES.length],
    cif: (12345600 + (i % 20)).toString(),
    date: trnDt.date,
    time: trnDt.time,
    alertDate: `${alertDt.date} ${alertDt.time}`,
    type,
    country: 'Saudi Arabia',
    amount: getRandomAmount(200, 3500),
    currency: 'SAR',
    source,
    status: AlertStatus.PENDING,
    alertData: alertDataMap[source],
    accountNo: '4411-7610-7051-5151',
    accountType: 'Credit Card',
    channel: type === 'Online Purchase' ? 'E-Commerce' : 'POS',
    merchantName: i % 2 === 0 ? 'Amazon SA' : 'Jarir Bookstore',
  };
}).sort((a, b) => b.id.localeCompare(a.id));

export const AI_TRIGGERS: Trigger[] = [
  { percentage: 32, label: 'Transaction Country Outlier' },
  { percentage: 18, label: 'Merchant Category Deviation' },
  { percentage: 15, label: 'Spending Volume Anomaly' },
  { percentage: 10, label: 'Frequency Pattern Deviation' },
  { percentage: 8, label: 'Non-Typical Channel Usage' },
];
