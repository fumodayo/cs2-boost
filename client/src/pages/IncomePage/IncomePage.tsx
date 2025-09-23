import { useState, useMemo } from "react";
import { Helmet } from "~/components/shared";
import { Heading } from "../GameModePage/components";
import {
  FaBoxOpen,
  FaCoins,
  FaMoneyBillTrendUp,
  FaWallet,
} from "react-icons/fa6";
import useSWR from "swr";
import { toast } from "react-hot-toast";

import { formatMoney } from "~/utils";
import {
  StatCard,
  RecentTransactionsTable,
  RequestPayoutModal,
  DashboardChartCard,
} from "./components";
import { Spinner, ErrorDisplay } from "~/components/shared";
import { IWallet, ITransaction } from "~/types";
import { Button } from "~/components/shared/Button";
import { MdArrowOutward } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { walletService } from "~/services/wallet.service";
interface IStatisticsData {
  stats: IWallet;
  recentTransactions: ITransaction[];
}

const IncomePage = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: WalletData,
    error,
    isLoading,
    mutate,
  } = useSWR<IStatisticsData>(
    "/wallet/partner-stats",
    walletService.getMyWalletStats,
  );

  console.log({ WalletData });

  const handlePayoutSuccess = () => {
    toast.success("Payout request submitted successfully!");
    setIsModalOpen(false);
    mutate();
  };

  const financialChartData = useMemo(() => {
    if (!WalletData?.stats) return null;
    const { balance, escrow_balance, pending_withdrawal } = WalletData.stats;

    return {
      labels: [
        t("IncomePage.Chart.availableBalance"),
        t("IncomePage.Chart.potentialRevenue"),
        t("IncomePage.Chart.pendingPayouts"),
      ],
      datasets: [
        {
          label: t("IncomePage.Chart.label"),
          data: [balance, escrow_balance, pending_withdrawal],
          backgroundColor: ["#28a745", "#0a6cfb", "#ffc107"],
          borderColor: ["#28a745B3", "#0a6cfbB3", "#ffc107B3"],
          borderWidth: 1,
        },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [WalletData]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-lg font-medium text-muted-foreground">
          Loading Your Financial Data...
        </p>
      </div>
    );
  }

  if (error || !WalletData) {
    return (
      <ErrorDisplay
        message="Failed to load statistics. Please try again."
        onRetry={mutate}
      />
    );
  }

  const { stats, recentTransactions } = WalletData;

  return (
    <>
      <Helmet title="Income · CS2Boost" />
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
            title="My Income"
            subtitle="Track your earnings and request payouts."
          />
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            disabled={stats.balance <= 50000}
            title={
              stats.balance <= 50000
                ? t("IncomePage.minimumBalanceTooltip")
                : ""
            }
          >
            {t("IncomePage.requestPayoutBtn")}
            <MdArrowOutward className="ml-1" />
          </Button>
        </div>

        <main className="mt-8 space-y-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title={t("IncomePage.StatCards.availableBalance")}
              value={formatMoney(stats.balance, "vnd")}
              icon={FaWallet}
              color="text-green-500"
            />
            <StatCard
              title={t("IncomePage.StatCards.potentialRevenue")}
              value={formatMoney(stats.escrow_balance, "vnd")}
              icon={FaBoxOpen}
              color="text-blue-500"
            />
            <StatCard
              title={t("IncomePage.StatCards.pendingPayouts")}
              value={formatMoney(stats.pending_withdrawal, "vnd")}
              icon={FaCoins}
              color="text-yellow-500"
            />
            <StatCard
              title={t("IncomePage.StatCards.totalEarnings")}
              value={formatMoney(stats.total_earnings, "vnd")}
              icon={FaMoneyBillTrendUp}
              color="text-indigo-500"
            />
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentTransactionsTable records={recentTransactions} />
            </div>
            <div className="lg:col-span-1">
              {financialChartData && (
                <DashboardChartCard
                  title={t("IncomePage.Chart.title")}
                  chartData={financialChartData}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default IncomePage;
