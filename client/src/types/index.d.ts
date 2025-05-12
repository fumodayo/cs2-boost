export type ICurrencyProps = "vnd" | "usd";
export type IThemeProps = "dark" | "light";

export interface IUserProps {
  profile_picture?: string;
  phone_number?: string;
  cccd_number?: string;
  full_name?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  cccd_issue_date?: string;
}

export interface IAccountProps {
  _id?: string;
  user_id?: string;
  game?: string;
  login?: string;
  password?: string;
  backup_code?: string;
}
export interface IIPAddressProps {
  ip_location: string;
  device: string;
  country: string;
  status: "online" | "offline";
  createdAt: Date;
  updatedAt: Date;
}

export interface ICurrentUserProps {
  _id?: string;
  username?: string;
  user_id?: string;
  email_address?: string;
  language?: string;
  ip_addresses?: IIPAddressProps[];
  profile_picture?: string;
  role?: string[];
  is_verified?: boolean;

  // VERIFICATION
  phone_number?: string;
  cccd_number?: string;
  full_name?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  cccd_issue_date?: string;

  total_followers?: number;
  total_working_time?: number;
  total_completion_rate?: number;
  total_rating?: number;
  total_reviews?: number;
  social_links?: ISocialLinkProps[];
  details?: string;
  followers_count: number;
  following: ICurrentUserProps[];

  status?: string;
  otp?: string;
  otp_expired?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISocialLinkProps {
  id: string;
  type: string;
  link: string;
}

export interface IMessageProps {
  _id?: string;
  message?: string;
  created_at?: string;
  sender?: string;
  receiver?: string;
  updatedAt?: Date;
}

export interface IOrderProps {
  _id?: string;
  title?: string;
  boost_id?: string;
  type?: string;
  server?: string;
  price?: number;
  game?: string;
  begin_rating?: number;
  end_rating?: number;
  begin_rank?: string;
  end_rank?: string;
  begin_exp?: number;
  end_exp?: number;
  total_time?: number;
  options?: { name: string; label: string; value: number }[];
  retryCount: number;
  status?: string;
  user?: ICurrentUserProps;
  partner?: ICurrentUserProps;
  assign_partner?: ICurrentUserProps;
  account?: IAccountProps;
  review?: IReviewProps;
  conversation?: IConversationProps;
  updatedAt?: DateTime;
}

export interface IConversationProps {
  _id: string;
  participants: string[];
  messages: IMessageProps[];
}

export interface IReviewProps {
  _id: string;
  order: IOrderProps;
  receiver: ICurrentUserProps;
  sender: ICurrentUserProps;
  content: string;
  rating: number;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface IPaymentProps {
  receipt_id?: string;
  payment_method?: string;
  status?: string;
  price?: number;
  order: IOrderProps;
  updatedAt?: DateTime;
}

export interface INotifyProps {
  sender?: ICurrentUserProps;
  receiver?: ICurrentUserProps;
  content?: string;
  _id?: string;
  boost_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  type?: "new_order" | "boost" | "message";
  isRead?: boolean;
}
