export type Currency = "vnd" | "usd";
export type Theme = "dark" | "light";

interface IPLogger {
  _id?: string;
  country?: string;
  city?: string;
  ip?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListSocialMedia {
  type: string;
  username?: string;
  code?: string;
  link?: string;
}

export interface User {
  _id?: string;
  username?: string;
  user_id?: string;
  email?: string;
  profile_picture?: string;
  is_verified?: boolean;
  role?: string[];
  ip_logger?: IPLogger[];
  social_media?: ListSocialMedia[];

  // VERIFICATION
  addresses?: string;
  cccd_number?: string;
  cccd_issue_date?: Date;
  date_of_birth?: Date;
  gender?: string;
  phone_number?: string;
  real_name?: string;
  handle?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface Conversation {
  _id?: string;
  participants?: string[];
  messages?: Message[];
}
export interface Order {
  _id?: string;
  image?: string;
  options?: Array<string>;
  title?: title;
  boost_id?: string;
  booster?: User;
  conversation?: string | Conversation;
  status?: string;
  game?: string;
  type?: string;
  price?: number;
  currency?: string;
  // Farm Exp
  start_exp?: number;
  end_exp?: number;
  // Premier
  server?: string;
  start_rating?: number;
  end_rating?: number;
  // Wingman
  start_rank?: string;
  end_rank?: string;
  user?: User;
  createdAt?: Date;
  updatedAt?: Date;

  account?: Account;
}

export interface Account {
  _id?: string;
  user_id?: string;
  username?: string;
  password?: string;
  backup_code?: string;
}

export interface Message {
  _id?: string;
  sender_id?: string;
  receiver_id?: string;
  message?: string;
  createdAt?: Date;
}

export interface Notify {
  _id?: string;
  sender?: User | null;
  receiver?: User | null;
  boost_id?: string;
  content?: string;
  isRead?: boolean;
  type?: string;
  createdAt?: string;
}
type Income = {
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type Amount = {
  amount: number;
  createdAt: string;
  updatedAt: string;
};

export interface Revenue {
  _id?: string;
  user?: User | null;
  income: Array<Income>;
  money_pending: Array<Amount>;
  money_profit: Array<Amount>;
  money_fine: Array<Amount>;
  orders_pending: Array<Order>;
  orders_completed: Array<Order>;
  orders_cancel: Array<Order>;
  total_order_pending: Array<Amount>;
  total_order_completed: Array<Amount>;
  total_order_cancel: Array<Amount>;
  total_money_pending: number;
  total_money_profit: number;
  total_money_fine: number;
  total_money: number;
  createdAt?: string;
  updatedAt?: string;
}
