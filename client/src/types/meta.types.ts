import type { IUser } from "./user.types";
import type { IOrder } from "./order.types";
import type { IConversation } from "./chat.types";
import { REPORT_STATUS, VALID_REASONS, ObjectValues } from "./constants";

export type ITheme = "dark" | "light";
export type ICurrency = "vnd" | "usd";

export interface IReview {
  _id: string;
  sender: string | IUser;
  receiver: string | IUser;
  order: string | IOrder;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ISendReviewPayload {
  customer_id: string;
  partner_id: string;
  order_id: string;
  rating: number;
  content: string;
}

export interface IReport {
  _id: string;
  sender: string | IUser;
  receiver: string | IUser;
  handler?: string | IUser | null;
  title: (typeof VALID_REASONS)[number];
  description: string;
  status: ObjectValues<typeof REPORT_STATUS>;
  conversations: {
    client?: string | IConversation | null;
    partner?: string | IConversation | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IDashboardStats {
  kpi: {
    grossRevenue: number;
    netProfit: number;
    totalPayouts: number;
    pendingPayouts: number;
  };
  descriptions: {
    grossRevenue: string;
    netProfit: string;
    totalPayouts: string;
    pendingPayouts: string;
  };
}

export interface IChartDataPoint {
  date: string;
  grossRevenue: number;
  netProfit: number;
}

export interface ISendReportPayload {
  reportedUserId: string;
  title: string;
  description?: string;
}

export type ReportStatus = (typeof REPORT_STATUS)[keyof typeof REPORT_STATUS];
