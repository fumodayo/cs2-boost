import { IPaginatedResponse, IUser } from ".";

/**
 * @file payout.types.ts
 * @description Type definitions for the Payout model and related API responses.
 */
export const PAYOUT_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  DECLINED: "DECLINED",
} as const;

export type PayoutStatus = (typeof PAYOUT_STATUS)[keyof typeof PAYOUT_STATUS];

/**
 * @interface IPayout
 * @description Represents a payout request object.
 */
export interface IPayout {
  _id: string;
  partner: IUser;
  amount: number;
  status: PayoutStatus;
  processed_by?: IUser;
  transaction?: string;
  createdAt: string;
  updatedAt: string;
}

export type IPaginatedPayoutsResponse = IPaginatedResponse<IPayout>;

export interface IServiceActionResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
