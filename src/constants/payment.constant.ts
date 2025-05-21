export const PAYMENT_TYPE = {
  CASH: 1,
  STRIPE: 2,
  CREDIT: 3,
  PAYPAL: 4,
  ONLINE_BANKING: 5,
  E_WALLET: 6,
  PENDING: null,
} as const;

export const PAYMENT_TYPE_LIST = [
  {value: PAYMENT_TYPE.CASH, label : 'Cash / Bank Transfer'},
  {value: PAYMENT_TYPE.STRIPE, label : 'Stripe'},
  {value: PAYMENT_TYPE.CREDIT, label : 'Credit / Debit Card'},
  {value: PAYMENT_TYPE.PAYPAL, label : 'Paypal'},
  {value: PAYMENT_TYPE.ONLINE_BANKING, label : 'Online Banking'},
  {value: PAYMENT_TYPE.E_WALLET, label : 'E-Wallet / QR Payment'},
];


export const PAYMENT_TYPE_VALUE = {
  1 : 'Cash / Bank Transfer',
  2 : 'Stripe',
  3 : 'Credit / Debit Card',
  4 : 'Paypal',
  5 : 'Online Banking',
  6 : 'E-Wallet / QR Payment',
}
