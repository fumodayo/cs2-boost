import React from "react";
import { IDataListHeaders } from "~/constants/headers";
import { ITransaction } from "~/types";
import { formatDistanceDate, formatMoney } from "~/utils";
import { DataTable } from "~/components/shared";
import { RowTable, RowTransactionInfo, RowTransactionType } from "./partials";
import { useTranslation } from "react-i18next";

interface TransactionTableProps {
  data: ITransaction[] | undefined;
  headers: IDataListHeaders[];
  toggleColumn: (value: string) => void;
  isAdmin?: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  data,
  headers,
  toggleColumn,
}) => {
  const { i18n } = useTranslation();

  return (
    <DataTable
      headers={headers}
      toggleColumn={toggleColumn}
      itemCount={data?.length || 0}
    >
      {data?.map((tx) => (
        <tr
          key={tx._id}
          className="border-b border-border transition-colors hover:bg-muted/50"
        >
          {headers.find((col) => col.value === "info") && (
            <RowTransactionInfo user={tx.user} description={tx.description} />
          )}

          {headers.find((col) => col.value === "type") && (
            <RowTransactionType type={tx.type} />
          )}

          {headers.find((col) => col.value === "amount") && (
            <RowTable
              className={`font-semibold ${tx.amount > 0 ? "text-green-500" : "text-red-500"}`}
            >
              {tx.amount > 0 ? "+" : ""}
              {formatMoney(tx.amount, "vnd")}
            </RowTable>
          )}

          {headers.find((col) => col.value === "createdAt") && (
            <RowTable className="text-right text-muted-foreground">
              {formatDistanceDate(tx.createdAt, i18n.language)}
            </RowTable>
          )}
        </tr>
      ))}
    </DataTable>
  );
};

export default TransactionTable;
