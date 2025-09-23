import React from "react";
import { useTranslation } from "react-i18next";
import { listOfStatus } from "~/constants/order";
import { IOrder } from "~/types";
import RowTable from "./RowTable";
import Badge from "../../Badge";
import cn from "~/libs/utils";

const statusConfig: Record<string, { className: string }> = {
  COMPLETED: {
    className:
      "text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-700/50 dark:bg-green-900/20",
  },
  IN_PROGRESS: {
    className:
      "text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-700/50 dark:bg-blue-900/20",
  },
  CANCEL: {
    className:
      "text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-700/50 dark:bg-red-900/20",
  },
  WAITING: {
    className:
      "text-amber-600 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-700/50 dark:bg-amber-900/20",
  },
  default: {
    className:
      "text-gray-600 border-gray-200 bg-gray-50 dark:text-gray-400 dark:border-gray-700/50 dark:bg-gray-900/20",
  },
};

const RowOrderStatus: React.FC<IOrder> = ({ status }) => {
  const { t } = useTranslation();
  const currentStatus = listOfStatus.find((item) => item.value === status);

  if (!currentStatus) return <RowTable>—</RowTable>;

  const { icon: Icon, label } = currentStatus;
  const config = statusConfig[status] || statusConfig.default;

  return (
    <RowTable>
      <Badge
        variant="outline"
        className={cn("inline-flex items-center rounded-md gap-2", config.className)}
      >
        <Icon className="h-3.5 w-3.5" />
        <span>{t(`Globals.Order.status.${label}`)}</span>
      </Badge>
    </RowTable>
  );
};

export default RowOrderStatus;
