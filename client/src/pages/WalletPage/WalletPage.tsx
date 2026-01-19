import {
  DatePicker,
  Heading,
  Helmet,
  ResetButton,
  Search,
  ViewButton,
} from "~/components/ui";
import { FaWallet } from "react-icons/fa6";
import { walletHeaders } from "~/constants/headers";
import { ReceiptsTable, DataTableLayout } from "~/components/ui/DataTable";
import { useDataTable } from "~/hooks/useDataTable";
import { receiptService } from "~/services/receipt.service";
import { IReceipt, IPaginatedResponse } from "~/types";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
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
      startDate: "",
      endDate: "",
    },
    columnConfig: {
      key: "wallet-headers",
      headers: walletHeaders,
    },
  });
  const receiptsFromAPI = receiptsData?.data || [];
  const paginationFromAPI = receiptsData?.pagination;
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
  return (
    <>
      <Helmet title="wallet_page" />
      <div>
        <Heading
          icon={FaWallet}
          title="wallet_page_title"
          subtitle="wallet_page_subtitle"
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
                    <DatePicker
                      value={dateRangeValue}
                      onChange={handleDateRangeChange}
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