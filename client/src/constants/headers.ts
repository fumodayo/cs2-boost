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

export {
  pendingBoostsHeaders,
  progressBoostsHeaders,
  ordersHeaders,
  walletHeaders,
};
