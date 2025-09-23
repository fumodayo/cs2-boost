import {
  Helmet,
  PlusButton,
  ResetButton,
  Search,
  ViewButton,
} from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { MdOutlinePendingActions } from "react-icons/md";
import { pendingBoostsHeaders } from "~/constants/headers";
import { filterOrderType } from "~/constants/order";
import { BoostsTable, DataTableLayout } from "~/components/shared/DataTable";
import { useDataTable } from "~/hooks/useDataTable";
import { orderService } from "~/services/order.service";
import { IOrder, IPaginatedResponse } from "~/types";

const PendingBoostsPage = () => {
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
    swrKey: "/order/pending",
    fetcher: orderService.getPendingOrders,
    initialFilters: {
      search: "",
      "filter-type": [],
    },
    columnConfig: {
      key: "pending-boosts-headers",
      headers: pendingBoostsHeaders,
    },
    socketEvent: "statusOrderChange",
  });

  const ordersFromAPI = ordersData?.data || [];
  const paginationFromAPI = ordersData?.pagination;

  return (
    <>
      <Helmet title="Pending Boosts List · CS2Boost" />
      <div>
        <Heading
          icon={MdOutlinePendingActions}
          title="Pending Boosts List"
          subtitle="List of all pending boosts."
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
                    <PlusButton
                      name="type"
                      lists={filterOrderType}
                      selectValues={filters["filter-type"] as string[]}
                      setSelectValues={(val) =>
                        setFilter("filter-type", val as string[])
                      }
                    />
                    {isAnyFilterActive && <ResetButton onReset={handleReset} />}
                  </div>
                  <ViewButton
                    headers={pendingBoostsHeaders}
                    toggleColumn={toggleColumn}
                    selectedColumns={selectedColumns}
                  />
                </div>
              }
              isLoading={isLoading}
              error={error}
              data={ordersFromAPI}
              pagination={paginationFromAPI}
            >
              {(data) => (
                <BoostsTable
                  headers={visibleHeaders}
                  toggleColumn={toggleColumn}
                  boosts={data}
                />
              )}
            </DataTableLayout>
          </div>
        </main>
      </div>
    </>
  );
};

export default PendingBoostsPage;
