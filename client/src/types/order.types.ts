import type { IUser } from "./user.types";
import type { IConversation } from "./chat.types";
import type { IReview } from "./meta.types";
import { ORDER_STATUS, ORDER_TYPES, ObjectValues } from "./constants";
import { AxiosResponse } from "axios";
export interface IAccount {
  _id: string;
  user_id: string;
  game: string;
  login: string;
  password: string;
  backup_code?: string;
  createdAt: string;
  updatedAt: string;
}
export interface IStatusHistory {
  status: ObjectValues<typeof ORDER_STATUS>;
  date: string;
  admin_action?: boolean;
  admin_id?: string | IUser;
  action?: string;
  previous_partner?: string | IUser;
  new_partner?: string | IUser;
}
export interface IExtraOption {
  name: string;
  label: string;
  value: number;
}
export interface IOrder {
  _id: string;
  title: string;
  boost_id: string;
  type: ObjectValues<typeof ORDER_TYPES>;
  server: string;
  price: number;
  status: ObjectValues<typeof ORDER_STATUS>;
  status_history: IStatusHistory[];
  game: string;
  options: IExtraOption[];
  begin_rating?: number;
  end_rating?: number;
  begin_rank?: string;
  end_rank?: string;
  begin_exp?: number;
  end_exp?: number;
  total_time?: number;
  user: string | IUser;
  partner?: string | IUser;
  assign_partner?: string | IUser | null;
  account?: string | IAccount;
  review?: string | IReview;
  conversation?: string | IConversation;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}
export interface ICreateOrderPayload {
  title: string;
  type: ObjectValues<typeof ORDER_TYPES>;
  price: number;
  server: string;
  options: IExtraOption[];
  game?: string;
  begin_rating?: number;
  end_rating?: number;
  begin_rank?: string;
  end_rank?: string;
  begin_exp?: number;
  end_exp?: number;
  total_time?: number;
}
export interface IAccountPayload {
  login: string;
  password: string;
  backup_code?: string;
}
export interface IReassignOrderPayload {
  partnerId: string;
}
export interface IPaymentOrderPayload {
  assign_partner?: string;
}
export interface IApiResponse {
  success: boolean;
  message?: string;
  data?: string | IOrder;
}
export interface IOrderRedirectResponse extends IApiResponse {
  order_id: string; 
  boost_id: string; 
}
export type OrderServiceResponse<T = IApiResponse> = Promise<AxiosResponse<T>>;
export type OrderServicePayloadResponse<T = IApiResponse> = Promise<T>;
