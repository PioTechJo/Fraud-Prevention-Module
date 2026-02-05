
export enum AlertStatus {
  PENDING = 'PENDING',
  CONFIRMED_FRAUD = 'CONFIRMED_FRAUD',
  CONFIRMED_LEGITIMATE = 'CONFIRMED_LEGITIMATE'
}

export interface Alert {
  id: string;
  source: 'AI' | 'RB' | 'IC';
  status: AlertStatus;
  feedback?: string;
  alertData?: string; 
  alertDate?: string;
  // Transaction Joined Data
  trnCode: string;
  date: string;
  time: string;
  type: string;
  amount: number;
  currency: string;
  country: string;
  channel: string;
  merchantName: string;
  merchantType?: string;
  posNumber?: string;
  atmNumber?: string;
  websiteUrl?: string;
  // Account/Customer Joined Data
  accountNo: string;
  accountType: string;
  customerName: string;
  cif: string;
  // New Database Fields from customers table
  segment?: string;
  gender?: string;
  dob?: string;
  nationality?: string;
  memberSince?: string;
  mobile?: string;
  branch?: string;
}

export interface TransactionDetail {
  code: string;
  date: string;
  time: string;
  amount: string;
  currency: string;
  country: string;
  accountType: string;
  accountNo: string;
  channel: string;
  posNumber: string;
  merchantName: string;
  merchantType: string;
}

export interface Trigger {
  percentage: number;
  label: string;
}
