import {
  Helmet,
  PlusButton,
  ResetButton,
  Search,
  ViewButton,
} from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { FaCartShopping } from "react-icons/fa6";
import { ordersHeaders } from "~/constants/headers";
import { filterOrderStatus, filterOrderType } from "~/constants/order";
import { BoostsTable, DataTableLayout } from "~/components/shared/DataTable";
import { useDataTable } from "~/hooks/useDataTable";
import { orderService } from "~/services/order.service";
import { IOrder, IPaginatedResponse } from "~/types";

const OrdersPage = () => {
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
    swrKey: "/order/get-orders",
    fetcher: orderService.getMyOrders,
    initialFilters: {
      search: "",
      "filter-status": [],
      "filter-type": [],
    },
    columnConfig: {
      key: "orders-headers",
      headers: ordersHeaders,
    },
    socketEvent: "statusOrderChange",
  });

  const ordersFromAPI = ordersData?.data || [];
  const paginationFromAPI = ordersData?.pagination;

  return (
    <>
      <Helmet title="Orders List · CS2Boost" />
      <div>
        <Heading
          icon={FaCartShopping}
          title="My Orders"
          subtitle="List of all your products and services."
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
                    headers={ordersHeaders}
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

export default OrdersPage;
