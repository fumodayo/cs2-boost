import { useTranslation } from "react-i18next";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import useSWR from "swr";
import { ErrorDisplay, Helmet, Spinner } from "~/components/ui";
import { Button } from "~/components/ui/Button";
import { WidgetList } from "../BoostPage/components";
import {
  AdminAccountWidget,
  AdminBoosterWidget,
  AdminHeader,
  AdminReviewWidget,
  AdminUserWidget,
  StatusHistoryWidget,
} from "./components";
import { orderService } from "~/services/order.service";

const OrderDetailPage = () => {
  const { t } = useTranslation();
  const { id: boost_id } = useParams<{ id: string }>();

  const swrKey = boost_id ? `/order/${boost_id}` : null;
  const {
    data: order,
    error,
    isLoading,
    mutate,
  } = useSWR(swrKey, () =>
    boost_id ? orderService.getOrderById(boost_id) : Promise.reject("No ID"),
  );
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <ErrorDisplay message="Failed to load order details." onRetry={mutate} />
    );
  }

  return (
    <>
      <Helmet title={`Admin - Order ${order.boost_id}`} />
      <main className="col-span-1 px-2 lg:col-span-1">
        <Link to="/admin/orders">
          <Button
            variant="secondary"
            className="mb-4 flex w-fit rounded-md px-2 py-1.5 text-xs"
          >
            <FaArrowLeft className="mr-2" />
            {t("Globals.Go Back")}
          </Button>
        </Link>

        <AdminHeader order={order} />

        <div className="mt-8">
          <div className="mx-auto grid grid-cols-1 grid-rows-1 items-start gap-y-5 xl:mx-0 xl:grid-cols-3 xl:gap-x-5">
            <div className="column-grid columns-1 space-y-4 md:columns-2 xl:col-start-3 xl:row-end-1 xl:columns-1 xl:space-y-6">
              <AdminUserWidget user={order.user} />
              <AdminBoosterWidget
                partner={order.partner}
                assign_partner={order.assign_partner}
                orderId={order._id}
                onUpdate={mutate}
              />
              <AdminAccountWidget account={order.account} />
              <AdminReviewWidget review={order.review} />
            </div>

            <div className="row-start-1 space-y-4 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:space-y-6">
              <WidgetList {...order} />
              <StatusHistoryWidget history={order.status_history} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default OrderDetailPage;