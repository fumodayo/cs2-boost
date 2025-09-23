import { Helmet, ResetButton, Search, ViewButton } from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { FaWallet } from "react-icons/fa6";
import { walletHeaders } from "~/constants/headers";
import { ReceiptsTable, DataTableLayout } from "~/components/shared/DataTable";
import { useDataTable } from "~/hooks/useDataTable";
import { receiptService } from "~/services/receipt.service";
import { IReceipt, IPaginatedResponse } from "~/types";

const WalletPage = () => {
  const {
    data: receiptsData,
    error,
    isLoading,
    filters,
    setFilter,
    handleReset,
    isAnyFilterActive,
    selectedColumns,
    visibleHeaders,
    toggleColumn,
  } = useDataTable<IPaginatedResponse<IReceipt>>({
    swrKey: "/receipt/get-receipts",
    fetcher: receiptService.getReceipts,
    initialFilters: {
      search: "",
    },
    columnConfig: {
      key: "wallet-headers",
      headers: walletHeaders,
    },
  });

  const receiptsFromAPI = receiptsData?.data || [];
  const paginationFromAPI = receiptsData?.pagination;

  return (
    <>
      <Helmet title="My Wallet · CS2Boost" />
      <div>
        <Heading
          icon={FaWallet}
          title="My Wallet"
          subtitle="List of all your payments and transactions."
        />
        <main className="mt-8">
          <div className="space-y-4">
            <DataTableLayout
              filterBar={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    <Search
                      value={filters.search as string}
                      onChangeValue={(val) => setFilter("search", val)}
                    />
                    {isAnyFilterActive && <ResetButton onReset={handleReset} />}
                  </div>

                  <ViewButton
                    headers={walletHeaders}
                    toggleColumn={toggleColumn}
                    selectedColumns={selectedColumns}
                  />
                </div>
              }
              isLoading={isLoading}
              error={error}
              data={receiptsFromAPI}
              pagination={paginationFromAPI}
            >
              {(data) => (
                <ReceiptsTable
                  headers={visibleHeaders}
                  toggleColumn={toggleColumn}
                  receipts={data}
                />
              )}
            </DataTableLayout>
          </div>
        </main>
      </div>
    </>
  );
};

export default WalletPage;
