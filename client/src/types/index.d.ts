export type Currency = "vnd" | "usd";
export type Theme = "dark" | "light";

export interface User {
  _id?: string;
  username?: string;
  user_id?: string;
  email?: string;
  profile_picture?: string;
  is_verified?: boolean;
  role?: string;

  // VERIFICATION
  addresses?: string;
  cccd_number?: string;
  cccd_issue_date?: Date;
  date_of_birth?: Date;
  gender?: string;
  phone_number?: string;
  real_name?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface Conversation {
  _id?: string;
  participants?: string[];
  messages?: Message[];
}
export interface Order {
  options?: Array<string>;
  title?: title;
  boost_id?: string;
  booster_id?: string;
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
  user?: string | User;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Account {
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
}
