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

export interface Order {
  options?: Array<string>;
  title?: title;
  boost_id?: string;
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
}
