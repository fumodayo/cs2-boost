import { Link } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";
import { HiMiniRocketLaunch } from "react-icons/hi2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/@radix-ui/Dropdown";
import { Copy } from "~/components/shared";
import { IOrder } from "~/types";
import { formatMoney } from "~/utils";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { Button } from "~/components/shared/Button";
import useOrderActions from "~/hooks/useOrderActions";
import { isUserObject } from "~/utils/typeGuards";

const Header = (props: IOrder) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { title, type, server, price, boost_id, assign_partner } = props;

  const { actions, permissions } = useOrderActions(props);

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4 lg:shrink-0">
      {/* TITLE */}
      <>
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
        {permissions.canPay && (
          <div className="flex items-center justify-end gap-x-3">
            <Link to={`/checkout/${boost_id}`}>
              <Button
                variant="primary"
                className="rounded-md px-4 py-2 text-sm"
              >
                <HiMiniRocketLaunch className="mr-2" />
                Complete Payment
              </Button>
            </Link>
            {permissions.canDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    disabled={actions.loading}
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
                    onClick={actions.handleDeleteOrder}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm text-danger-light-foreground outline-none transition-colors focus:bg-danger-light focus:text-danger-light-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <FaRegTrashAlt className="mr-2 w-5 text-center text-danger-light-foreground" />
                    Delete Boost
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}

        {permissions.canAccept && (
          <Button
            onClick={actions.handleAcceptOrder}
            disabled={actions.loading}
            variant="primary"
            className="rounded-md px-4 py-2 text-sm"
          >
            <HiMiniRocketLaunch className="mr-2" />
            Accept Order
          </Button>
        )}

        {permissions.canRefuse && (
          <div className="flex items-center justify-end gap-x-3">
            {isUserObject(assign_partner) &&
              assign_partner?.user_id === currentUser?.user_id && (
                <Button
                  onClick={actions.handleAcceptOrder}
                  disabled={actions.loading}
                  variant="primary"
                  className="rounded-md px-4 py-2 text-sm"
                >
                  <HiMiniRocketLaunch className="mr-2" />
                  Accept Order
                </Button>
              )}
            <Button
              onClick={actions.handleRefuse}
              disabled={actions.loading}
              variant="secondary"
              className="rounded-md px-4 py-2 text-sm"
            >
              Refuse
            </Button>
          </div>
        )}

        {permissions.canComplete && (
          <div className="flex items-center justify-end gap-x-3">
            <Button
              onClick={actions.handleCompletedOrder}
              disabled={actions.loading}
              variant="primary"
              className="rounded-md px-4 py-2 text-sm"
            >
              Complete Order
            </Button>
            <Button
              onClick={actions.handleCancelOrder}
              disabled={actions.loading}
              variant="secondary"
              className="rounded-md px-4 py-2 text-sm"
            >
              Cancel Order
            </Button>
          </div>
        )}

        {permissions.canRenew && (
          <Button
            onClick={actions.handleRenewOrder}
            disabled={actions.loading}
            variant="primary"
            className="rounded-md px-4 py-2 text-sm"
          >
            Renew Order
          </Button>
        )}

        {permissions.canRecover && (
          <Button
            onClick={actions.handleRecoveryOrder}
            disabled={actions.loading}
            variant="primary"
            className="rounded-md px-4 py-2 text-sm"
          >
            Recovery Order
          </Button>
        )}
      </>
    </div>
  );
};

export default Header;
