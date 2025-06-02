import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosAuth } from "~/axiosAuth";
import { Button, Helmet } from "~/components/shared";
import { FiDownload } from "react-icons/fi";
import { jsPDF } from "jspdf";
import { PaymentReceipt } from "./components";
import { robotoBase64 } from "../../../public/assets/fonts/robotobase64";
import { IBillProps } from "~/types";
import cn from "~/libs/utils";

const BillReturnPage = () => {
  const [bill, setBill] = useState<IBillProps>();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBill = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosAuth.get(
          `/vn-pay/bill-return${location.search}`,
        );
        setBill(data);
      } catch (error) {
        console.error("Failed to get bill:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (location.search) {
      fetchBill();
    }
  }, [location.search]);

  const handleDownloadPDF = () => {
    if (!bill) return;

    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
      orientation: "portrait",
    });

    // Add Vietnamese-supported font
    doc.addFileToVFS("Roboto-Regular.ttf", robotoBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    doc.setFontSize(20);
    doc.text("Biên lai thanh toán", 40, 60);

    doc.setFontSize(12);
    const lineHeight = 25;
    const entries = [
      ["Mã giao dịch:", bill.vnp_TransactionNo],
      ["Số tiền:", `${Number(bill.vnp_Amount).toLocaleString()} VND`],
      ["Ngân hàng:", bill.vnp_BankCode],
      ["Loại thẻ:", bill.vnp_CardType],
      ["Thời gian thanh toán:", bill.vnp_PayDate],
      ["Thông tin đơn hàng:", bill.vnp_OrderInfo],
      ["Trạng thái:", bill.message],
    ];

    entries.forEach(([label, value], i) => {
      doc.text(`${label} ${value}`, 40, 100 + i * lineHeight);
    });

    doc.save(`bien_lai_${bill.vnp_TxnRef}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-sm text-muted-foreground">Đang xử lý...</div>
      </div>
    );
  }

  if (!bill) return null;

  const isSuccess = bill.isSuccess;

  return (
    <>
      <Helmet title="Kết quả thanh toán" />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <div
          className={cn(
            "rounded-xl border bg-card p-6 shadow-sm",
            isSuccess ? "border-green-400" : "border-red-400",
          )}
        >
          <div className="mb-4 flex items-center space-x-3">
            {isSuccess ? (
              <FaCheckCircle className="text-2xl text-green-500" />
            ) : (
              <FaTimesCircle className="text-2xl text-red-500" />
            )}
            <h2 className="text-lg font-semibold">
              {isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại"}
            </h2>
          </div>

          <p className="mb-6 text-sm text-muted-foreground">{bill.message}</p>

          {bill && <PaymentReceipt bill={bill} />}

          <div className="mt-6 flex justify-center gap-4">
            <Button
              onClick={() => navigate("/orders")}
              variant="primary"
              className={cn(
                "w-full rounded-md px-4 py-2 text-sm sm:w-auto",
                isSuccess
                  ? "bg-success hover:bg-success-hover"
                  : "bg-danger hover:bg-danger-hover",
              )}
            >
              Done
            </Button>
            {isSuccess && (
              <Button
                variant="secondary"
                className="w-full rounded-md px-4 py-2 text-sm sm:w-auto"
                onClick={handleDownloadPDF}
              >
                <FiDownload className="mr-2" />
                Get PDF Receipt
              </Button>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default BillReturnPage;
