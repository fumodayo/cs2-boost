import type { IUser } from "./user.types";
import type { IOrder } from "./order.types";
import {
  RECEIPT_STATUS,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  PAYOUT_STATUS,
  ObjectValues,
} from "./constants";

export interface IWallet {
  _id: string;
  owner: string | IUser;
  balance: number;
  escrow_balance: number;
  total_earnings: number;
  total_withdrawn: number;
  pending_withdrawal: number;
  createdAt: string;
  updatedAt: string;
}

export interface ITransaction {
  _id: string;
  user: string | IUser;
  type: ObjectValues<typeof TRANSACTION_TYPE>;
  amount: number;
  description: string;
  status: ObjectValues<typeof TRANSACTION_STATUS>;
  related_order?: string | IOrder;
  related_payout?: string | IPayout;
  createdAt: string;
  updatedAt: string;
}

export interface IPayout {
  _id: string;
  partner: string | IUser;
  amount: number;
  status: ObjectValues<typeof PAYOUT_STATUS>;
  processed_by?: string | IUser;
  transaction?: string | ITransaction;
  createdAt: string;
  updatedAt: string;
}

export interface IPayoutResponse {
  payouts: IPayout[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IReceipt {
  _id: string;
  order: string | IOrder;
  user: string | IUser;
  receipt_id: string;
  payment_method: string;
  price: number;
  status: ObjectValues<typeof RECEIPT_STATUS>;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateVnPayUrlPayload {
  amountInput: number;
  contentPayment: string;
  productTypeSelect: string;
  langSelect: "vn" | "en";
}

export interface IVnPayReturn {
  isSuccess: boolean;
  message: string;
  vnp_Amount?: string;
  vnp_BankCode?: string;
  vnp_CardType?: string;
  vnp_OrderInfo?: string;
  vnp_PayDate?: string;
  vnp_ResponseCode?: string;
  vnp_TmnCode?: string;
  vnp_TransactionNo?: string;
  vnp_TransactionStatus?: string;
  vnp_TxnRef?: string;
  vnp_SecureHash?: string;
}

export interface IPartnerWalletStatsResponse {
  stats: IWallet;
  recentTransactions: ITransaction[];
}

export type IBill = IVnPayReturn;
