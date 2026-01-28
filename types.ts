export enum AlertStatus {
  PENDING = 'PENDING',
  CONFIRMED_FRAUD = 'CONFIRMED_FRAUD',
  CONFIRMED_LEGITIMATE = 'CONFIRMED_LEGITIMATE'
}

export interface Alert {
  id: string;
  trnCode: string;
  customerName: string;
  cif: string;
  date: string;
  time: string;
  type: string;
  country: string;
  amount: number;
  currency: string;
  source: 'AI' | 'RB';
  status: AlertStatus;
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