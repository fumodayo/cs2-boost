import React from "react";
import { ITransaction } from "~/types";
import { Badge } from "~/components/ui/Display";
import cn from "~/libs/utils";
import { useTranslation } from "react-i18next";

const RowTable = ({ children }: { children: React.ReactNode }) => (
  <td className="p-4 align-middle">{children}</td>
);

const transactionTypeStyles: Record<string, string> = {
  SALE: "text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-700/50 dark:bg-green-900/20",
  PAYOUT:
    "text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-700/50 dark:bg-blue-900/20",
  PARTNER_COMMISSION:
    "text-teal-600 border-teal-200 bg-teal-50 dark:text-teal-400 dark:border-teal-700/50 dark:bg-teal-900/20",
  PENALTY:
    "text-orange-600 border-orange-200 bg-orange-50 dark:text-orange-400 dark:border-orange-700/50 dark:bg-orange-900/20",
  REFUND:
    "text-yellow-600 border-yellow-200 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-700/50 dark:bg-yellow-900/20",
  FEE: "text-gray-600 border-gray-200 bg-gray-50 dark:text-gray-400 dark:border-gray-700/50 dark:bg-gray-900/20",
};

const RowTransactionType: React.FC<Pick<ITransaction, "type">> = ({ type }) => {
  const { t } = useTranslation("dashboard_page");
  const className =
    transactionTypeStyles[type] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <RowTable>
      <Badge variant="outline" className={cn("capitalize", className)}>
        {t(`recent_transactions.types.${type}`, type)}
      </Badge>
    </RowTable>
  );
};

export default RowTransactionType;