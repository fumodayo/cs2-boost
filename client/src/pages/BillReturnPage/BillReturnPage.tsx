import { useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { useTranslation } from "react-i18next";
import { FiDownload, FiHome } from "react-icons/fi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Helmet, Spinner, ErrorDisplay } from "~/components/ui";
import { robotoBase64 } from "~/assets/fonts/robotobase64";
import { logoBase64 } from "~/assets/image/logo";
import { IBill } from "~/types";
import { formatMoney } from "~/utils";
import { verifyVnPayReturn } from "~/services/payment.service";
import { Button } from "~/components/ui/Button";
import { PaymentReceipt, StatusCard } from "./components";

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

const BillReturnPage = () => {
  const { t } = useTranslation(["payment", "common"]);
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
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let cursorY = 0;

    const primaryColor: [number, number, number] = [91, 78, 246];
    const successColor: [number, number, number] = [16, 185, 129];
    const failedColor: [number, number, number] = [239, 68, 68];
    const grayColor: [number, number, number] = [107, 114, 128];
    const darkColor: [number, number, number] = [31, 41, 55];
    const grayBg: [number, number, number] = [249, 250, 251];
    const borderColor: [number, number, number] = [229, 231, 235];
    const footerBg: [number, number, number] = [249, 250, 251];

    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 45, "F");

    doc.setFillColor(255, 255, 255, 0.2);
    doc.roundedRect(margin, 10, 28, 25, 4, 4, "F");
    doc.addImage(logoBase64, "SVG", margin + 4, 12, 20, 21);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("Roboto", "bold");
    doc.text(t("pdf.company_name"), margin + 35, 22);
    doc.setFontSize(9);
    doc.setFont("Roboto", "normal");
    doc.text(t("pdf.company_slogan"), margin + 35, 30);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("Roboto", "bold");
    doc.text(t("pdf.title").toUpperCase(), pageWidth - margin, 20, {
      align: "right",
    });
    doc.setFontSize(8);
    doc.setFont("Roboto", "normal");
    doc.setTextColor(199, 210, 254);
    doc.text(t("pdf.thank_you"), pageWidth - margin, 28, { align: "right" });

    cursorY = 60;

    const infoBoxHeight = 45;
    doc.setFillColor(...grayBg);
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.3);
    doc.roundedRect(
      margin,
      cursorY,
      contentWidth * 0.7,
      infoBoxHeight,
      4,
      4,
      "FD",
    );

    doc.setTextColor(...grayColor);
    doc.setFontSize(7);
    doc.setFont("Roboto", "bold");
    doc.text("INVOICE NO", margin + 8, cursorY + 10);
    doc.setTextColor(...darkColor);
    doc.setFontSize(11);
    doc.setFont("Roboto", "bold");
    doc.text(bill.vnp_TxnRef || "N/A", margin + 8, cursorY + 18);

    const dateX = margin + contentWidth * 0.35;
    doc.setTextColor(...grayColor);
    doc.setFontSize(7);
    doc.setFont("Roboto", "bold");
    doc.text("DATE", dateX, cursorY + 10);
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    doc.setFont("Roboto", "normal");
    const payDate = bill.vnp_PayDate || new Date().toLocaleString();
    doc.text(payDate, dateX, cursorY + 18);

    doc.setDrawColor(...borderColor);
    doc.line(
      margin + 8,
      cursorY + 26,
      margin + contentWidth * 0.7 - 8,
      cursorY + 26,
    );
    doc.setTextColor(...grayColor);
    doc.setFontSize(7);
    doc.setFont("Roboto", "bold");
    doc.text("TRANSACTION ID", margin + 8, cursorY + 34);
    doc.setTextColor(...grayColor);
    doc.setFontSize(9);
    doc.setFont("Roboto", "normal");
    doc.text(`#${bill.vnp_TransactionNo || "N/A"}`, margin + 8, cursorY + 42);

    const statusBadgeColor = bill.isSuccess ? successColor : failedColor;
    const statusText = bill.isSuccess
      ? t("pdf.status_badge_success")
      : t("pdf.status_badge_failed");
    const badgeWidth = 55;
    const badgeX = pageWidth - margin - badgeWidth;
    const badgeY = cursorY + 15;

    doc.setFillColor(...statusBadgeColor);
    doc.roundedRect(badgeX, badgeY, badgeWidth, 16, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("Roboto", "bold");
    doc.text(statusText, badgeX + badgeWidth / 2, badgeY + 11, {
      align: "center",
    });

    cursorY += infoBoxHeight + 20;

    doc.setTextColor(...primaryColor);
    doc.setFontSize(10);
    doc.setFont("Roboto", "bold");
    doc.text(t("pdf.payment_details").toUpperCase(), margin + 5, cursorY);
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    const textWidth = doc.getTextWidth(t("pdf.payment_details").toUpperCase());
    doc.line(margin + 5, cursorY + 2, margin + 5 + textWidth, cursorY + 2);

    cursorY += 10;

    const paymentDetailsBody = [
      [t("pdf.order_info"), bill.vnp_OrderInfo || "N/A"],
      [t("pdf.payment_method"), "VNPay"],
      [t("pdf.bank"), bill.vnp_BankCode || "N/A"],
      [t("pdf.card_type"), bill.vnp_CardType || "N/A"],
      [t("pdf.ref_id"), bill.vnp_TxnRef || "N/A"],
      [t("pdf.transaction_id"), bill.vnp_TransactionNo || "N/A"],
    ];

    autoTable(doc, {
      body: paymentDetailsBody,
      startY: cursorY,
      theme: "plain",
      margin: { left: margin, right: margin },
      tableWidth: contentWidth,
      styles: {
        font: "Roboto",
        fontSize: 10,
        cellPadding: { top: 6, right: 12, bottom: 6, left: 12 },
      },
      columnStyles: {
        0: {
          fontStyle: "normal",
          textColor: grayColor,
          cellWidth: contentWidth * 0.45,
        },
        1: { halign: "right", textColor: darkColor, fontStyle: "bold" },
      },
      willDrawCell: (data) => {
        if (data.row.index % 2 === 0) {
          doc.setFillColor(...grayBg);
          doc.rect(
            data.cell.x,
            data.cell.y,
            data.cell.width,
            data.cell.height,
            "F",
          );
        }
      },
      didDrawCell: (data) => {
        if (
          data.row.index < paymentDetailsBody.length - 1 &&
          data.column.index === 1
        ) {
          doc.setDrawColor(...borderColor);
          doc.setLineWidth(0.2);
          doc.line(
            margin,
            data.cell.y + data.cell.height,
            pageWidth - margin,
            data.cell.y + data.cell.height,
          );
        }
      },
      didDrawPage: (data) => {
        const table = data.table as { startY?: number; finalY?: number };

        if (table.finalY === undefined || table.startY === undefined) return;

        doc.setDrawColor(...borderColor);
        doc.setLineWidth(0.3);
        doc.roundedRect(
          margin,
          table.startY,
          contentWidth,
          table.finalY - table.startY,
          4,
          4,
          "S",
        );
      },
    });

    cursorY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 20;

    doc.setTextColor(...primaryColor);
    doc.setFontSize(10);
    doc.setFont("Roboto", "bold");
    doc.text(t("pdf.payment_summary").toUpperCase(), margin + 5, cursorY);
    const summaryTextWidth = doc.getTextWidth(
      t("pdf.payment_summary").toUpperCase(),
    );
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(
      margin + 5,
      cursorY + 2,
      margin + 5 + summaryTextWidth,
      cursorY + 2,
    );

    cursorY += 10;

    const summaryBoxHeight = 45;
    doc.setFillColor(...grayBg);
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.3);
    doc.roundedRect(
      margin,
      cursorY,
      contentWidth,
      summaryBoxHeight,
      4,
      4,
      "FD",
    );

    doc.setTextColor(...grayColor);
    doc.setFontSize(10);
    doc.setFont("Roboto", "normal");
    doc.text(t("pdf.subtotal"), margin + 12, cursorY + 14);
    doc.setFont("Roboto", "bold");
    doc.text(
      formatMoney(Number(bill.vnp_Amount), "vnd"),
      pageWidth - margin - 12,
      cursorY + 14,
      { align: "right" },
    );

    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.3);
    doc.line(margin + 12, cursorY + 22, pageWidth - margin - 12, cursorY + 22);

    doc.setTextColor(...primaryColor);
    doc.setFontSize(11);
    doc.setFont("Roboto", "bold");
    doc.text(t("pdf.total_amount"), margin + 12, cursorY + 36);
    doc.setFontSize(14);
    doc.text(
      formatMoney(Number(bill.vnp_Amount), "vnd"),
      pageWidth - margin - 12,
      cursorY + 36,
      { align: "right" },
    );

    const footerHeight = 40;
    const footerY = pageHeight - footerHeight;

    doc.setFillColor(...footerBg);
    doc.rect(0, footerY, pageWidth, footerHeight, "F");

    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.3);
    doc.line(0, footerY, pageWidth, footerY);

    doc.setTextColor(...grayColor);
    doc.setFontSize(8);
    doc.setFont("Roboto", "normal");
    doc.text(t("pdf.footer_note"), pageWidth / 2, footerY + 12, {
      align: "center",
    });

    doc.setFontSize(9);
    doc.text(
      `${t("pdf.company_email")}   |   ${t("pdf.company_website")}`,
      pageWidth / 2,
      footerY + 22,
      { align: "center" },
    );

    doc.setDrawColor(...borderColor);
    doc.line(
      pageWidth / 2 - 25,
      footerY + 28,
      pageWidth / 2 + 25,
      footerY + 28,
    );

    doc.setFontSize(7);
    const currentYear = new Date().getFullYear();
    doc.text(
      `${t("pdf.company_name")} © ${currentYear}`.toUpperCase(),
      pageWidth / 2,
      footerY + 35,
      { align: "center" },
    );

    doc.save(`${t("pdf.file_name")}_${bill.vnp_TxnRef}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-lg font-medium text-muted-foreground">
          {t("loading.verifying")}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("loading.wait_notice")}
        </p>
      </div>
    );
  }

  if (error || !bill) {
    return <ErrorDisplay message={t("error")} />;
  }

  const isSuccess = bill.isSuccess;
  const statusTitle = isSuccess
    ? t("status_card.success_title")
    : t("status_card.failure_title");
  const statusMessage =
    bill.message ??
    (isSuccess
      ? t("status_card.success_message")
      : t("status_card.failure_message"));
  const helmetTitle = isSuccess ? t("helmet.success") : t("helmet.failure");

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
              {t("buttons.view_my_orders")}
            </Button>
            {isSuccess && (
              <Button
                size="lg"
                variant="primary"
                className="w-full sm:w-auto"
                onClick={handleDownloadPDF}
              >
                <FiDownload className="mr-2" />
                {t("buttons.download_receipt")}
              </Button>
            )}
          </div>
        </StatusCard>
      </main>
    </>
  );
};

export default BillReturnPage;