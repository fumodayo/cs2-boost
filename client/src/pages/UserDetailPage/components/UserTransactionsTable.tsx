import React, { useCallback } from "react";
import { useDataTable } from "~/hooks/useDataTable";
import { revenueService } from "~/services/revenue.service";
import { ITransaction, IPaginatedResponse } from "~/types";
import {
  Search,
  PlusButton,
  ResetButton,
  ViewButton,
} from "~/components/shared";
import {
  DataTableLayout,
  TransactionTable,
} from "~/components/shared/DataTable";
import { transactionsHeaders } from "~/constants/headers";
import { filterTransactionType } from "~/constants/order";

interface UserTransactionsTableProps {
  userId: string;
}

const UserTransactionsTable: React.FC<UserTransactionsTableProps> = ({
  userId,
}) => {
  const fetcherWithUserId = useCallback(
    (params: URLSearchParams) => {
      params.set("userId", userId);
      return revenueService.getTransactions(params);
    },
    [userId],
  );

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
    swrKey: `/revenue/transactions/user/${userId}`,
    fetcher: fetcherWithUserId,
    initialFilters: {
      search: "",
      "filter-type": [],
    },
    columnConfig: {
      key: "user-transactions-headers",
      headers: transactionsHeaders,
    },
  });

  const transactionsFromAPI = transactionsData?.data || [];
  const paginationFromAPI = transactionsData?.pagination;

  return (
    <div className="space-y-4">
      <DataTableLayout
        filterBar={
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
  );
};

export default UserTransactionsTable;
