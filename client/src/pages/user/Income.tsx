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
  BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import UserPage from "../../components/Layouts/UserPage";
import { FaCartShopping, FaMoneyBill1, FaXmark } from "react-icons/fa6";
import { MdAttachMoney } from "react-icons/md";
import { useGetRevenue } from "../../hooks/useGetRevenue";
import { useState } from "react";
import { formatMoney } from "../../utils/formatMoney";
import * as Dialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import Input from "../../components/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { axiosAuth } from "../../axiosAuth";
import SEO from "../../components/SEO";
import {
  Button,
  CloseButton,
  CompleteButton,
} from "../../components/Buttons/Button";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  BarController,
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
                ? "bg-primary text-primary-foreground"
                : status === "earn"
                  ? "bg-success text-primary-foreground "
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      money: 0,
    },
  });

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

  const optionsTable: ChartOptions = {
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

  const onSubmit: SubmitHandler<FieldValues> = async (form) => {
    const { data } = await axiosAuth.post(`/revenue/withdraw`, { ...form });
    if (data.success === false) {
      toast.error("Rút tiền thất bại");
      return;
    }
    toast.success("Rút thành công");
    location.reload();

    reset();
  };

  return (
    <>
      <SEO title="My Income" description="My Income" href="/dashboard/income" />

      <UserPage>
        <div className="container mx-auto grid grid-cols-1 gap-y-5 xl:grid-cols-2 xl:gap-x-5">
          {/* INCOME */}
          <div className="grid gap-y-5">
            {/* TABLE INCOME */}
            <div className="border border-border bg-card shadow-sm sm:rounded-xl">
              <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-6 sm:rounded-t-xl sm:px-6">
                <h3 className="font-display flex items-center justify-center font-semibold">
                  <MdAttachMoney className="text-success" />
                  Income ({formatMoney("vnd", revenue.total_money)})
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
            {revenue.income.length > 0 && (
              <div className="border border-border bg-card shadow-sm sm:rounded-xl">
                <div className="border-b border-border bg-muted/50 px-4 py-6 sm:rounded-t-xl sm:px-6">
                  <h3 className="font-display font-semibold">Recent Income</h3>
                </div>
                {revenue.income
                  .slice(-5)
                  .reverse()
                  .map((item, index) => (
                    <RecordItem key={index} {...item} index={index} />
                  ))}
                <div className="border-t border-border bg-muted/50 px-4 py-3 sm:rounded-b-xl sm:px-6">
                  <Dialog.Root>
                    <Dialog.Trigger>
                      <Button
                        color="transparent"
                        className="rounded-md px-2 py-1.5 text-xs font-medium text-secondary-light-foreground hover:bg-success/20"
                      >
                        <FaMoneyBill1 className="mr-2 text-xl text-success" />{" "}
                        Cashout
                      </Button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                      <Dialog.Overlay className="data-[state=open]:animate-overlay-show data-[state=closed]:animate-overlay-close fixed inset-0 z-40 bg-background/80" />
                      <Dialog.Content
                        className={clsx(
                          "data-[state=open]:animate-modal-show data-[state=closed]:animate-modal-close scroll-sm min-h fixed top-1/2 z-40 mx-auto min-h-fit w-full -translate-y-1/2 overflow-clip rounded-xl bg-card text-left shadow-xl outline-none transition-all focus:outline-none sm:left-1/2 sm:max-w-lg sm:-translate-x-1/2",
                        )}
                      >
                        {/* HEADER */}
                        <div
                          className={clsx(
                            "flex items-center justify-between px-6 pb-0 pt-6",
                            "sm:pt-5",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <div
                                onClick={handleSubmit(onSubmit)}
                                className="gradient-red flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-green-400 text-sm text-white ring-2 ring-green-500/30"
                              >
                                <MdAttachMoney />
                              </div>
                            </div>
                            <Dialog.Title className="font-display text-lg font-medium leading-6 text-foreground">
                              Widthdraw
                            </Dialog.Title>
                          </div>
                          <Dialog.Close>
                            <CloseButton>
                              <FaXmark className="flex h-5 w-5 items-center justify-center" />
                            </CloseButton>
                          </Dialog.Close>
                        </div>

                        {/* CONTENT */}
                        <div className="flex flex-col space-y-2 p-6">
                          <p>Hãy nhập số tiền bạn muốn rút</p>
                          <Input
                            register={register}
                            errors={errors}
                            style="h-9"
                            id="money"
                            rules={{
                              pattern:
                                /^(?!0\d)(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/,
                              max: revenue.total_money,
                              min: 20000,
                            }}
                            min={20000}
                            max={revenue.total_money}
                            placeholder="money"
                            required
                          />
                        </div>

                        {/* FOOTER */}
                        <div
                          className={clsx(
                            "flex flex-row-reverse items-center gap-2 border-t border-border bg-muted/50 px-6 py-6",
                            "sm:gap-3 sm:rounded-b-xl sm:px-6 sm:py-4",
                          )}
                        >
                          <Dialog.Close asChild>
                            <CompleteButton
                              className="px-4 py-2"
                              onClick={handleSubmit(onSubmit)}
                            >
                              Withdraw
                            </CompleteButton>
                          </Dialog.Close>
                          <Dialog.Close asChild>
                            <Button
                              className="rounded-md px-4 py-2 text-sm shadow-sm"
                              color="light"
                            >
                              Cancel
                            </Button>
                          </Dialog.Close>
                        </div>
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>
                </div>
              </div>
            )}
          </div>

          {/* ORDER */}
          <div>
            {/* TABLE ORDER */}
            <div className="border  border-border bg-card shadow-sm sm:rounded-xl">
              <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-6 sm:rounded-t-xl sm:px-6">
                <h3 className="font-display flex items-center justify-center font-semibold">
                  <FaCartShopping className="mr-2 text-success" />
                  Order Pending (
                  {revenue.orders_pending.length > 0
                    ? revenue.orders_pending.length
                    : 0}
                  )
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
    </>
  );
};

export default Income;
