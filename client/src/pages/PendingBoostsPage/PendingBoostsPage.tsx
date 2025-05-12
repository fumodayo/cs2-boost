import {
  DataTable,
  Helmet,
  Pagination,
  PlusButton,
  ResetButton,
  Search,
  ViewButton,
} from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { MdOutlinePendingActions } from "react-icons/md";
import { useEffect, useState } from "react";
import { pendingBoostsHeaders } from "~/constants/headers";
import { useToggleColumns } from "~/hooks/useToggleColumns";
import { IOrderProps } from "~/types";
import { axiosAuth } from "~/axiosAuth";
import { useSearchParams } from "react-router-dom";
import { filterOrderType } from "~/constants/order";

const PendingBoostsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<IOrderProps[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterType, setFilterType] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosAuth.get(
          `/order/get-pending-orders?${searchParams}`,
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
    "pending-boosts-headers",
    pendingBoostsHeaders,
  );

  const handleReset = () => {
    const params = new URLSearchParams();
    params.delete("filter-type");
    setSearchParams(params);
    setSearchTerm("");
    setFilterType([]);
  };

  return (
    <>
      <Helmet title="Pending Boosts List · CS2Boost" />
      <div>
        <Heading
          icon={MdOutlinePendingActions}
          title="Pending Boosts List"
          subtitle="List of all pending boosts."
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
                    name="type"
                    lists={filterOrderType}
                    selectValues={filterType}
                    setSelectValues={setFilterType}
                  />
                  {(searchTerm || filterType.length > 0) && (
                    <ResetButton onReset={handleReset} />
                  )}
                </div>
                {/* VIEW LIST */}
                <ViewButton
                  headers={pendingBoostsHeaders}
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

export default PendingBoostsPage;
