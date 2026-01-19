import { useState } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  FaBoxOpen,
  FaCoins,
  FaMoneyBillTrendUp,
  FaWallet,
} from "react-icons/fa6";
import { MdArrowOutward } from "react-icons/md";
import {
  DatePicker,
  Heading,
  Helmet,
  PlusButton,
  ResetButton,
  Search,
  ViewButton,
  Spinner,
  ErrorDisplay,
} from "~/components/ui";
import { Button } from "~/components/ui/Button";
import { DataTableLayout, TransactionTable } from "~/components/ui/DataTable";
import { TransactionSlidePanel } from "~/components/ui/SlidePanel";
import { useDataTable } from "~/hooks/useDataTable";
import { formatMoney } from "~/utils";
import { walletService } from "~/services/wallet.service";
import { partnerTransactionsHeaders } from "~/constants/headers";
import { IWallet, ITransaction, IPaginatedResponse } from "~/types";
import { StatCard, RequestPayoutModal, DashboardChartCard } from "./components";
const partnerTransactionTypes = [
  { translationKey: "commission", value: "PARTNER_COMMISSION" },
  { translationKey: "payout", value: "PAYOUT" },
  { translationKey: "penalty", value: "PENALTY" },
];
interface IStatisticsData {
  stats: IWallet;
  recentTransactions: ITransaction[];
}
const IncomePage = () => {
  const { t } = useTranslation(["income_page", "common"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const {
    data: WalletData,
    error: walletError,
    isLoading: isLoadingWallet,
    mutate: mutateWallet,
  } = useSWR<IStatisticsData>(
    "/wallet/partner-stats",
    walletService.getMyWalletStats,
  );
  const {
    data: transactionsData,
    error: transactionsError,
    isLoading: isLoadingTransactions,
    filters,
    setFilter,
    handleReset,
    isAnyFilterActive,
    selectedColumns,
    visibleHeaders,
    toggleColumn,
  } = useDataTable<IPaginatedResponse<ITransaction>>({
    swrKey: "/wallet/me/transactions",
    fetcher: walletService.getMyTransactions,
    initialFilters: {
      search: "",
      type: [],
      startDate: "",
      endDate: "",
    },
    columnConfig: {
      key: "partner-income-headers",
      headers: partnerTransactionsHeaders,
    },
  });
  const transactionsFromAPI = transactionsData?.data || [];
  const paginationFromAPI = transactionsData?.pagination;
  const handlePayoutSuccess = () => {
    toast.success(t("common:toasts.payout_request_success"));
    setIsModalOpen(false);
    mutateWallet();
  };
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
  if (isLoadingWallet) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-lg font-medium text-muted-foreground">
          {t("loading_message")}
        </p>
      </div>
    );
  }
  if (walletError || !WalletData) {
    return <ErrorDisplay message={t("error_message")} onRetry={mutateWallet} />;
  }
  const { stats } = WalletData;
  const financialChartData = {
    labels: [
      t("chart.available_balance"),
      t("chart.potential_revenue"),
      t("chart.pending_payouts"),
    ],
    datasets: [
      {
        label: t("chart.label"),
        data: [stats.balance, stats.escrow_balance, stats.pending_withdrawal],
        backgroundColor: ["#28a745", "#0a6cfb", "#ffc107"],
        borderColor: ["#28a745B3", "#0a6cfbB3", "#ffc107B3"],
        borderWidth: 1,
      },
    ],
  };
  return (
    <>
      <Helmet title="income_page" />
      <RequestPayoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentBalance={stats.balance}
        onSuccess={handlePayoutSuccess}
      />
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Heading
            icon={FaMoneyBillTrendUp}
            title="income_page_title"
            subtitle="income_page_subtitle"
          />
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            disabled={stats.balance <= 50000}
            title={stats.balance <= 50000 ? t("minimum_balance_tooltip") : ""}
          >
            {t("request_payout_btn")}
            <MdArrowOutward className="ml-1" />
          </Button>
        </div>
        <main className="mt-8 space-y-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title={t("stat_cards.available_balance")}
              value={formatMoney(stats.balance, "vnd")}
              icon={FaWallet}
              color="text-green-500"
            />
            <StatCard
              title={t("stat_cards.potential_revenue")}
              value={formatMoney(stats.escrow_balance, "vnd")}
              icon={FaBoxOpen}
              color="text-blue-500"
            />
            <StatCard
              title={t("stat_cards.pending_payouts")}
              value={formatMoney(stats.pending_withdrawal, "vnd")}
              icon={FaCoins}
              color="text-yellow-500"
            />
            <StatCard
              title={t("stat_cards.total_earnings")}
              value={formatMoney(stats.total_earnings, "vnd")}
              icon={FaMoneyBillTrendUp}
              color="text-indigo-500"
            />
          </div>
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
                        lists={partnerTransactionTypes}
                        selectValues={filters["type"] as string[]}
                        setSelectValues={(val) =>
                          setFilter("type", val as string[])
                        }
                      />
                      <DatePicker
                        value={dateRangeValue}
                        onChange={handleDateRangeChange}
                      />
                      {isAnyFilterActive && (
                        <ResetButton onReset={handleReset} />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <ViewButton
                        headers={partnerTransactionsHeaders}
                        toggleColumn={toggleColumn}
                        selectedColumns={selectedColumns}
                      />
                    </div>
                  </div>
                }
                isLoading={isLoadingTransactions}
                error={transactionsError}
                data={transactionsFromAPI}
                pagination={paginationFromAPI}
              >
                {(data) => (
                  <TransactionTable
                    data={data}
                    headers={visibleHeaders}
                    toggleColumn={toggleColumn}
                    isAdmin={false}
                    onTransactionClick={handleTransactionClick}
                  />
                )}
              </DataTableLayout>
            </div>
            <div className="lg:col-span-1">
              <DashboardChartCard
                title={t("chart.title")}
                chartData={financialChartData}
              />
            </div>
          </div>
        </main>
      </div>
      {/* Transaction Details Slide Panel */}
      <TransactionSlidePanel
        transaction={selectedTransaction}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        isAdmin={false}
      />
    </>
  );
};
export default IncomePage;