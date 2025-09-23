import {
  Helmet,
  PlusButton,
  ResetButton,
  Search,
  ViewButton,
} from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { GiSamuraiHelmet } from "react-icons/gi";
import { progressBoostsHeaders } from "~/constants/headers";
import { filterOrderStatus, filterOrderType } from "~/constants/order";
import { BoostsTable, DataTableLayout } from "~/components/shared/DataTable";
import { useDataTable } from "~/hooks/useDataTable";
import { orderService } from "~/services/order.service";
import { IOrder, IPaginatedResponse } from "~/types";

const ProgressBoostsPage = () => {
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
    swrKey: "/order/get-progress-orders",
    fetcher: orderService.getProgressOrders,
    initialFilters: {
      search: "",
      "filter-status": [],
      "filter-type": [],
    },
    columnConfig: {
      key: "progress-boosts-headers",
      headers: progressBoostsHeaders,
    },
    socketEvent: "statusOrderChange",
  });

  const ordersFromAPI = ordersData?.data || [];
  const paginationFromAPI = ordersData?.pagination;

  return (
    <>
      <Helmet title="Progress Boosts List · CS2Boost" />
      <div>
        <Heading
          icon={GiSamuraiHelmet}
          title="Progress Boosts List"
          subtitle="List of all progress boosts."
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
                      name="status"
                      lists={filterOrderStatus}
                      selectValues={filters["filter-status"] as string[]}
                      setSelectValues={(val) =>
                        setFilter("filter-status", val as string[])
                      }
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
                    headers={progressBoostsHeaders}
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

export default ProgressBoostsPage;
