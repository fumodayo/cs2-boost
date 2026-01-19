import { useTranslation } from "react-i18next";
import { IBill } from "~/types";
import { formatMoney } from "~/utils";

const PaymentReceipt = ({ bill }: { bill: IBill }) => {
  const { t } = useTranslation("payment");
  const details = [
    { labelKey: "receipt.order_info", value: bill.vnp_OrderInfo },
    { labelKey: "receipt.transaction_id", value: bill.vnp_TransactionNo },
    { labelKey: "receipt.bank", value: bill.vnp_BankCode },
    { labelKey: "receipt.card_type", value: bill.vnp_CardType },
    { labelKey: "receipt.payment_time", value: bill.vnp_PayDate },
  ];

  return (
    <div className="space-y-4 rounded-lg border border-border bg-accent/50 p-4">
      <dl className="space-y-3">
        {details.map(
          ({ labelKey, value }) =>
            value && (
              <div key={labelKey} className="flex justify-between text-sm">
                <dt className="text-muted-foreground">{t(`${labelKey}`)}:</dt>
                <dd className="font-medium text-foreground">{value}</dd>
              </div>
            ),
        )}
      </dl>
      <div className="flex justify-between border-t border-border pt-4 text-base">
        <dt className="font-semibold text-foreground">
          {t("receipt.total_amount")}:
        </dt>
        <dd className="font-bold text-foreground">
          {formatMoney(Number(bill.vnp_Amount), "vnd")}
        </dd>
      </div>
    </div>
  );
};

export default PaymentReceipt;