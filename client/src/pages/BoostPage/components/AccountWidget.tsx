import { useParams } from "react-router-dom";
import { ErrorDisplay, Spinner } from "~/components/shared";
import { IAccount, IOrder } from "~/types";
import { orderService } from "~/services/order.service";
import useSWR from "swr";
import EditAccountWidget from "./EditAccountWidget";
import BlankAccountWidget from "./BlankAccountWidget";

const AccountWidget = () => {
  const { id: boost_id } = useParams<{ id: string }>();

  const {
    data: order,
    error,
    isLoading,
    mutate,
  } = useSWR<IOrder>(boost_id ? `/api/order/${boost_id}` : null, () =>
    orderService.getOrderById(boost_id as string),
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (error || !order) {
    return <ErrorDisplay message={error?.message || "Order not found."} />;
  }

  return order.account ? (
    <EditAccountWidget
      account={order.account as IAccount}
      order={order}
      mutate={mutate}
    />
  ) : (
    <BlankAccountWidget order={order} mutate={mutate} />
  );
};

export default AccountWidget;
