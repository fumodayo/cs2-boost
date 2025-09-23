import { IUser, IOrder, ITransaction, IReceipt, IReview } from "./";

export interface IPaginationQuery {
  page?: number;
  "per-page"?: number;
  limit?: number;
  sort?: string;
  q?: string;
  search?: string;
}

export interface IUserQueryParams extends IPaginationQuery {
  role?: string | string[];
  is_verified?: boolean;
}

export interface IOrderQueryParams extends IPaginationQuery {
  type?: string;
  status?: string;
}

export interface IPartnerQueryParams extends IPaginationQuery {
  "star-min"?: number;
  "star-max"?: number;
  "rate-min"?: number;
  "rate-max"?: number;
  partner_id?: string;
}

export interface IPaginatedUsersResponse {
  users: IUser[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface IPaginatedOrdersResponse {
  orders: IOrder[];
  total: number;
}

export interface IPaginatedTransactionsResponse {
  transactions: ITransaction[];
  total: number;
  page: number;
  perPage: number;
}

export interface IPaginatedReceiptsResponse {
  receipts: IReceipt[];
  total: number;
}

export interface IPaginatedPartnersResponse {
  partners: IUser[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IReviewResponse {
  reviews: IReview[];
  currentPage: number;
  totalPages: number;
}

export interface IIpLocation {
  ipAddress?: string;
  countryName?: string;
}

export interface ISuccessResponse {
  success: boolean;
  message: string;
}

export interface IPagination {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface IPaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: IPagination;
}

export interface IArrayDataSuccessResponse<T> {
  message: string;
  success: boolean;
  data: T[];
}

export interface IDataSuccessResponse<T> {
  message: string;
  success: boolean;
  data: T;
}

export interface IDirectResponse {
  message: string;
  success: boolean;
  data: string;
}
