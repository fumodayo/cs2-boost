export interface IDataListHeaders {
  translationKey: string;
  value: string;
  isSort?: boolean;
}
const pendingBoostsHeaders: IDataListHeaders[] = [
  { translationKey: "order", value: "order" },
  { translationKey: "id", value: "boost_id", isSort: true },
  { translationKey: "status", value: "status" },
  { translationKey: "price", value: "price", isSort: true },
  { translationKey: "last_updated", value: "updatedAt", isSort: true },
  { translationKey: "actions", value: "actions" },
];
const progressBoostsHeaders: IDataListHeaders[] = [
  { translationKey: "order", value: "order" },
  { translationKey: "id", value: "boost_id", isSort: true },
  { translationKey: "status", value: "status" },
  { translationKey: "price", value: "price", isSort: true },
  { translationKey: "last_updated", value: "updatedAt", isSort: true },
  { translationKey: "actions", value: "actions" },
];
const ordersHeaders: IDataListHeaders[] = [
  { translationKey: "order", value: "order" },
  { translationKey: "id", value: "boost_id", isSort: true },
  { translationKey: "status", value: "status" },
  { translationKey: "price", value: "price", isSort: true },
  { translationKey: "assign_partner", value: "assign_partner" },
  { translationKey: "last_updated", value: "updatedAt", isSort: true },
  { translationKey: "actions", value: "actions" },
];
const walletHeaders: IDataListHeaders[] = [
  { translationKey: "order", value: "order" },
  { translationKey: "payment_method", value: "payment_method" },
  { translationKey: "status", value: "status", isSort: true },
  { translationKey: "transaction_id", value: "receipt_id", isSort: true },
  { translationKey: "amount", value: "price", isSort: true },
  { translationKey: "last_updated", value: "updatedAt", isSort: true },
];
const usersHeaders: IDataListHeaders[] = [
  { translationKey: "user", value: "username", isSort: true },
  { translationKey: "role", value: "role", isSort: false },
  { translationKey: "status", value: "status", isSort: false },
  { translationKey: "created_at", value: "createdAt", isSort: true },
  { translationKey: "actions", value: "actions", isSort: false },
];
const adminOrdersHeaders: IDataListHeaders[] = [
  { translationKey: "order", value: "order" },
  { translationKey: "id", value: "boost_id", isSort: true },
  { translationKey: "status", value: "status" },
  { translationKey: "price", value: "price", isSort: true },
  { translationKey: "customer", value: "customer", isSort: true },
  { translationKey: "partner", value: "partner", isSort: true },
  { translationKey: "last_updated", value: "updatedAt", isSort: true },
];
const transactionsHeaders: IDataListHeaders[] = [
  { translationKey: "user", value: "info", isSort: false },
  { translationKey: "type", value: "type", isSort: false },
  { translationKey: "amount", value: "amount", isSort: true },
  { translationKey: "order", value: "order", isSort: false },
  { translationKey: "created_at", value: "createdAt", isSort: true },
  { translationKey: "actions", value: "actions", isSort: false },
];
const partnerTransactionsHeaders: IDataListHeaders[] = [
  { translationKey: "order", value: "order", isSort: false },
  { translationKey: "type", value: "type", isSort: false },
  { translationKey: "amount", value: "amount", isSort: true },
  { translationKey: "created_at", value: "createdAt", isSort: true },
];
export {
  pendingBoostsHeaders,
  progressBoostsHeaders,
  ordersHeaders,
  walletHeaders,
  usersHeaders,
  adminOrdersHeaders,
  transactionsHeaders,
  partnerTransactionsHeaders,
};