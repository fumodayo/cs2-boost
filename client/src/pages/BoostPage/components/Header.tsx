import { Link, useNavigate } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";
import { HiMiniRocketLaunch } from "react-icons/hi2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/@radix-ui/Dropdown";
import { Button, Copy } from "~/components/shared";
import { IOrderProps } from "~/types";
import { formatMoney } from "~/utils";
import toast from "react-hot-toast";
import { axiosAuth } from "~/axiosAuth";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { ORDER_STATUS } from "~/constants/order";
import { ROLE_USER } from "~/constants/user";

const Header = (props: IOrderProps) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { title, type, server, price, status, boost_id, user, assign_partner } =
    props;
  const navigator = useNavigate();
  const [isLoading, setLoading] = useState(false);

  const isPartner = currentUser?.role?.includes(ROLE_USER.PARTNER);

  const isCurrentUser = user?.user_id === currentUser?.user_id;

  const isAssignPartner = currentUser?.user_id === assign_partner?.user_id;

  const handleDeleteOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axiosAuth.delete(
        `/order/delete-order/${boost_id}`,
      );
      if (data.success) {
        toast.success("Order delete successfully");
        navigator(`/orders`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRefuse = async () => {
    try {
      setLoading(true);
      const { data } = await axiosAuth.post(`/order/refuse-order/${boost_id}`);
      if (data.success) {
        toast.success("Order refuse");
        navigator(`/orders/boosts/${boost_id}`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axiosAuth.post(`/order/accept-order/${boost_id}`);
      if (data.success) {
        toast.success("Order accepted");
        navigator(`/orders/boosts/${boost_id}`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCompletedOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axiosAuth.post(
        `/order/completed-order/${boost_id}`,
      );
      if (data.success) {
        toast.success("Order completed successfully");
        navigator(`/pending-boosts`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axiosAuth.post(`/order/cancel-order/${boost_id}`);
      if (data.success) {
        toast.success("Order canceled successfully");
        navigator(`/pending-boosts`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRenewOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axiosAuth.post(`/order/renew-order/${boost_id}`);
      if (data.success) {
        toast.success("Order renew successfully");
        navigator(`/checkout/${data.boost_id}`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRecoveryOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axiosAuth.post(
        `/order/recovery-order/${boost_id}`,
      );
      if (data.success) {
        toast.success("Order renew successfully");
        navigator(`/orders/boosts/${boost_id}`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4 lg:shrink-0">
      {/* TITLE */}
      <div className="flex items-center gap-x-3">
        <img
          className="size-12"
          src="/assets/games/counter-strike-2/logo.png"
          alt="logo"
        />
        <div className="flex flex-col justify-center lg:flex-1">
          <h1 className="font-display max-w-4xl gap-4 text-lg font-semibold capitalize tracking-tight text-foreground sm:text-2xl">
            {title}
          </h1>
          <p className="relative line-clamp-2 text-sm text-muted-foreground sm:block sm:max-w-md lg:max-w-3xl">
            <div className="inline-flex flex-wrap items-center gap-1.5 capitalize">
              <Copy text="Id" value="151991">
                #151991
              </Copy>
              <span> ⸱ </span>
              <div>{type?.replace("_", " ")} Boost</div>
              <span> ⸱ </span>
              <div>{server}</div>
              <span> ⸱ </span>
              <div>{formatMoney(price, "vnd")}</div>
            </div>
          </p>
        </div>
      </div>

      {/* OPTIONS */}
      {status === ORDER_STATUS.PENDING && isCurrentUser && (
        <div className="flex items-center justify-end gap-x-3">
          <Link to={`/checkout/${boost_id}`}>
            <Button variant="primary" className="rounded-md px-4 py-2 text-sm">
              <HiMiniRocketLaunch className="mr-2" />
              Complete Payment
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                disabled={isLoading}
                variant="secondary"
                className="h-10 w-10 rounded-md sm:h-9 sm:w-9"
              >
                <span className="sr-only">Open actions menu</span>
                <FaEllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <div className="px-2 py-1.5 text-sm font-medium">
                Boost Actions
              </div>
              <DropdownMenuItem
                onClick={handleDeleteOrder}
                className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm text-danger-light-foreground outline-none transition-colors focus:bg-danger-light focus:text-danger-light-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <FaRegTrashAlt className="mr-2 w-5 text-center text-danger-light-foreground" />
                Delete Boost
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {status === ORDER_STATUS.IN_ACTIVE &&
        isPartner &&
        user?.user_id !== currentUser?.user_id && (
          <Button
            onClick={handleAcceptOrder}
            disabled={isLoading}
            variant="primary"
            className="rounded-md px-4 py-2 text-sm"
          >
            <HiMiniRocketLaunch className="mr-2" />
            Accept Order
          </Button>
        )}
      {status === ORDER_STATUS.WAITING && isCurrentUser && (
        <Button
          onClick={handleRefuse}
          disabled={isLoading}
          variant="primary"
          className="rounded-md px-4 py-2 text-sm"
        >
          <HiMiniRocketLaunch className="mr-2" />
          Refuse
        </Button>
      )}
      {status === ORDER_STATUS.WAITING && isAssignPartner && (
        <div className="flex items-center justify-end gap-x-3">
          <Button
            onClick={handleAcceptOrder}
            disabled={isLoading}
            variant="primary"
            className="rounded-md px-4 py-2 text-sm"
          >
            <HiMiniRocketLaunch className="mr-2" />
            Accept Order
          </Button>
          <Button
            onClick={handleRefuse}
            disabled={isLoading}
            variant="primary"
            className="rounded-md px-4 py-2 text-sm"
          >
            <HiMiniRocketLaunch className="mr-2" />
            Refuse
          </Button>
        </div>
      )}
      {status === ORDER_STATUS.IN_PROGRESS &&
        isPartner &&
        user?.user_id !== currentUser?.user_id && (
          <div className="flex items-center justify-end gap-x-3">
            <Button
              onClick={handleCompletedOrder}
              disabled={isLoading}
              variant="primary"
              className="rounded-md px-4 py-2 text-sm"
            >
              <HiMiniRocketLaunch className="mr-2" />
              Complete Order
            </Button>
            <Button
              onClick={handleCancelOrder}
              disabled={isLoading}
              variant="primary"
              className="rounded-md px-4 py-2 text-sm"
            >
              <HiMiniRocketLaunch className="mr-2" />
              Cancel Order
            </Button>
          </div>
        )}
      {status === ORDER_STATUS.COMPLETED && isCurrentUser && (
        <Button
          onClick={handleRenewOrder}
          disabled={isLoading}
          variant="primary"
          className="rounded-md px-4 py-2 text-sm"
        >
          <HiMiniRocketLaunch className="mr-2" />
          Renew Order
        </Button>
      )}
      {status === ORDER_STATUS.CANCEL && isCurrentUser && (
        <Button
          onClick={handleRecoveryOrder}
          disabled={isLoading}
          variant="primary"
          className="rounded-md px-4 py-2 text-sm"
        >
          <HiMiniRocketLaunch className="mr-2" />
          Recovery Order
        </Button>
      )}
    </div>
  );
};

export default Header;
