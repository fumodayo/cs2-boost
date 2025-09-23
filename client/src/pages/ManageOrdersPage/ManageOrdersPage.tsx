import { FaUserShield } from "react-icons/fa6";
import { Heading } from "../GameModePage/components";
import {
  Helmet,
  PlusButton,
  ResetButton,
  Search,
  ViewButton,
} from "~/components/shared";
import { adminOrdersHeaders } from "~/constants/headers";
import { filterOrderStatus, filterOrderType } from "~/constants/order";
import { BoostsTable, DataTableLayout } from "~/components/shared/DataTable";
import { adminService } from "~/services/admin.service";
import { IOrder, IPaginatedResponse } from "~/types"; //
import { useDataTable } from "~/hooks/useDataTable";

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
    },
    columnConfig: {
      key: "admin-orders-headers",
      headers: adminOrdersHeaders,
    },
    socketEvent: "statusOrderChange",
  });

  const ordersFromAPI = ordersData?.data;
  const paginationFromAPI = ordersData?.pagination;

  return (
    <>
      <Helmet title="Orders List · CS2Boost" />
      <div>
        <Heading
          icon={FaUserShield}
          title="Manage Orders"
          subtitle="Manage all orders across the platform."
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
