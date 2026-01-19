import {
  DatePicker,
  Heading,
  Helmet,
  PlusButton,
  ResetButton,
  Search,
  ViewButton,
} from "~/components/ui";
import { FaCartShopping } from "react-icons/fa6";
import { ordersHeaders } from "~/constants/headers";
import { filterOrderStatus, filterOrderType } from "~/constants/order";
import { BoostsTable, DataTableLayout } from "~/components/ui/DataTable";
import { useDataTable } from "~/hooks/useDataTable";
import { orderService } from "~/services/order.service";
import { IOrder, IPaginatedResponse } from "~/types";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
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
      startDate: "",
      endDate: "",
    },
    columnConfig: {
      key: "orders-headers",
      headers: ordersHeaders,
    },
    socketEvent: "statusOrderChange",
  });
  const ordersFromAPI = ordersData?.data || [];
  const paginationFromAPI = ordersData?.pagination;
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
      <Helmet title="orders_page" />
      <div>
        <Heading
          icon={FaCartShopping}
          title="orders_page_title"
          subtitle="orders_page_subtitle"
        />
        <main className="mt-8">
          <div className="space-y-4">
            <DataTableLayout
              filterBar={
                <div className="space-y-3 sm:space-y-0">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                      <DatePicker
                        value={dateRangeValue}
                        onChange={handleDateRangeChange}
                      />
                      {isAnyFilterActive && (
                        <ResetButton onReset={handleReset} />
                      )}
                    </div>
                    <div className="flex justify-end">
                      <ViewButton
                        headers={ordersHeaders}
                        toggleColumn={toggleColumn}
                        selectedColumns={selectedColumns}
                      />
                    </div>
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