import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TbEye } from "react-icons/tb";
import { IDataListHeaders } from "~/constants/headers";
import { ITransaction, IOrder } from "~/types";
import { formatDistanceDate, formatMoney } from "~/utils";
import { DataTable } from "~/components/ui";
import {
  RowTable,
  RowTransactionInfo,
  RowTransactionType,
  RowBoost,
} from "./partials";
import { isUserObject } from "~/utils/typeGuards";
interface TransactionTableProps {
  data: ITransaction[] | undefined;
  headers: IDataListHeaders[];
  toggleColumn: (value: string) => void;
  isAdmin?: boolean;
  onTransactionClick?: (transaction: ITransaction) => void;
}
const isOrderObject = (order: string | IOrder | undefined): order is IOrder => {
  return typeof order === "object" && order !== null && "boost_id" in order;
};
const TransactionTable: React.FC<TransactionTableProps> = ({
  data,
  headers,
  toggleColumn,
  isAdmin = true,
  onTransactionClick,
}) => {
  const { t, i18n } = useTranslation(["common"]);
  const renderCellContent = (
    colValue: string,
    tx: ITransaction,
  ): React.ReactNode => {
    switch (colValue) {
      case "info":
        return (
          <RowTransactionInfo
            user={isUserObject(tx.user) ? tx.user : undefined}
            description={tx.description}
          />
        );
      case "type":
        return <RowTransactionType type={tx.type} />;
      case "amount":
        return (
          <RowTable
            className={`font-semibold ${tx.amount > 0 ? "text-green-500" : "text-red-500"}`}
          >
            {tx.amount > 0 ? "+" : ""}
            {formatMoney(tx.amount, "vnd")}
          </RowTable>
        );
      case "order":
        return (
          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
            {isOrderObject(tx.related_order) ? (
              <RowBoost boost={tx.related_order} isAdmin={isAdmin} />
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </td>
        );
      case "createdAt":
        return (
          <RowTable className="text-muted-foreground">
            {formatDistanceDate(tx.createdAt, i18n.language)}
          </RowTable>
        );
      case "actions":
        return (
          <RowTable>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTransactionClick?.(tx);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
            >
              <TbEye size={14} />
              {t("view_details", { defaultValue: "View Details" })}
            </button>
          </RowTable>
        );
      default:
        return <RowTable>-</RowTable>;
    }
  };
  return (
    <DataTable
      headers={headers}
      toggleColumn={toggleColumn}
      itemCount={data?.length || 0}
    >
      {data?.map((tx) => (
        <tr
          key={tx._id}
          className={`border-b border-border transition-colors hover:bg-muted/50 ${onTransactionClick ? "cursor-pointer" : ""}`}
          onClick={() => onTransactionClick?.(tx)}
        >
          {headers.map((col) => (
            <React.Fragment key={col.value}>
              {renderCellContent(col.value, tx)}
            </React.Fragment>
          ))}
        </tr>
      ))}
    </DataTable>
  );
};
export default TransactionTable;