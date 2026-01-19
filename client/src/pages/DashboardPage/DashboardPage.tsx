import React, { useState } from "react";
import useSWR from "swr";
import { Helmet, ErrorDisplay, Heading } from "~/components/ui";
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
  const { t } = useTranslation(["dashboard_page", "common"]);
  const [chartDays, setChartDays] = useState(30);

  const {
    data: statsData,
    error: statsError,
    isLoading: isLoadingStats,
  } = useSWR(`/revenue/statistics?days=${chartDays}`, () =>
    revenueService.getDashboardStatistics(chartDays),
  );

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

  return (
    <>
      <Helmet title="dashboard_page" />
      <div className="space-y-8 p-4 md:p-8">
        <Heading
          icon={FaTachometerAlt}
          title="dashboard_page_title"
          subtitle="dashboard_page_subtitle"
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
        {statsError && <ErrorDisplay message={t("dashboard_page:kpi_error")} />}
        {kpi && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <FinancialKpiCard
              title={t("stat_cards.gross_revenue", {
                days:
                  chartDays > 1000
                    ? t("chart.time_ranges.all_time")
                    : `${chartDays} days`,
              })}
              value={formatMoney(kpi.grossRevenue, "vnd")}
              description={
                chartDays > 1000
                  ? t("stat_cards.descriptions.all_time")
                  : t("stat_cards.descriptions.in_last_n_days", {
                      count: chartDays,
                    })
              }
              icon={FaChartLine}
              colorClass="text-green-500"
            />
            <FinancialKpiCard
              title={t("stat_cards.net_profit", {
                days:
                  chartDays > 1000
                    ? t("chart.time_ranges.all_time")
                    : `${chartDays} days`,
              })}
              value={formatMoney(kpi.netProfit, "vnd")}
              description={
                kpi.grossRevenue > 0
                  ? t("stat_cards.descriptions.profit_margin", {
                      percent: (
                        (kpi.netProfit / kpi.grossRevenue) *
                        100
                      ).toFixed(1),
                    })
                  : t("stat_cards.descriptions.no_revenue")
              }
              icon={FaPiggyBank}
              colorClass="text-blue-500"
            />
            <FinancialKpiCard
              title={t("stat_cards.total_payouts", {
                days:
                  chartDays > 1000
                    ? t("chart.time_ranges.all_time")
                    : `${chartDays} days`,
              })}
              value={formatMoney(kpi.totalPayouts, "vnd")}
              description={
                chartDays > 1000
                  ? t("stat_cards.descriptions.paid_to_partners_all_time")
                  : t("stat_cards.descriptions.paid_to_partners_n_days", {
                      count: chartDays,
                    })
              }
              icon={FaMoneyBillWave}
              colorClass="text-yellow-500"
            />
            <FinancialKpiCard
              title={t("stat_cards.pending_payouts")}
              value={formatMoney(kpi.pendingPayouts, "vnd")}
              description={t("stat_cards.descriptions.pending_requests", {
                count: kpi.pendingPayoutsCount || 0,
              })}
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
              <ErrorDisplay message={t("dashboard_page:chart_error")} />
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
            <ErrorDisplay message={t("dashboard_page:transactions_error")} />
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