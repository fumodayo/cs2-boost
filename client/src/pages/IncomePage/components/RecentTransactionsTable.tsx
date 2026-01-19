import { ITransaction } from "~/types";
import { formatMoney } from "~/utils";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RecentTransactionsTable = ({ records }: { records: ITransaction[] }) => {
  const { t } = useTranslation("income_page");
  const navigate = useNavigate();

  const getTypeInfo = (type: string) => {
    const typeMap: Record<string, { labelKey: string; color: string }> = {
      PARTNER_COMMISSION: {
        labelKey: "recent_transactions.types.commission",
        color: "text-green-500",
      },
      PENALTY: {
        labelKey: "recent_transactions.types.penalty",
        color: "text-red-500",
      },
      PAYOUT: {
        labelKey: "recent_transactions.types.payout",
        color: "text-indigo-500",
      },
    };
    return typeMap[type] || { labelKey: type, color: "text-foreground" };
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-foreground">
          {t("recent_transactions.title")}
        </h3>
      </div>
      <div className="overflow-x-auto">
        {records && records.length > 0 ? (
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("recent_transactions.header_description")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("recent_transactions.header_date")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("recent_transactions.header_type")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("recent_transactions.header_amount")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {records.map((transaction) => {
                const typeInfo = getTypeInfo(transaction.type);
                return (
                  <tr key={transaction._id} className="hover:bg-muted/50">
                    <td
                      className="max-w-xs truncate px-6 py-4 text-sm font-medium text-foreground"
                      title={transaction.description}
                    >
                      {transaction.description}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString(
                        "en-GB",
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className={`font-semibold ${typeInfo.color}`}>
                        {t(typeInfo.labelKey, {
                          defaultValue: transaction.type,
                        })}
                      </span>
                    </td>
                    <td
                      className={`whitespace-nowrap px-6 py-4 text-right text-sm font-semibold ${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {formatMoney(transaction.amount, "vnd")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <FaFileInvoiceDollar className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-semibold text-foreground">
              {t("recent_transactions.empty_title")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("recent_transactions.empty_subtitle")}
            </p>
          </div>
        )}
      </div>

      {records && records.length > 0 && (
        <div className="flex items-center justify-center border-t border-border bg-muted/50 px-4 py-3">
          <span
            onClick={() => navigate("/progress-boosts")}
            className="cursor-pointer text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
          >
            {t("recent_transactions.view_more")}
          </span>
        </div>
      )}
    </div>
  );
};

export default RecentTransactionsTable;