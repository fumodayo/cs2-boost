import React, { useCallback } from "react";
import { ordersHeaders } from "~/constants/headers";
import { IOrder, IPaginatedResponse } from "~/types";
import {
  Search,
  PlusButton,
  ResetButton,
  ViewButton,
} from "~/components/shared";
import { DataTableLayout, BoostsTable } from "~/components/shared/DataTable";
import { useDataTable } from "~/hooks/useDataTable";
import { filterOrderStatus } from "~/constants/order";
import { adminService } from "~/services/admin.service";

interface UserOrdersTableProps {
  userId: string;
}

const UserOrdersTable: React.FC<UserOrdersTableProps> = ({ userId }) => {
  const fetcherWithUserId = useCallback(() => {
    return adminService.getAdminOrders(userId!);
  }, [userId]);

  const {
    data: ordersData,
    error,
    isLoading,
    filters,
    setFilter,
    handleReset,
    isAnyFilterActive,
    selectedColumns,
    visibleHeaders,
    toggleColumn,
  } = useDataTable<IPaginatedResponse<IOrder>>({
    swrKey: `/admin/orders?userId=${userId}`,
    fetcher: fetcherWithUserId,
    initialFilters: {
      search: "",
      "filter-status": [],
    },
    columnConfig: {
      key: "user-orders-headers",
      headers: ordersHeaders,
    },
  });

  const ordersFromAPI = ordersData?.data || [];
  const paginationFromAPI = ordersData?.pagination;

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
                name="status"
                lists={filterOrderStatus}
                selectValues={filters["filter-status"] as string[]}
                setSelectValues={(val) =>
                  setFilter("filter-status", val as string[])
                }
              />
              {isAnyFilterActive && <ResetButton onReset={handleReset} />}
            </div>
            <div className="flex items-center gap-2">
              <ViewButton
                headers={ordersHeaders}
                toggleColumn={toggleColumn}
                selectedColumns={selectedColumns}
              />
            </div>
          </div>
        }
        isLoading={isLoading}
        error={error}
        data={ordersFromAPI}
        pagination={paginationFromAPI}
      >
        {(data) => (
          <BoostsTable
            boosts={data}
            headers={visibleHeaders}
            toggleColumn={toggleColumn}
            isAdmin
          />
        )}
      </DataTableLayout>
    </div>
  );
};

export default UserOrdersTable;
