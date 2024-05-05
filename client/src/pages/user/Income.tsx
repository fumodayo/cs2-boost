import type { ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";

import UserPage from "../../components/Layouts/UserPage";
import { FaMoneyBill1 } from "react-icons/fa6";
import { MdAttachMoney } from "react-icons/md";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
);

const labels = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
];

const optionsOrderTable: ChartOptions<"bar"> = {
  scales: {
    y: {
      position: "left",
    },
  },
};

const income = [
  10000000, 20000000, 30000000, 40000000, 5000000, 6000000, 7000000, 8000000,
  90000000, 10000000, 10000000, 20000000, 30000000, 40000000, 5000000, 6000000,
  7000000, 8000000, 90000000, 10000000,
];

const orders = [
  100, 60, 80, 80, 80, 80, 80, 80, 80, 80, 100, 200, 100, 50, 100, 200,
];

const orderTable = {
  labels,
  datasets: [
    {
      label: "Order",
      data: orders,
      backgroundColor: "#0a6cfb",
    },
  ],
};

const optionsIncomeTable = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
};

const incomeTable = {
  labels,
  datasets: [
    {
      label: "Income",
      data: income,
      backgroundColor: "#ff3968",
    },
    {
      label: "Money hold",
      data: income,
      backgroundColor: "#0a6cfb",
    },
  ],
};

const Income = () => {
  return (
    <UserPage>
      <div className="container">
        <div className="mx-auto grid grid-cols-1 grid-rows-1 items-start gap-y-5 xl:mx-0 xl:grid-cols-2 xl:gap-x-5">
          <div>
            {/* TABLE ORDER */}
            <div className="-mx-4 border bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl">
              <div className="flex flex-col space-y-1.5 border-b border-border bg-muted/50 px-4 py-6 sm:rounded-t-xl sm:px-6">
                <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
                  Order
                </h3>
              </div>
              <div className="px-0 pt-0 sm:px-6">
                <Chart
                  type="bar"
                  options={optionsOrderTable}
                  data={orderTable}
                />
              </div>
            </div>

            {/* RECENT ORDER */}
            <div className="-mx-4 border bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl">
              <div className="flex flex-col space-y-1.5 border-b border-border bg-muted/50 px-4 py-6 sm:rounded-t-xl sm:px-6">
                <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
                  Recent Order
                </h3>
              </div>
              <div className="px-0 pt-0 sm:px-6">
                <div className="px-4 py-4 sm:col-span-3 sm:grid sm:grid-cols-3 sm:px-0">
                  <dt className="flex items-center justify-start gap-x-4 text-sm font-medium capitalize text-foreground">
                    <div className="flex items-center justify-center rounded-xl bg-primary/10 px-4 py-1 font-bold text-primary">
                      1
                    </div>
                    21/12/2025
                  </dt>
                  <dd className="flex justify-end gap-x-2 text-sm font-bold leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                    980,000.000
                  </dd>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border bg-muted/50 px-4 py-3 sm:rounded-b-xl sm:px-10">
                <button className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-transparent px-2 py-1.5 text-xs font-medium text-secondary-light-foreground outline-none transition-colors hover:bg-secondary-light focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50">
                  <FaMoneyBill1 className="mr-2" /> Cashout
                </button>
              </div>
            </div>
          </div>

          <div>
            {/* TABLE INCOME */}
            <div className="-mx-4 border bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl">
              <div className="flex flex-col space-y-1.5 border-b border-border bg-muted/50 px-4 py-6 sm:rounded-t-xl sm:px-6">
                <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
                  <MdAttachMoney />
                  Income (500.000,200)
                </h3>
              </div>
              <div className="px-0 pt-0 sm:px-6">
                <Chart
                  type="bar"
                  options={optionsIncomeTable}
                  data={incomeTable}
                />
              </div>
            </div>

            {/* RECENT INCOME */}
            <div className="-mx-4 border bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl">
              <div className="flex flex-col space-y-1.5 border-b border-border bg-muted/50 px-4 py-6 sm:rounded-t-xl sm:px-6">
                <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
                  Recent Income
                </h3>
              </div>
              <div className="px-0 pt-0 sm:px-6">
                <div className="px-4 py-4 sm:col-span-3 sm:grid sm:grid-cols-3 sm:px-0">
                  <dt className="flex items-center justify-start gap-x-4 text-sm font-medium capitalize text-foreground">
                    <div className="flex items-center justify-center rounded-xl bg-primary/10 px-4 py-1 font-bold text-primary">
                      1
                    </div>
                    21/12/2025
                  </dt>
                  <dd className="flex justify-end gap-x-2 text-sm font-bold leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                    980,000.000
                  </dd>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border bg-muted/50 px-4 py-3 sm:rounded-b-xl sm:px-10">
                <button className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-transparent px-2 py-1.5 text-xs font-medium text-secondary-light-foreground outline-none transition-colors hover:bg-secondary-light focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50">
                  <FaMoneyBill1 className="mr-2" /> Cashout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserPage>
  );
};

export default Income;
