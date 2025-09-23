import React, { useContext } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  TooltipItem,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { FaArrowUpRightDots, FaPiggyBank } from "react-icons/fa6";
import { formatMoney } from "~/utils";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/shared/Button";
import cn from "~/libs/utils";
import { AppContext } from "~/components/context/AppContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface ChartDataPoint {
  date: string;
  grossRevenue: number;
  netProfit: number;
}

interface RevenueChartCardProps {
  data: ChartDataPoint[];
  days: number;
  setDays: (days: number) => void;
}

const timeRangeOptions = [
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
];

const RevenueChartCard: React.FC<RevenueChartCardProps> = ({
  data,
  days,
  setDays,
}) => {
  const { t } = useTranslation();
  const { theme } = useContext(AppContext);

  const themeColors = {
    tickColor: theme === "dark" ? "#9ca3af" : "#4b5563",
    gridColor: theme === "dark" ? "#374151" : "#e5e7eb",
    tooltipBg: theme === "dark" ? "#1f2937" : "#ffffff",
    tooltipBorder: theme === "dark" ? "#374151" : "#e5e7eb",

    tooltipTitle: theme === "dark" ? "#f9fafb" : "#111827",
  };

  const totals = data.reduce(
    (acc, curr) => {
      acc.revenue += curr.grossRevenue;
      acc.profit += curr.netProfit;
      return acc;
    },
    { revenue: 0, profit: 0 },
  );

  const chartData: ChartData<"bar" | "line"> = {
    labels: data.map((d) =>
      new Date(d.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
    ),
    datasets: [
      {
        type: "bar" as const,
        label: t("DashboardPage.Chart.grossRevenue"),
        data: data.map((d) => d.grossRevenue),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 4,
        order: 2,
      },
      {
        type: "line" as const,
        label: t("DashboardPage.Chart.netProfit"),
        data: data.map((d) => d.netProfit),
        borderColor: "rgba(234, 179, 8, 1)",
        backgroundColor: "rgba(234, 179, 8, 1)",
        tension: 0.3,
        pointRadius: 2,
        pointBackgroundColor: "rgba(234, 179, 8, 1)",
        order: 1,
      },
    ],
  };

  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: "rectRounded",
          padding: 20,
          color: themeColors.tickColor,
        },
      },
      tooltip: {
        backgroundColor: themeColors.tooltipBg,
        titleColor: themeColors.tooltipTitle,
        bodyColor: themeColors.tickColor,
        borderColor: themeColors.tooltipBorder,
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: TooltipItem<"bar" | "line">) => {
            const label = context.dataset.label || "";
            const value = context.raw as number;
            return `${label}: ${formatMoney(value, "vnd")}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: themeColors.gridColor },
        ticks: {
          color: themeColors.tickColor,
          callback: (value) => formatMoney(Number(value), "vnd"),
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: themeColors.tickColor,
        },
      },
    },
    interaction: { intersect: false, mode: "index" },
  };

  return (
    <div className="h-full rounded-xl border border-border bg-card p-4 shadow-sm md:p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {t("DashboardPage.Chart.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("DashboardPage.Chart.subtitle", { days })}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-md bg-muted p-1">
          {timeRangeOptions.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 flex-1 px-4 text-xs font-semibold",
                days === option.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground",
              )}
              onClick={() => setDays(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="my-6 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-border pt-4 sm:grid-cols-2">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <FaArrowUpRightDots className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {t("DashboardPage.Chart.totalRevenue")}
            </p>
            <p className="text-2xl font-bold text-foreground">
              {formatMoney(totals.revenue, "vnd")}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
            <FaPiggyBank className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {t("DashboardPage.Chart.totalProfit")}
            </p>
            <p className="text-2xl font-bold text-foreground">
              {formatMoney(totals.profit, "vnd")}
            </p>
          </div>
        </div>
      </div>
      <div className="h-72 w-full">
        <Chart type="bar" data={chartData} options={options} />
      </div>
    </div>
  );
};

export default RevenueChartCard;
