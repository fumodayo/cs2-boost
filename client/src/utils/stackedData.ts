import { IOrderProps } from "~/types";

export interface ItemStackedProps {
  status?: string;
  amount?: number;
  createdAt?: string;
  price?: number;
}

export interface IStackedProps {
  in_progress: ItemStackedProps[];
  completed: ItemStackedProps[];
  cancel: ItemStackedProps[];
  records?: IOrderProps[];
}

const formatLabels = (items: ItemStackedProps[]) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) =>
    item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-GB")
      : null,
  );
};

const createStackedOrderChart = (
  completed: ItemStackedProps[],
  in_progress: ItemStackedProps[],
  cancel: ItemStackedProps[],
) => ({
  labels: formatLabels(in_progress && completed && cancel),
  datasets: [
    {
      label: "Completed",
      data: completed?.map((item) => item.amount),
      backgroundColor: "#28a745",
    },
    {
      label: "In Progress",
      data: in_progress?.map((item) => item.amount),
      backgroundColor: "#0a6cfb",
    },
    {
      label: "Cancel",
      data: cancel?.map((item) => item.amount),
      backgroundColor: "#dc3545",
    },
  ],
});

export { createStackedOrderChart };
