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
  BarController,
  LineController,
  Filler,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { FaArrowUpRightDots, FaPiggyBank } from "react-icons/fa6";
import { formatMoney } from "~/utils";
import { useTranslation } from "react-i18next";
import cn from "~/libs/utils";
import { AppContext } from "~/components/context/AppContext";

ChartJS.register(
  BarController,
  LineController,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
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
  { key: "7_days", value: 7 },
  { key: "30_days", value: 30 },
  { key: "90_days", value: 90 },
  { key: "all_time", value: 36500 },
];

const RevenueChartCard: React.FC<RevenueChartCardProps> = ({
  data,
  days,
  setDays,
}) => {
  const { t } = useTranslation("dashboard_page");
  const { theme } = useContext(AppContext);

  const filteredData = React.useMemo(() => {
    return data.filter((d) => d.grossRevenue > 0 || d.netProfit > 0);
  }, [data]);

  const themeColors = {
    tickColor: theme === "dark" ? "#9ca3af" : "#6b7280",
    gridColor:
      theme === "dark" ? "rgba(55, 65, 81, 0.5)" : "rgba(229, 231, 235, 0.5)",
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
    labels: filteredData.map((d) =>
      new Date(d.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
    ),
    datasets: [
      {
        type: "bar" as const,
        label: t("chart.gross_revenue"),
        data: filteredData.map((d) => d.grossRevenue),
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 0.8)",
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.6,
        order: 2,
      },
      {
        type: "line" as const,
        label: t("chart.net_profit"),
        data: filteredData.map((d) => d.netProfit),
        borderColor: "rgba(234, 179, 8, 1)",
        backgroundColor: "rgba(234, 179, 8, 0.1)",
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointBackgroundColor: "rgba(234, 179, 8, 1)",
        borderWidth: 2,
        fill: true,
        order: 1,
      },
    ],
  };

  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: themeColors.tooltipBg,
        titleColor: themeColors.tooltipTitle,
        bodyColor: themeColors.tickColor,
        borderColor: themeColors.tooltipBorder,
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
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
        grid: { color: themeColors.gridColor, drawTicks: false },
        border: { display: false },
        ticks: {
          color: themeColors.tickColor,
          font: { size: 11 },
          callback: (value) => formatMoney(Number(value), "vnd"),
        },
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: themeColors.tickColor,
          font: { size: 11 },
          maxRotation: 0,
          autoSkip: true,
        },
      },
    },
    interaction: { intersect: false, mode: "index" },
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
      {/* Header Section */}
      <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {t("chart.title")}
          </h3>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {t("chart.subtitle", { days: days > 1000 ? "All Time" : days })}
          </p>
        </div>

        {/* Modern Time Selector */}
        <div className="flex rounded-lg border border-border/50 bg-muted/50 p-1">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setDays(option.value)}
              className={cn(
                "relative rounded-md px-4 py-1.5 text-xs font-semibold transition-all duration-200 ease-in-out",
                days === option.value
                  ? "bg-background text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
              )}
            >
              {option.key === "all_time"
                ? t("chart.time_ranges.all_time", "All time")
                : t(`chart.time_ranges.${option.key}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-8">
        <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-transparent p-5 dark:border-blue-900/20 dark:from-blue-900/10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
              <FaArrowUpRightDots className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("chart.total_revenue")}
              </p>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {formatMoney(totals.revenue, "vnd")}
              </p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-yellow-100 bg-gradient-to-br from-yellow-50/50 to-transparent p-5 dark:border-yellow-900/20 dark:from-yellow-900/10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500 text-white shadow-lg shadow-yellow-500/20">
              <FaPiggyBank className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("chart.total_profit")}
              </p>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {formatMoney(totals.profit, "vnd")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative min-h-[300px] w-full flex-1">
        {/* Custom Legend */}
        <div className="absolute -top-4 right-0 flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="block h-2 w-2 rounded-full bg-blue-500"></span>
            <span className="text-muted-foreground">
              {t("chart.gross_revenue")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="block h-2 w-2 rounded-full bg-yellow-500"></span>
            <span className="text-muted-foreground">
              {t("chart.net_profit")}
            </span>
          </div>
        </div>
        <Chart type="bar" data={chartData} options={options} />
      </div>
    </div>
  );
};

export default RevenueChartCard;