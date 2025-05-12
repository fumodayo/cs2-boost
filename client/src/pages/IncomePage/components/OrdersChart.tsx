import { FaCartShopping } from "react-icons/fa6";
import { Stacked } from "~/components/shared";
import { IOrderProps } from "~/types";
import { createStackedOrderChart, IStackedProps } from "~/utils/stackedData";

const OrdersChart = (props: IStackedProps) => {
  const { records } = props;
  const data = createStackedOrderChart(
    props.completed,
    props.in_progress,
    props.cancel,
  );

  return (
    <Stacked
      title="Total Orders"
      icon={FaCartShopping}
      data={data}
      records={records as IOrderProps[]}
      direct="/progress-boosts"
    />
  );
};

export default OrdersChart;
