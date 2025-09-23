import { IUser } from "./user.types";

export interface ILoginPayload {
  identifier: string; // Có thể là username hoặc email
  password?: string;
  ip_location: string;
  country: string;
  device: string;
}

export interface IRegisterPayload {
  email_address: string;
  password: string;
  ip_location: string;
  country: string;
  device: string;
}

export interface IAddUserPayload {
  username: string;
  email_address: string;
  password: string;
  role: string[];
}

export interface IGoogleAuthPayload {
  username: string;
  email_address: string;
  profile_picture?: string;
  ip_location: string;
  country: string;
  device: string;
}

export interface IResetPasswordPayload {
  email_address: string;
  new_password: string;
  ip_location: string;
  country: string;
  device: string;
}

export interface ISignOutPayload {
  id: string;
  ip_location: string;
}

export interface IAuthResponse {
  user: Omit<IUser, "password" | "otp" | "otp_expiry">;
}

export interface IAdminLoginPayload {
  username: string;
  password: string;
}

export interface IRefreshTokenPayload {
  id: string;
  ip_location: string;
}
