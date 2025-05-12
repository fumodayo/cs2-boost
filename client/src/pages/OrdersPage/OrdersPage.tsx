import { Heading } from "../GameModePage/components";
import { FaCartShopping } from "react-icons/fa6";
import {
  DataTable,
  Helmet,
  Pagination,
  PlusButton,
  ResetButton,
  Search,
  ViewButton,
} from "~/components/shared";
import { useEffect, useState } from "react";
import { useToggleColumns } from "~/hooks/useToggleColumns";
import { ordersHeaders } from "~/constants/headers";
import { IOrderProps } from "~/types";
import { axiosAuth } from "~/axiosAuth";
import { useSearchParams } from "react-router-dom";
import { filterOrderStatus, filterOrderType } from "~/constants/order";

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<IOrderProps[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosAuth.get(
          `/order/get-orders?${searchParams}`,
        );
        const { orders, total } = data;
        setOrders(orders);
        setTotalOrders(total);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [searchParams]);

  const { selectedColumns, visibleHeaders, toggleColumn } = useToggleColumns(
    "orders-headers",
    ordersHeaders,
  );

  const handleReset = () => {
    const params = new URLSearchParams();
    params.delete("filter-type");
    params.delete("filter-status");
    setSearchParams(params);
    setSearchTerm("");
    setFilterStatus([]);
    setFilterType([]);
  };

  return (
    <>
      <Helmet title="Orders List · CS2Boost" />
      <div>
        <Heading
          icon={FaCartShopping}
          title="My Orders"
          subtitle="List of all your products and services."
        />
        <main>
          <div className="mt-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                  {/* SEARCH */}
                  <Search
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  <PlusButton
                    name="status"
                    lists={filterOrderStatus}
                    selectValues={filterStatus}
                    setSelectValues={setFilterStatus}
                  />
                  <PlusButton
                    name="type"
                    lists={filterOrderType}
                    selectValues={filterType}
                    setSelectValues={setFilterType}
                  />
                  {(searchTerm ||
                    filterStatus.length > 0 ||
                    filterType.length > 0) && (
                    <ResetButton onReset={handleReset} />
                  )}
                </div>
                {/* VIEW LIST */}
                <ViewButton
                  headers={ordersHeaders}
                  toggleColumn={toggleColumn}
                  selectedColumns={selectedColumns}
                />
              </div>

              {/* DATA LIST */}
              <DataTable
                headers={visibleHeaders}
                toggleColumn={toggleColumn}
                boosts={orders}
              />

              {/* PAGINATION */}
              <Pagination total={totalOrders} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default OrdersPage;
