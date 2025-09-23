export interface IDataListHeaders {
  label: string;
  value: string;
  isSort?: boolean;
}

const pendingBoostsHeaders: IDataListHeaders[] = [
  {
    label: "order",
    value: "order",
  },
  {
    label: "ID",
    value: "boost_id",
    isSort: true,
  },
  {
    label: "status",
    value: "status",
  },
  {
    label: "price",
    value: "price",
    isSort: true,
  },
  {
    label: "last updated",
    value: "updatedAt",
    isSort: true,
  },
  {
    label: "",
    value: "actions",
  },
];

const progressBoostsHeaders: IDataListHeaders[] = [
  {
    label: "order",
    value: "order",
  },
  {
    label: "ID",
    value: "boost_id",
    isSort: true,
  },
  {
    label: "status",
    value: "status",
  },
  {
    label: "price",
    value: "price",
    isSort: true,
  },
  {
    label: "last updated",
    value: "updatedAt",
    isSort: true,
  },
  {
    label: "",
    value: "actions",
  },
];

const ordersHeaders: IDataListHeaders[] = [
  {
    label: "order",
    value: "order",
  },
  {
    label: "ID",
    value: "boost_id",
    isSort: true,
  },
  {
    label: "status",
    value: "status",
  },
  {
    label: "price",
    value: "price",
    isSort: true,
  },
  {
    label: "assign partner",
    value: "assign_partner",
  },
  {
    label: "last updated",
    value: "updatedAt",
    isSort: true,
  },
  {
    label: "",
    value: "actions",
  },
];

const walletHeaders: IDataListHeaders[] = [
  {
    label: "order",
    value: "order",
  },
  {
    label: "payment method",
    value: "payment_method",
  },
  {
    label: "status",
    value: "status",
    isSort: true,
  },
  {
    label: "transaction id",
    value: "receipt_id",
    isSort: true,
  },
  {
    label: "amount",
    value: "price",
    isSort: true,
  },
  {
    label: "last updated",
    value: "updatedAt",
    isSort: true,
  },
];

const usersHeaders = [
  { label: "user", value: "username", isSort: true },
  { label: "role", value: "role", isSort: false },
  { label: "status", value: "status", isSort: false },
  { label: "created at", value: "createdAt", isSort: true },
  { label: "actions", value: "actions", isSort: false },
];

const adminOrdersHeaders = [
  {
    label: "order",
    value: "order",
  },
  {
    label: "ID",
    value: "boost_id",
    isSort: true,
  },
  {
    label: "status",
    value: "status",
  },
  {
    label: "price",
    value: "price",
    isSort: true,
  },

  {
    label: "customer",
    value: "customer",
    isSort: true,
    isVisible: true,
  },
  {
    label: "partner",
    value: "partner",
    isSort: true,
    isVisible: true,
  },
  {
    label: "last updated",
    value: "updatedAt",
    isSort: true,
  },
];

const transactionsHeaders: IDataListHeaders[] = [
  { label: "user", value: "info", isSort: false },
  { label: "type", value: "type", isSort: false },
  { label: "amount", value: "amount", isSort: true },
  { label: "created at", value: "createdAt", isSort: true },
];

export {
  pendingBoostsHeaders,
  progressBoostsHeaders,
  ordersHeaders,
  walletHeaders,
  usersHeaders,
  adminOrdersHeaders,
  transactionsHeaders,
};
