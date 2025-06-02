import { IBillProps } from "~/types";

const PaymentReceipt = ({ bill }: { bill: IBillProps }) => {
  return (
    <table className="w-full text-sm">
      <tbody>
        <tr>
          <td className="py-2 font-medium">Mã giao dịch:</td>
          <td className="py-2 text-right">{bill.vnp_TransactionNo}</td>
        </tr>
        <tr>
          <td className="py-2 font-medium">Số tiền:</td>
          <td className="py-2 text-right">
            {Number(bill.vnp_Amount).toLocaleString()} VND
          </td>
        </tr>
        <tr>
          <td className="py-2 font-medium">Ngân hàng:</td>
          <td className="py-2 text-right">{bill.vnp_BankCode}</td>
        </tr>
        <tr>
          <td className="py-2 font-medium">Loại thẻ:</td>
          <td className="py-2 text-right">{bill.vnp_CardType}</td>
        </tr>
        <tr>
          <td className="py-2 font-medium">Thời gian thanh toán:</td>
          <td className="py-2 text-right">{bill.vnp_PayDate}</td>
        </tr>
        <tr>
          <td className="py-2 font-medium">Thông tin đơn hàng:</td>
          <td className="py-2 text-right">{bill.vnp_OrderInfo}</td>
        </tr>
        <tr>
          <td className="py-2 font-medium">Trạng thái:</td>
          <td className="py-2 text-right">{bill.message}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default PaymentReceipt;
