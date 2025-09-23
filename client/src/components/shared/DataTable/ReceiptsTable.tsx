import React from "react";
import { useTranslation } from "react-i18next";
import { IDataListHeaders } from "~/constants/headers";
import { IOrder, IReceipt } from "~/types";
import { formatDistanceDate, formatMoney } from "~/utils";
import DataTable from "./DataTable";
import {
  RowBoost,
  RowPaymentMethod,
  RowReceiptStatus,
  RowTable,
} from "./partials";

interface ReceiptsTableProps {
  receipts: IReceipt[];
  headers: IDataListHeaders[];
  toggleColumn: (value: string) => void;
}

const ReceiptsTable: React.FC<ReceiptsTableProps> = ({
  receipts,
  headers,
  toggleColumn,
}) => {
  const { i18n } = useTranslation();

  return (
    <DataTable
      headers={headers}
      toggleColumn={toggleColumn}
      itemCount={receipts.length}
    >
      {receipts.map((receipt) => (
        <tr
          key={receipt.receipt_id}
          className="border-b border-border transition-colors hover:bg-muted/50"
        >
          {headers.find((col) => col.value === "order") && (
            <RowBoost boost={receipt.order as IOrder} />
          )}

          {headers.find((col) => col.value === "payment_method") && (
            <RowPaymentMethod payment_method={receipt.payment_method} />
          )}

          {headers.find((col) => col.value === "status") && (
            <RowReceiptStatus status={receipt.status} />
          )}

          {headers.find((col) => col.value === "receipt_id") && (
            <RowTable className="text-muted-foreground">
              #{receipt.receipt_id}
            </RowTable>
          )}

          {headers.find((col) => col.value === "price") && (
            <RowTable className="font-semibold text-foreground">
              {formatMoney(receipt.price, "vnd")}
            </RowTable>
          )}

          {headers.find((col) => col.value === "updatedAt") && (
            <RowTable className="text-muted-foreground">
              {formatDistanceDate(receipt.updatedAt, i18n.language)}
            </RowTable>
          )}
        </tr>
      ))}
    </DataTable>
  );
};

export default ReceiptsTable;
