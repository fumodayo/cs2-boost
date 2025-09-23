import { useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { useTranslation } from "react-i18next";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FiDownload, FiHome } from "react-icons/fi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Helmet, Spinner, ErrorDisplay } from "~/components/shared";
import { robotoBase64 } from "~/assets/fonts/robotobase64";
import { logoBase64 } from "~/assets/image/logo";
import { IBill } from "~/types";
import { formatMoney } from "~/utils";
import { verifyVnPayReturn } from "~/services/payment.service";
import cn from "~/libs/utils";
import { Button } from "~/components/shared/Button";

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

const StatusCard = ({
  status,
  title,
  message,
  children,
}: {
  status: "success" | "failure";
  title: string;
  message: string;
  children: React.ReactNode;
}) => {
  const isSuccess = status === "success";
  return (
    <div className="mx-auto mt-10 max-w-2xl transform transition-all">
      <div className="overflow-hidden rounded-2xl bg-card shadow-lg ring-1 ring-border">
        <div
          className={cn(
            "flex flex-col items-center justify-center p-8 text-center",
            isSuccess
              ? "bg-green-50 dark:bg-green-900/20"
              : "bg-red-50 dark:bg-red-900/20",
          )}
        >
          {isSuccess ? (
            <FaCheckCircle className="h-16 w-16 text-green-500" />
          ) : (
            <FaTimesCircle className="h-16 w-16 text-red-500" />
          )}
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">{message}</p>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

const BillReturnPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const swrKey = location.search
    ? `/vn-pay/bill-return${location.search}`
    : null;
  const {
    data: bill,
    error,
    isLoading,
  } = useSWR<IBill>(swrKey, () => verifyVnPayReturn(location.search), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const handleDownloadPDF = () => {
    if (!bill) return;

    const doc = new jsPDF();
    doc.addFileToVFS("Roboto-Regular.ttf", robotoBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.addFont("Roboto-Regular.ttf", "Roboto", "bold");
    doc.setFont("Roboto");

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let cursorY = margin;

    doc.addImage(logoBase64, "SVG", margin, cursorY, 40, 40);
    doc.setFontSize(24);
    doc.setFont("Roboto", "bold");
    doc.text(t("BillReturnPage.pdf.title"), pageWidth - margin, cursorY + 15, {
      align: "right",
    });

    doc.setFontSize(10);
    doc.setFont("Roboto", "normal");
    doc.setTextColor(100);
    doc.text(
      `${t("BillReturnPage.pdf.transactionLabel")}${bill.vnp_TransactionNo}`,
      pageWidth - margin,
      cursorY + 30,
      { align: "right" },
    );
    doc.text(
      `${t("BillReturnPage.pdf.dateLabel")} ${bill.vnp_PayDate}`,
      pageWidth - margin,
      cursorY + 45,
      { align: "right" },
    );

    cursorY += 80;
    doc.setDrawColor(221, 221, 221);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 25;

    const tableBody = [
      [t("BillReturnPage.pdf.orderInfo"), bill.vnp_OrderInfo || "N/A"],
      [t("BillReturnPage.pdf.bank"), bill.vnp_BankCode || "N/A"],
      [t("BillReturnPage.pdf.cardType"), bill.vnp_CardType || "N/A"],
      [t("BillReturnPage.pdf.refId"), bill.vnp_TxnRef || "N/A"],
    ];

    autoTable(doc, {
      body: tableBody,
      startY: cursorY,
      theme: "plain",
      styles: {
        font: "Roboto",
        fontSize: 11,
        cellPadding: { top: 6, right: 0, bottom: 6, left: 0 },
      },
      columnStyles: {
        0: { fontStyle: "bold", textColor: "#333" },
        1: { halign: "right" },
      },
    });

    cursorY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 30;

    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 25;
    doc.setFontSize(14);
    doc.setFont("Roboto", "bold");
    doc.text(t("BillReturnPage.pdf.totalAmount"), margin, cursorY);
    doc.text(
      formatMoney(Number(bill.vnp_Amount) / 100, "vnd"),
      pageWidth - margin,
      cursorY,
      { align: "right" },
    );

    cursorY += 40;
    doc.setFontSize(10);
    doc.setTextColor(150);
    const statusText = `${t("BillReturnPage.pdf.statusLabel")} ${bill.isSuccess ? t("BillReturnPage.pdf.status.success") : t("BillReturnPage.pdf.status.failed")} - ${bill.message}`;
    doc.text(statusText, pageWidth / 2, cursorY, { align: "center" });
    cursorY += 15;
    doc.text(t("BillReturnPage.pdf.thankYou"), pageWidth / 2, cursorY, {
      align: "center",
    });

    doc.save(`${t("BillReturnPage.pdf.fileName")}_${bill.vnp_TxnRef}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-lg font-medium text-muted-foreground">
          Verifying your payment...
        </p>
        <p className="text-sm text-muted-foreground">
          Please do not close this window.
        </p>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <ErrorDisplay message="An error occurred while verifying the payment. Please check your order history or contact support." />
    );
  }

  const isSuccess = bill.isSuccess;
  const statusTitle = isSuccess
    ? t("BillReturnPage.statusCard.title.success")
    : t("BillReturnPage.statusCard.title.failure");
  const statusMessage =
    bill.message ??
    (isSuccess
      ? t("BillReturnPage.statusCard.message.success")
      : t("BillReturnPage.statusCard.message.failure"));
  const helmetTitle = isSuccess
    ? t("BillReturnPage.helmet.success")
    : t("BillReturnPage.helmet.failure");

  return (
    <>
      <Helmet title={helmetTitle} />
      <main className="container px-4 py-6">
        <StatusCard
          status={isSuccess ? "success" : "failure"}
          title={statusTitle}
          message={statusMessage}
        >
          <PaymentReceipt bill={bill} />
          <div className="mt-8 flex flex-col-reverse justify-center gap-4 border-t border-border pt-6 sm:flex-row">
            <Button
              size="lg"
              onClick={() => navigate("/orders")}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <FiHome className="mr-2" />
              {t("Globals.Button.ViewMyOrders")}
            </Button>
            {isSuccess && (
              <Button
                size="lg"
                variant="primary"
                className="w-full sm:w-auto"
                onClick={handleDownloadPDF}
              >
                <FiDownload className="mr-2" />
                {t("Globals.Button.DownloadReceipt")}
              </Button>
            )}
          </div>
        </StatusCard>
      </main>
    </>
  );
};

export default BillReturnPage;
