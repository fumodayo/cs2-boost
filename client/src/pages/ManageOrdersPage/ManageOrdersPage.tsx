import { FaUserShield } from "react-icons/fa6";
import {
  DatePicker,
  Heading,
  Helmet,
  PlusButton,
  ResetButton,
  Search,
  ViewButton,
} from "~/components/ui";
import { adminOrdersHeaders } from "~/constants/headers";
import { filterOrderStatus, filterOrderType } from "~/constants/order";
import { BoostsTable, DataTableLayout } from "~/components/ui/DataTable";
import { adminService } from "~/services/admin.service";
import { IOrder, IPaginatedResponse } from "~/types"; 
import { useDataTable } from "~/hooks/useDataTable";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
const ManageOrdersPage = () => {
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
    swrKey: "/admin/orders",
    fetcher: adminService.getAdminOrders,
    initialFilters: {
      search: "",
      "filter-status": [],
      "filter-type": [],
      startDate: "",
      endDate: "",
    },
    columnConfig: {
      key: "admin-orders-headers",
      headers: adminOrdersHeaders,
    },
    socketEvent: "statusOrderChange",
  });
  const ordersFromAPI = ordersData?.data;
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
      <Helmet title="manage_orders_page" />
      <div>
        <Heading
          icon={FaUserShield}
          title="manage_orders_page_title"
          subtitle="manage_orders_page_subtitle"
        />
        <main>
          <div className="mt-8">
            <div className="space-y-4">
              <DataTableLayout
                filterBar={
                  <div className="flex items-center justify-between">
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
                    <ViewButton
                      headers={adminOrdersHeaders}
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
                    isAdmin={true}
                  />
                )}
              </DataTableLayout>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
export default ManageOrdersPage;
