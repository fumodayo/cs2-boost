import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
import toast from "react-hot-toast";

import { Helmet, Spinner, ErrorDisplay } from "~/components/ui";
import {
  AccountWidget,
  BoosterWidget,
  Header,
  ReviewWidget,
  WidgetList,
} from "./components";
import { useSocketContext } from "~/hooks/useSocketContext";
import { orderService } from "~/services/order.service";
import { RootState } from "~/redux/store";
import { ORDER_STATUS } from "~/constants/order";
import { Button } from "~/components/ui/Button";
import { isUserObject } from "~/utils/typeGuards";
import { ROLE } from "~/types/constants";

const BoostPage = () => {
  const { t } = useTranslation(["boost_page", "common"]);

  const navigate = useNavigate();
  const { id: boost_id } = useParams<{ id: string }>();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { socket } = useSocketContext();

  const swrKey = boost_id ? `/order/${boost_id}` : null;
  const {
    data: order,
    error,
    isLoading,
    mutate,
  } = useSWR(swrKey, () =>
    boost_id ? orderService.getOrderById(boost_id) : Promise.reject("No ID"),
  );

  useEffect(() => {
    const handleStatusChange = () => {
      toast.success(t("common:toasts.order_status_updated"));
      mutate();
    };
    socket?.on("statusOrderChange", handleStatusChange);
    return () => {
      socket?.off("statusOrderChange", handleStatusChange);
    };
  }, [socket, mutate, t]);

  const isAccessAllowed = useCallback(() => {
    if (!order || !currentUser) return false;

    const { status, user, partner, assign_partner } = order;

    switch (status) {
      case ORDER_STATUS.PENDING:
        return (
          isUserObject(user) && String(currentUser._id) === String(user._id)
        );
      case ORDER_STATUS.WAITING:
        return (
          (isUserObject(assign_partner) &&
            String(currentUser._id) === String(assign_partner._id)) ||
          (isUserObject(user) && String(currentUser._id) === String(user._id))
        );
      case ORDER_STATUS.IN_ACTIVE:
        return (
          (!partner && currentUser.role?.includes(ROLE.PARTNER)) ||
          (isUserObject(user) && String(currentUser._id) === String(user._id))
        );
      case ORDER_STATUS.IN_PROGRESS:
      case ORDER_STATUS.CANCEL:
      case ORDER_STATUS.COMPLETED:
        return (
          (isUserObject(partner) &&
            String(currentUser._id) === String(partner._id)) ||
          (isUserObject(user) && String(currentUser._id) === String(user._id))
        );
      default:
        return false;
    }
  }, [order, currentUser]);

  useEffect(() => {
    if (!isLoading && order && !isAccessAllowed()) {
      toast.error(t("boost_page:errors.access_denied"));
      navigate("/orders");
    }
  }, [isLoading, order, isAccessAllowed, navigate, currentUser, t]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <ErrorDisplay
        message={t("boost_page:errors.load_failed")}
        onRetry={mutate}
      />
    );
  }

  if (!isAccessAllowed()) {
    return null;
  }

  return (
    <>
      <Helmet isTranslate title={order.title} />
      <main className="col-span-1 px-2 lg:col-span-1">
        <Link
          to={".."}
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          <Button
            variant="secondary"
            className="mb-4 flex w-fit rounded-md px-2 py-1.5 text-xs"
          >
            <FaArrowLeft className="mr-2" />
            {t("common:go_back")}
          </Button>
        </Link>
        <Header {...order} />
        <div className="mt-8">
          <div className="mx-auto grid grid-cols-1 grid-rows-1 items-start gap-y-5 xl:mx-0 xl:grid-cols-3 xl:gap-x-5">
            <div className="column-grid columns-1 space-y-4 md:columns-2 xl:col-start-3 xl:row-end-1 xl:columns-1 xl:space-y-6">
              <BoosterWidget
                partner={order.partner}
                assign_partner={order.assign_partner}
                orderId={order._id}
              />
              <AccountWidget />
              {order.status === ORDER_STATUS.COMPLETED && (
                <ReviewWidget {...order} onUpdate={mutate} />
              )}
            </div>
            <WidgetList {...order} />
          </div>
        </div>
      </main>
    </>
  );
};

export default BoostPage;