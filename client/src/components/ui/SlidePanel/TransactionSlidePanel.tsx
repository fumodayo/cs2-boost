import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TbExternalLink } from "react-icons/tb";
import { ITransaction } from "~/types";
import { TRANSACTION_TYPE } from "~/types/constants";
import { formatMoney, formatDistanceDate } from "~/utils";
import { isUserObject } from "~/utils/typeGuards";
import SlidePanel from "./SlidePanel";
interface TransactionSlidePanelProps {
  transaction: ITransaction | null;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}
const TransactionSlidePanel: React.FC<TransactionSlidePanelProps> = ({
  transaction,
  isOpen,
  onClose,
  isAdmin = false,
}) => {
  const { t, i18n } = useTranslation(["dashboard_page", "common"]);
  if (!transaction) return null;
  const isPositiveAmount = transaction.amount > 0;
  const user = isUserObject(transaction.user) ? transaction.user : null;
  const getOrderLink = () => {
    if (!transaction.related_order) return "#";
    const boostId =
      typeof transaction.related_order === "object" &&
      "boost_id" in transaction.related_order
        ? transaction.related_order.boost_id
        : null;
    const id =
      boostId ||
      (typeof transaction.related_order === "string"
        ? transaction.related_order
        : transaction.related_order._id);
    return isAdmin ? `/admin/manage-orders/${id}` : `/orders/boosts/${id}`;
  };
  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      [TRANSACTION_TYPE.SALE]: t("common:transaction_types.sale", {
        defaultValue: "Sale",
      }),
      [TRANSACTION_TYPE.PAYOUT]: t("common:transaction_types.payout", {
        defaultValue: "Payout",
      }),
      [TRANSACTION_TYPE.REFUND]: t("common:transaction_types.refund", {
        defaultValue: "Refund",
      }),
      [TRANSACTION_TYPE.FEE]: t("common:transaction_types.fee", {
        defaultValue: "Fee",
      }),
      [TRANSACTION_TYPE.PARTNER_COMMISSION]: t(
        "common:transaction_types.partner_commission",
        { defaultValue: "Partner Commission" },
      ),
      [TRANSACTION_TYPE.PENALTY]: t("common:transaction_types.penalty", {
        defaultValue: "Penalty",
      }),
    };
    return typeLabels[type] || type;
  };
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      [TRANSACTION_TYPE.SALE]: "bg-green-500/10 text-green-500",
      [TRANSACTION_TYPE.PAYOUT]: "bg-orange-500/10 text-orange-500",
      [TRANSACTION_TYPE.REFUND]: "bg-yellow-500/10 text-yellow-500",
      [TRANSACTION_TYPE.FEE]: "bg-red-500/10 text-red-500",
      [TRANSACTION_TYPE.PARTNER_COMMISSION]: "bg-purple-500/10 text-purple-500",
      [TRANSACTION_TYPE.PENALTY]: "bg-red-500/10 text-red-500",
    };
    return colors[type] || "bg-muted text-muted-foreground";
  };
  return (
    <SlidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={t("transaction_details", {
        ns: "dashboard_page",
        defaultValue: "Transaction Details",
      })}
    >
      <div className="space-y-6">
        {/* Amount */}
        <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
          <p className="mb-2 text-sm text-muted-foreground">
            {t("amount", { ns: "common", defaultValue: "Amount" })}
          </p>
          <p
            className={`text-3xl font-bold ${isPositiveAmount ? "text-green-500" : "text-red-500"}`}
          >
            {isPositiveAmount ? "+" : ""}
            {formatMoney(transaction.amount, "vnd")}
          </p>
        </div>
        {/* User Info */}
        {user && (
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              {t("user", { ns: "common", defaultValue: "User" })}
            </p>
            <div className="flex items-center gap-3">
              <img
                src={user.profile_picture}
                alt={user.username}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-foreground">{user.username}</p>
                <p className="text-xs text-muted-foreground">
                  {user.email_address}
                </p>
              </div>
              <Link
                to={`/admin/manage-users/${user._id}`}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                <TbExternalLink size={18} />
              </Link>
            </div>
          </div>
        )}
        {/* Transaction Details */}
        <div className="space-y-4">
          {/* Type */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <span className="text-sm text-muted-foreground">
              {t("type", { ns: "common", defaultValue: "Type" })}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getTypeColor(transaction.type)}`}
            >
              {getTypeLabel(transaction.type)}
            </span>
          </div>
          {/* Description */}
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-2 text-sm text-muted-foreground">
              {t("description", { ns: "common", defaultValue: "Description" })}
            </p>
            <p className="text-sm text-foreground">
              {transaction.description || "-"}
            </p>
          </div>
          {/* Status */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <span className="text-sm text-muted-foreground">
              {t("status", { ns: "common", defaultValue: "Status" })}
            </span>
            <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
              {transaction.status}
            </span>
          </div>
          {/* Related Order */}
          {transaction.related_order && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <span className="text-sm text-muted-foreground">
                {t("related_order", {
                  ns: "dashboard_page",
                  defaultValue: "Related Order",
                })}
              </span>
              <Link
                to={getOrderLink()}
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                {t("view_order", { ns: "common", defaultValue: "View Order" })}
                <TbExternalLink size={14} />
              </Link>
            </div>
          )}
          {/* Related Payout */}
          {transaction.related_payout && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <span className="text-sm text-muted-foreground">
                {t("related_payout", {
                  ns: "dashboard_page",
                  defaultValue: "Related Payout",
                })}
              </span>
              <span className="text-sm text-foreground">
                {typeof transaction.related_payout === "string"
                  ? transaction.related_payout
                  : transaction.related_payout._id}
              </span>
            </div>
          )}
          {/* Created At */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <span className="text-sm text-muted-foreground">
              {t("created_at", { ns: "common", defaultValue: "Created At" })}
            </span>
            <span className="text-sm text-foreground">
              {formatDistanceDate(transaction.createdAt, i18n.language)}
            </span>
          </div>
          {/* Transaction ID */}
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-2 text-sm text-muted-foreground">
              {t("transaction_id", {
                ns: "dashboard_page",
                defaultValue: "Transaction ID",
              })}
            </p>
            <p className="font-mono break-all text-xs text-foreground">
              {transaction._id}
            </p>
          </div>
        </div>
      </div>
    </SlidePanel>
  );
};
export default TransactionSlidePanel;