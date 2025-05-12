import { Helmet } from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { OrdersChart, RevenueChart } from "./components";
import { useEffect, useState } from "react";
import { axiosAuth } from "~/axiosAuth";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { IStackedProps } from "~/utils/stackedData";

const IncomePage = () => {
  const [orders, setOrders] = useState({} as IStackedProps);
  const [revenue, setRevenue] = useState({} as IStackedProps);

  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosAuth.get(`/statistics/${currentUser?._id}`);
        const { orders, revenue } = data;
        console.log({ data });
        setOrders(orders);
        setRevenue(revenue);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [currentUser?._id]);

  return (
    <>
      <Helmet title="Income · CS2Boost" />
      <div>
        <Heading
          icon={FaMoneyBillTrendUp}
          title="Income"
          subtitle="View and update your income."
        />
        <main>
          <div className="mt-8">
            <div className="space-y-4">
              <div className="mx-auto grid grid-cols-1 gap-y-5 xl:grid-cols-2 xl:gap-x-5">
                <OrdersChart {...orders} />
                <RevenueChart {...revenue} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default IncomePage;
