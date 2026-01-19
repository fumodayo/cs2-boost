import React, { useState } from "react";
import useSWR from "swr";
import {
  DatePicker,
  Helmet,
  ErrorDisplay,
  PlusButton,
  ResetButton,
  Search,
  ViewButton,
  Heading,
} from "~/components/ui";
import {
  FaFileInvoiceDollar,
  FaChartLine,
  FaPiggyBank,
  FaMoneyBillWave,
} from "react-icons/fa";
import { FinancialKpiCard, PayoutRequestsCard } from "./components";
import { formatMoney } from "~/utils";
import { transactionsHeaders } from "~/constants/headers";
import { useTranslation } from "react-i18next";
import { payoutService } from "~/services/payout.service";
import { revenueService } from "~/services/revenue.service";
import { filterTransactionType } from "~/constants/order";
import { IPaginatedResponse, ITransaction } from "~/types";
import { useDataTable } from "~/hooks/useDataTable";
import { DataTableLayout, TransactionTable } from "~/components/ui/DataTable";
import { TransactionSlidePanel } from "~/components/ui/SlidePanel";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
const ManageRevenuePage: React.FC = () => {
  const { t } = useTranslation(["dashboard_page", "common"]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const {
    data: statsData,
    error: statsError,
    isLoading: isLoadingStats,
  } = useSWR("/revenue/statistics", revenueService.getDashboardStatistics);
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
  const {
    data: transactionsData,
    error,
    isLoading,
    filters,
    setFilter,
    handleReset,
    isAnyFilterActive,
    selectedColumns,
    visibleHeaders,
    toggleColumn,
  } = useDataTable<IPaginatedResponse<ITransaction>>({
    swrKey: "/revenue/transactions",
    fetcher: revenueService.getTransactions,
    initialFilters: {
      search: "",
      type: [],
      startDate: "",
      endDate: "",
    },
    columnConfig: {
      key: "manage-revenue-headers",
      headers: transactionsHeaders,
    },
    socketEvent: "statusOrderChange",
  });
  const transactionsFromAPI = transactionsData?.data || [];
  const paginationFromAPI = transactionsData?.pagination;
  const payoutsFromAPI = payoutsData?.data || [];
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setFilter(
        "startDate",
        range.from ? format(range.from, "yyyy-MM-dd") : "",
      );
      setFilter("endDate", range.to ? format(range.to, "yyyy-MM-dd") : "");
    } else {
      setFilter("startDate", "");
      setFilter("endDate", "");
    }
  };
  const dateRangeValue: DateRange | undefined =
    filters.startDate || filters.endDate
      ? {
          from: filters.startDate
            ? new Date(filters.startDate as string)
            : undefined,
          to: filters.endDate ? new Date(filters.endDate as string) : undefined,
        }
      : undefined;
  const handleTransactionClick = (transaction: ITransaction) => {
    setSelectedTransaction(transaction);
    setIsPanelOpen(true);
  };
  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedTransaction(null);
  };
  return (
    <>
      <Helmet title="manage_revenue_page" />
      <div className="space-y-8 p-4 md:p-8">
        <Heading
          icon={FaFileInvoiceDollar}
          title="manage_revenue_page_title"
          subtitle="manage_revenue_page_subtitle"
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
          <ErrorDisplay message={t("ManageRevenuePage.kpiError")} />
        )}
        {kpi && descriptions && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <FinancialKpiCard
              title={t("stat_cards.gross_revenue")}
              value={formatMoney(kpi.grossRevenue, "vnd")}
              description={descriptions.grossRevenue}
              icon={FaChartLine}
              colorClass="text-green-500"
            />
            <FinancialKpiCard
              title={t("stat_cards.net_profit")}
              value={formatMoney(kpi.netProfit, "vnd")}
              description={descriptions.netProfit}
              icon={FaPiggyBank}
              colorClass="text-blue-500"
            />
            <FinancialKpiCard
              title={t("stat_cards.total_payouts")}
              value={formatMoney(kpi.totalPayouts, "vnd")}
              description={descriptions.totalPayouts}
              icon={FaMoneyBillWave}
              colorClass="text-yellow-500"
            />
            <FinancialKpiCard
              title={t("stat_cards.pending_payouts")}
              value={formatMoney(kpi.pendingPayouts, "vnd")}
              description={descriptions.pendingPayouts}
              icon={FaFileInvoiceDollar}
              colorClass="text-red-500"
            />
          </div>
        )}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DataTableLayout
              filterBar={
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    <Search
                      value={filters.search as string}
                      onChangeValue={(val) => setFilter("search", val)}
                    />
                    <PlusButton
                      name="type"
                      lists={filterTransactionType}
                      selectValues={filters["type"] as string[]}
                      setSelectValues={(val) =>
                        setFilter("type", val as string[])
                      }
                    />
                    <DatePicker
                      value={dateRangeValue}
                      onChange={handleDateRangeChange}
                    />
                    {isAnyFilterActive && <ResetButton onReset={handleReset} />}
                  </div>
                  <div className="flex items-center gap-2">
                    <ViewButton
                      headers={transactionsHeaders}
                      toggleColumn={toggleColumn}
                      selectedColumns={selectedColumns}
                    />
                  </div>
                </div>
              }
              isLoading={isLoading}
              error={error}
              data={transactionsFromAPI}
              pagination={paginationFromAPI}
            >
              {(data) => (
                <TransactionTable
                  data={data}
                  headers={visibleHeaders}
                  toggleColumn={toggleColumn}
                  onTransactionClick={handleTransactionClick}
                />
              )}
            </DataTableLayout>
          </div>
          <div className="lg:col-span-1">
            <PayoutRequestsCard
              data={payoutsFromAPI}
              error={payoutsError}
              isLoading={isLoadingPayouts}
              onActionSuccess={mutatePayouts}
            />
          </div>
        </div>
      </div>
      {/* Transaction Details Slide Panel */}
      <TransactionSlidePanel
        transaction={selectedTransaction}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        isAdmin={true}
      />
    </>
  );
};
export default ManageRevenuePage;