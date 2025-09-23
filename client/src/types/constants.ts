export const ROLE = {
  ADMIN: "admin",
  CLIENT: "client",
  PARTNER: "partner",
} as const;

export const ORDER_TYPES = {
  PREMIER: "premier",
  WINGMAN: "wingman",
  LEVEL_FARMING: "level_farming",
} as const;

export const ORDER_STATUS = {
  PENDING: "PENDING",
  WAITING: "WAITING",
  IN_ACTIVE: "IN_ACTIVE",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCEL: "CANCEL",
} as const;

export const RECEIPT_STATUS = {
  COMPLETED: "COMPLETED",
  CANCEL: "CANCEL",
  REFUND: "REFUND",
} as const;

export const IP_STATUS = {
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
} as const;

export const NOTIFY_TYPE = {
  NEW_ORDER: "NEW_ORDER",
  MESSAGE: "MESSAGE",
  BOOST: "BOOST",
  SYSTEM: "SYSTEM",
} as const;

export const VALID_REASONS = [
  "NOT_RESPONDING",
  "OVERCHARGING",
  "SLOW_DELIVERY",
  "LOW_QUALITY",
  "FRAUD",
  "TERMS_VIOLATION",
] as const;

export const REPORT_STATUS = {
  PENDING: "PENDING",
  RESOLVED: "RESOLVED",
  REJECT: "REJECT",
  IN_PROGRESS: "IN_PROGRESS",
} as const;

export const TRANSACTION_TYPE = {
  SALE: "SALE",
  PAYOUT: "PAYOUT",
  REFUND: "REFUND",
  FEE: "FEE",
  PARTNER_COMMISSION: "PARTNER_COMMISSION",
  PENALTY: "PENALTY",
} as const;

export const TRANSACTION_STATUS = {
  COMPLETED: "COMPLETED",
  PENDING: "PENDING",
  FAILED: "FAILED",
} as const;

export const PAYOUT_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  DECLINED: "DECLINED",
} as const;

export const CONVERSATION_STATUS = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
} as const;

export type ObjectValues<T> = T[keyof T];
