import React from "react";
import { Link } from "react-router-dom";
import { FaExchangeAlt } from "react-icons/fa";
import { ITransaction } from "~/types";
import { formatMoney, formatDistanceDate } from "~/utils";
import { Button } from "~/components/ui/Button";
import { useTranslation } from "react-i18next";
import { isUserObject } from "~/utils/typeGuards";

const transactionTypeClasses: Record<string, string> = {
  SALE: "text-green-500",
  PAYOUT: "text-blue-500",
  PARTNER_COMMISSION: "text-teal-500",
  PENALTY: "text-orange-500",
  REFUND: "text-yellow-500",
  FEE: "text-gray-500",
};

const RecentTransactions: React.FC<{ transactions: ITransaction[] }> = ({
  transactions,
}) => {
  const { t, i18n } = useTranslation("dashboard_page");

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="flex items-center text-lg font-semibold text-foreground">
          <FaExchangeAlt className="mr-3 text-primary" />
          {t("recent_transactions.title")}
        </h3>
      </div>
      <div className="divide-y divide-border">
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <div
              key={tx._id}
              className="flex items-center justify-between p-4 hover:bg-muted/50"
            >
              {isUserObject(tx.user) && (
                <div className="flex items-center gap-3">
                  <img
                    src={tx.user.profile_picture}
                    alt={tx.user.username}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <p
                      className="max-w-xs truncate text-sm font-medium text-foreground"
                      title={tx.description}
                    >
                      {tx.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tx.user.username} ·{" "}
                      {formatDistanceDate(tx.createdAt, i18n.language)}
                    </p>
                  </div>
                </div>
              )}
              <div className="text-right">
                <p
                  className={`text-sm font-bold ${tx.amount > 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {formatMoney(tx.amount, "vnd")}
                </p>
                <p
                  className={`text-xs font-semibold capitalize ${transactionTypeClasses[tx.type] || "text-muted-foreground"}`}
                >
                  {t(`recent_transactions.types.${tx.type}`, {
                    defaultValue: tx.type,
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {t("recent_transactions.empty")}
          </p>
        )}
      </div>
      <div className="border-t border-border p-4 text-center">
        <Link to="/admin/manage-revenue">
          <Button variant="link">
            {t("recent_transactions.view_all_btn")}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default RecentTransactions;