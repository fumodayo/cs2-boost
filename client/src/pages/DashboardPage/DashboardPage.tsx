import React, { useState } from "react";
import useSWR from "swr";
import { Helmet, ErrorDisplay } from "~/components/shared";
import { Heading } from "../GameModePage/components";
import {
  FaTachometerAlt,
  FaChartLine,
  FaPiggyBank,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import {
  FinancialKpiCard,
  PayoutRequestsCard,
} from "../ManageRevenue/components";
import { RevenueChartCard, RecentTransactions } from "./components";
import { formatMoney } from "~/utils";
import { useTranslation } from "react-i18next";
import { payoutService } from "~/services/payout.service";
import { revenueService } from "~/services/revenue.service";

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [chartDays, setChartDays] = useState(30);

  const {
    data: statsData,
    error: statsError,
    isLoading: isLoadingStats,
  } = useSWR("/revenue/statistics", revenueService.getDashboardStatistics);

  const {
    data: chartData,
    error: chartError,
    isLoading: isLoadingChart,
  } = useSWR(`/revenue/chart-data?days=${chartDays}`, () =>
    revenueService.getRevenueChartData(chartDays),
  );

  const {
    data: transactionsData,
    error: transactionsError,
    isLoading: isLoadingTransactions,
  } = useSWR("/revenue/transactions?per-page=5", () => {
    const params = new URLSearchParams({
      page: "1",
      "per-page": "10",
    });
    return revenueService.getTransactions(params);
  });

  const {
    data: payoutsData,
    error: payoutsError,
    isLoading: isLoadingPayouts,
    mutate: mutatePayouts,
  } = useSWR("/payouts?status=PENDING", () =>
    payoutService.getPayouts({ status: "PENDING", page: 1, limit: 10 }),
  );

  const kpi = statsData?.kpi;
  const descriptions = statsData?.descriptions;

  return (
    <>
      <Helmet title="Dashboard · Admin Panel" />
      <div className="space-y-8 p-4 md:p-8">
        <Heading
          icon={FaTachometerAlt}
          title="Dashboard"
          subtitle="Welcome back, Admin! Here's a summary of your platform's activity."
        />
        {isLoadingStats && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-[108px] animate-pulse rounded-xl bg-card"
              ></div>
            ))}
          </div>
        )}
        {statsError && (
          <ErrorDisplay message="Could not load KPI statistics." />
        )}
        {kpi && descriptions && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <FinancialKpiCard
              title={t("DashboardPage.StatCards.grossRevenue")}
              value={formatMoney(kpi.grossRevenue, "vnd")}
              description={descriptions.grossRevenue}
              icon={FaChartLine}
              colorClass="text-green-500"
            />
            <FinancialKpiCard
              title={t("DashboardPage.StatCards.netProfit")}
              value={formatMoney(kpi.netProfit, "vnd")}
              description={descriptions.netProfit}
              icon={FaPiggyBank}
              colorClass="text-blue-500"
            />
            <FinancialKpiCard
              title={t("DashboardPage.StatCards.totalPayouts")}
              value={formatMoney(kpi.totalPayouts, "vnd")}
              description={descriptions.totalPayouts}
              icon={FaMoneyBillWave}
              colorClass="text-yellow-500"
            />
            <FinancialKpiCard
              title={t("DashboardPage.StatCards.pendingPayouts")}
              value={formatMoney(kpi.pendingPayouts, "vnd")}
              description={descriptions.pendingPayouts}
              icon={FaFileInvoiceDollar}
              colorClass="text-red-500"
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {isLoadingChart && (
              <div className="h-full min-h-[420px] animate-pulse rounded-xl bg-card"></div>
            )}
            {chartError && (
              <ErrorDisplay message="Could not load revenue chart." />
            )}
            {chartData && (
              <RevenueChartCard
                data={chartData}
                days={chartDays}
                setDays={setChartDays}
              />
            )}
          </div>
          <div className="lg:col-span-1">
            <PayoutRequestsCard
              data={payoutsData?.data}
              error={payoutsError}
              isLoading={isLoadingPayouts}
              onActionSuccess={mutatePayouts}
            />
          </div>
        </div>

        <div>
          {isLoadingTransactions && (
            <div className="h-96 animate-pulse rounded-xl bg-card"></div>
          )}
          {transactionsError && (
            <ErrorDisplay message="Could not load recent transactions." />
          )}
          {transactionsData && (
            <RecentTransactions transactions={transactionsData.data} />
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
