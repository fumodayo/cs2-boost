import React from "react";
import useSWR from "swr";
import {
  Helmet,
  ErrorDisplay,
  PlusButton,
  ResetButton,
  Search,
  ViewButton,
} from "~/components/shared";
import { Heading } from "../GameModePage/components";
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
import {
  DataTableLayout,
  TransactionTable,
} from "~/components/shared/DataTable";

const ManageRevenuePage: React.FC = () => {
  const { t } = useTranslation();

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
      "filter-type": [],
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

  return (
    <>
      <Helmet title="Manage Revenue · CS2Boost" />
      <div className="space-y-8 p-4 md:p-8">
        <Heading
          icon={FaFileInvoiceDollar}
          title="Manage Revenue"
          subtitle="Track, filter, and manage all financial activities on the platform."
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
              title={t("ManageRevenuePage.StatCards.grossRevenue")}
              value={formatMoney(kpi.grossRevenue, "vnd")}
              description={descriptions.grossRevenue}
              icon={FaChartLine}
              colorClass="text-green-500"
            />
            <FinancialKpiCard
              title={t("ManageRevenuePage.StatCards.netProfit")}
              value={formatMoney(kpi.netProfit, "vnd")}
              description={descriptions.netProfit}
              icon={FaPiggyBank}
              colorClass="text-blue-500"
            />
            <FinancialKpiCard
              title={t("ManageRevenuePage.StatCards.totalPayouts")}
              value={formatMoney(kpi.totalPayouts, "vnd")}
              description={descriptions.totalPayouts}
              icon={FaMoneyBillWave}
              colorClass="text-yellow-500"
            />
            <FinancialKpiCard
              title={t("ManageRevenuePage.StatCards.pendingPayouts")}
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
                      selectValues={filters["filter-type"] as string[]}
                      setSelectValues={(val) =>
                        setFilter("filter-type", val as string[])
                      }
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
    </>
  );
};

export default ManageRevenuePage;
