import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Helmet } from "~/components/shared";
import {
  AccountWidget,
  BoosterWidget,
  Header,
  ReviewWidget,
  WidgetList,
} from "./components";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { axiosAuth } from "~/axiosAuth";
import { IOrderProps } from "~/types";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { ROLE_USER } from "~/constants/user";
import { ORDER_STATUS } from "~/constants/order";
import { useSocketContext } from "~/hooks/useSocketContext";

const BoostPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: boost_id } = useParams();
  const [order, setOrder] = useState<IOrderProps>({});
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { socket } = useSocketContext();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosAuth.get(
          `/order/get-order-by-id/${boost_id}`,
        );
        setOrder(data);
      } catch (e) {
        toast.error("Something went wrong");
      }
    })();
  }, [boost_id]);

  useEffect(() => {
    socket?.on("statusOrderChange", async () => {
      try {
        const { data } = await axiosAuth.get(
          `/order/get-order-by-id/${boost_id}`,
        );
        setOrder(data);
      } catch (e) {
        console.error(e);
      }
    });

    return () => {
      socket?.off("statusOrderChange");
    };
  }, [socket, boost_id]);

  const { partner, account, user, assign_partner } = order;
  console.log({ order });

  const checkAccess = useCallback(() => {
    switch (order.status) {
      case ORDER_STATUS.PENDING:
        return user && currentUser?.user_id === user.user_id;
      case ORDER_STATUS.WAITING:
        return (
          (assign_partner &&
            currentUser?.user_id === assign_partner?.user_id) ||
          (user && currentUser?.user_id === user.user_id)
        );
      case ORDER_STATUS.IN_ACTIVE:
        return (
          (!partner && currentUser?.role?.includes(ROLE_USER.PARTNER)) ||
          (user && currentUser?.user_id === user.user_id)
        );
      case ORDER_STATUS.IN_PROGRESS:
      case ORDER_STATUS.CANCEL:
      case ORDER_STATUS.COMPLETED:
        return (
          (partner && currentUser?.user_id === partner.user_id) ||
          (user && currentUser?.user_id === user.user_id)
        );
      default:
        return false;
    }
  }, [order.status, currentUser, assign_partner, partner, user]);

  const isAccess = checkAccess();

  if (!isAccess) {
    navigate("/orders");
    return null;
  }

  return (
    <>
      <Helmet title={order.title} />
      <main className="col-span-1 px-2 lg:col-span-1">
        {/* GO BACK BUTTON */}
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
            {t("Globals.Go Back")}
          </Button>
        </Link>

        {/* HEADER */}
        <Header {...order} />

        {/* CONTENT */}
        <div className="mt-8">
          <div className="mx-auto grid grid-cols-1 grid-rows-1 items-start gap-y-5 xl:mx-0 xl:grid-cols-3 xl:gap-x-5">
            <div className="column-grid columns-1 space-y-4 md:columns-2 xl:col-start-3 xl:row-end-1 xl:columns-1 xl:space-y-6">
              <BoosterWidget
                partner={partner}
                assign_partner={assign_partner}
              />
              <AccountWidget {...account} />
              <ReviewWidget {...order} />
            </div>
            <WidgetList {...order} />
          </div>
        </div>
      </main>
    </>
  );
};

export default BoostPage;
