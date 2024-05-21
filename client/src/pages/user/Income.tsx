import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  ChartOptions,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import UserPage from "../../components/Layouts/UserPage";
import { FaCartShopping, FaMoneyBill1 } from "react-icons/fa6";
import { MdAttachMoney } from "react-icons/md";
import { useGetRevenue } from "../../hooks/useGetRevenue";
import { useState } from "react";
import { formatMoney } from "../../utils/formatMoney";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
);

interface RecordItemProps {
  status: string;
  amount: number;
  createdAt: string;
  index: number;
}

const RecordItem: React.FC<RecordItemProps> = ({
  amount,
  createdAt,
  status,
}) => (
  <div className="px-0 pt-0 sm:px-6">
    <div className="px-4 py-4 sm:col-span-3 sm:grid sm:grid-cols-3 sm:px-0">
      <dt className="flex items-center justify-start gap-x-4 text-sm font-medium capitalize text-foreground">
        <div className="min-w-[6rem]">
          <div
            className={`flex max-w-max items-center justify-center rounded-xl px-4 py-1 font-bold ${
              status === "withdraw"
                ? "bg-success text-primary-foreground"
                : status === "deposit"
                  ? "bg-primary text-primary-foreground "
                  : status === "fine"
                    ? "bg-danger text-primary-foreground"
                    : ""
            }`}
          >
            {status}
          </div>
        </div>
        {new Date(createdAt).toLocaleDateString("en-GB")}
      </dt>
      <dd className="flex justify-end gap-x-2 text-sm font-bold leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
        {amount && formatMoney("vnd", amount)}
      </dd>
    </div>
  </div>
);

const Income: React.FC = () => {
  const [periodMoney, setPeriodMoney] = useState<string>("week");
  const [periodOrder, setPeriodOrder] = useState<string>("week");
  const revenue = useGetRevenue(periodMoney, periodOrder);

  if (!revenue) return null;

  const handleChangePeriod =
    (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) =>
      setter(value);

  const formatLabels = (items: { createdAt: string }[]) =>
    items?.map((item) =>
      item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-GB")
        : null,
    );

  const optionsTable: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Chart.js Bar Chart" },
    },
  };

  const createTableData = (
    pending: { createdAt: string; amount: number }[],
    profit: { amount: number }[],
    fine: { amount: number }[],
  ) => ({
    labels: formatLabels(pending),
    datasets: [
      {
        label: "Pending",
        data: pending.map((item) => item.amount),
        backgroundColor: "#0a6cfb",
      },
      {
        label: "Profit",
        data: profit.map((item) => item.amount),
        backgroundColor: "#16ff64",
      },
      {
        label: "Fine",
        data: fine.map((item) => item.amount),
        backgroundColor: "#ff3968",
      },
    ],
  });

  const incomeTable = createTableData(
    revenue.money_pending,
    revenue.money_profit,
    revenue.money_fine,
  );

  const orderTable = createTableData(
    revenue.total_order_pending,
    revenue.total_order_completed,
    revenue.total_order_cancel,
  );

  const totalIncome = revenue.income.reduce((sum, acc) => sum + acc.amount, 0);

  return (
    <UserPage>
      <div className="container mx-auto grid grid-cols-1 gap-y-5 xl:grid-cols-2 xl:gap-x-5">
        {/* INCOME */}
        <div className="grid gap-y-5">
          {/* TABLE INCOME */}
          <div className="border border-border bg-card shadow-sm sm:rounded-xl">
            <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-6 sm:rounded-t-xl sm:px-6">
              <h3 className="font-display flex items-center justify-center font-semibold">
                <MdAttachMoney className="text-success" />
                Income ({formatMoney("vnd", totalIncome)})
              </h3>
              <div className="flex gap-x-1">
                {["week", "month"].map((period) => (
                  <button
                    key={period}
                    onClick={() => handleChangePeriod(setPeriodMoney)(period)}
                    className={`relative inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${
                      periodMoney === period
                        ? "bg-[#0B6CFB] text-white"
                        : "bg-secondary-light text-secondary-light-foreground"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-0 pt-0 sm:px-6">
              <Chart type="bar" options={optionsTable} data={incomeTable} />
            </div>
          </div>

          {/* RECENT INCOME */}
          <div className="border border-border bg-card shadow-sm sm:rounded-xl">
            <div className="border-b border-border bg-muted/50 px-4 py-6 sm:rounded-t-xl sm:px-6">
              <h3 className="font-display font-semibold">Recent Income</h3>
            </div>
            {revenue.income.slice(-5).map((item, index) => (
              <RecordItem key={index} {...item} index={index} />
            ))}
            <div className="border-t border-border bg-muted/50 px-4 py-3 sm:rounded-b-xl sm:px-6">
              <button
                onClick={() => console.log("free money")}
                type="button"
                className="relative inline-flex items-center justify-center rounded-md bg-transparent px-2 py-1.5 text-xs font-medium text-secondary-light-foreground hover:bg-success/20 hover:text-primary-foreground"
              >
                <FaMoneyBill1 className="mr-2 text-xl text-success" /> Cashout
              </button>
            </div>
          </div>
        </div>

        {/* ORDER */}
        <div>
          {/* TABLE ORDER */}
          <div className="border  border-border bg-card shadow-sm sm:rounded-xl">
            <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-6 sm:rounded-t-xl sm:px-6">
              <h3 className="font-display flex items-center justify-center font-semibold">
                <FaCartShopping className="mr-2 text-success" />
                Order ({revenue.total_money_profit - revenue.total_money_fine})
              </h3>
              <div className="flex gap-x-1">
                {["week", "month"].map((period) => (
                  <button
                    key={period}
                    onClick={() => handleChangePeriod(setPeriodOrder)(period)}
                    className={`relative inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${
                      periodOrder === period
                        ? "bg-[#0B6CFB] text-white"
                        : "bg-secondary-light text-secondary-light-foreground"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-0 pt-0 sm:px-6">
              <Chart type="bar" options={optionsTable} data={orderTable} />
            </div>
          </div>
        </div>
      </div>
    </UserPage>
  );
};

export default Income;
