import { useTranslation } from "react-i18next";
import { IBill } from "~/types";
import { formatMoney } from "~/utils";

const PaymentReceipt = ({ bill }: { bill: IBill }) => {
  const { t } = useTranslation();

  const details = [
    { label: t("BillReturnPage.receipt.orderInfo"), value: bill.vnp_OrderInfo },
    {
      label: t("BillReturnPage.receipt.transactionId"),
      value: bill.vnp_TransactionNo,
    },
    { label: t("BillReturnPage.receipt.bank"), value: bill.vnp_BankCode },
    { label: t("BillReturnPage.receipt.cardType"), value: bill.vnp_CardType },
    { label: t("BillReturnPage.receipt.paymentTime"), value: bill.vnp_PayDate },
  ];

  return (
    <div className="space-y-4 rounded-lg border border-border bg-accent/50 p-4">
      <dl className="space-y-3">
        {details.map(
          (item, index) =>
            item.value && (
              <div key={index} className="flex justify-between text-sm">
                <dt className="text-muted-foreground">{item.label}:</dt>
                <dd className="font-medium text-foreground">{item.value}</dd>
              </div>
            ),
        )}
      </dl>
      <div className="flex justify-between border-t border-border pt-4 text-base">
        <dt className="font-semibold text-foreground">
          {t("BillReturnPage.receipt.totalAmount")}:
        </dt>
        <dd className="font-bold text-foreground">
          {formatMoney(Number(bill.vnp_Amount) / 100, "vnd")}
        </dd>
      </div>
    </div>
  );
};

export default PaymentReceipt;
