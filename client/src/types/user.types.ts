import { ROLE, IP_STATUS } from "./constants";
import type { ObjectValues } from "./constants";

export interface IIPAddress {
  _id?: string;
  ip_location: string;
  device: string;
  country: string;
  status: ObjectValues<typeof IP_STATUS>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISocialLink {
  _id?: string;
  type: string;
  link: string;
}

export interface IUser {
  _id: string;
  username: string;
  email_address: string;
  user_id: string;
  profile_picture: string;
  role: ObjectValues<typeof ROLE>[];
  is_verified: boolean;
  is_banned: boolean;
  ban_reason: string | null;
  ban_expires_at: string | null;
  full_name?: string;
  phone_number?: string;
  address?: string;
  gender?: string;
  date_of_birth?: string;
  cccd_number?: string;
  cccd_issue_date?: string;
  language?: string;
  followers_count: number;
  following: IUser[];
  social_links: ISocialLink[];
  details?: string;
  total_working_time: number;
  total_completion_rate: number;
  total_rating: number;
  total_reviews: number;
  ip_addresses: IIPAddress[];
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateUserPayload {
  username?: string;
  email_address?: string;
  profile_picture?: string;
  social_links?: ISocialLink[];
  details?: string;
}

export interface IChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password?: string;
}

export interface IVerifyUserPayload {
  full_name: string;
  phone_number: string;
  address: string;
  gender: string;
  date_of_birth: string;
  cccd_number: string;
  cccd_issue_date: string;
}

export interface IBanUserPayload {
  reason: string;
  days?: number | null;
}

export interface IUserResponse {
  success: boolean;
  message: string;
  data: IUser;
}
