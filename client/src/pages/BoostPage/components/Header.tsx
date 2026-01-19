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
import {
  Dialog,
  AlertDialogContent,
  DialogClose,
} from "~/components/@radix-ui/Dialog";
import { Copy } from "~/components/ui";
import { IOrder } from "~/types";
import { formatMoney } from "~/utils";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { Button } from "~/components/ui/Button";
import useOrderActions from "~/hooks/useOrderActions";
import { isUserObject } from "~/utils/typeGuards";
import { useTranslation } from "react-i18next";

const Header = (props: IOrder) => {
  const { t } = useTranslation(["boost_page", "common", "datatable"]);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { title, type, server, price, boost_id, assign_partner } = props;

  const { actions, permissions, dialogs, commissionInfo } =
    useOrderActions(props);

  const translatedType = t(`common:game_modes.${type}`, { defaultValue: type });
  const translatedServer = server
    ? t(`common:servers.${server.toLowerCase().replace(/ /g, "_")}`, {
        defaultValue: server,
      })
    : "";

  return (
    <>
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
                  <Copy
                    text={t("boost_page:widget_list.labels.boost_id")}
                    value={boost_id}
                  >
                    #{boost_id}
                  </Copy>
                  <span> ⸱ </span>
                  <div>
                    {translatedType} {t("datatable:tooltip.boost_suffix")}
                  </div>
                  <span> ⸱ </span>
                  <div>{translatedServer}</div>
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
                  {t("header.complete_payment_btn")}
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
                      <span className="sr-only">
                        {t("header.open_actions_menu_sr")}
                      </span>
                      <FaEllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {t("header.boost_actions")}
                    </div>
                    <DropdownMenuItem
                      onClick={actions.handleDeleteOrder}
                      className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm text-danger-light-foreground outline-none transition-colors focus:bg-danger-light focus:text-danger-light-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <FaRegTrashAlt className="mr-2 w-5 text-center text-danger-light-foreground" />
                      {t("header.delete_boost")}
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
              {t("header.accept_order_btn")}
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
                    {t("header.accept_order_btn")}
                  </Button>
                )}
              <Button
                onClick={actions.handleRefuse}
                disabled={actions.loading}
                variant="secondary"
                className="rounded-md px-4 py-2 text-sm"
              >
                {t("header.refuse_btn")}
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
                {t("header.complete_order_btn")}
              </Button>
              <Button
                onClick={actions.handleCancelOrder}
                disabled={actions.loading}
                variant="secondary"
                className="rounded-md px-4 py-2 text-sm"
              >
                {t("header.cancel_order_btn")}
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
              {t("header.renew_order_btn")}
            </Button>
          )}

          {permissions.canRecover && (
            <Button
              onClick={actions.handleRecoveryOrder}
              disabled={actions.loading}
              variant="primary"
              className="rounded-md px-4 py-2 text-sm"
            >
              {t("header.recovery_order_btn")}
            </Button>
          )}
        </>
      </div>

      {/* Accept Order Confirmation Dialog */}
      <Dialog
        open={dialogs.showAcceptDialog}
        onOpenChange={dialogs.setShowAcceptDialog}
      >
        <AlertDialogContent
          title={t("dialogs.accept_title")}
          subtitle={t("dialogs.accept_subtitle")}
        >
          <div className="w-full space-y-4">
            <div className="space-y-3">
              <div className="rounded-lg bg-muted p-4">
                <div className="mb-1 text-sm text-muted-foreground">
                  {t("dialogs.order_value")}
                </div>
                <div className="text-lg font-semibold">
                  {formatMoney(commissionInfo.orderPrice, "vnd")}
                </div>
              </div>
              <div className="rounded-lg bg-green-500/10 p-4">
                <div className="mb-1 text-sm text-muted-foreground">
                  {t("dialogs.your_earning")}
                </div>
                <div className="text-lg font-semibold text-green-600">
                  +{formatMoney(commissionInfo.partnerEarning, "vnd")}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    (
                    {commissionInfo.commissionRates
                      ? Math.round(
                          commissionInfo.commissionRates.partnerCommissionRate *
                            100,
                        )
                      : 80}
                    %)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <DialogClose asChild>
                <Button
                  variant="secondary"
                  className="flex-1 rounded-md px-4 py-2"
                >
                  {t("dialogs.cancel_btn")}
                </Button>
              </DialogClose>
              <Button
                variant="primary"
                className="flex-1 rounded-md px-4 py-2"
                onClick={actions.confirmAcceptOrder}
              >
                {t("dialogs.confirm_accept_btn")}
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </Dialog>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog
        open={dialogs.showCancelDialog}
        onOpenChange={dialogs.setShowCancelDialog}
      >
        <AlertDialogContent
          title={t("dialogs.cancel_title")}
          subtitle={t("dialogs.cancel_subtitle")}
        >
          <div className="w-full space-y-4">
            <div className="space-y-3">
              <div className="rounded-lg bg-red-500/10 p-4">
                <div className="mb-1 text-sm text-muted-foreground">
                  {t("dialogs.penalty_amount")}
                </div>
                <div className="text-lg font-semibold text-red-600">
                  -{formatMoney(commissionInfo.penaltyAmount, "vnd")}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    (
                    {commissionInfo.commissionRates
                      ? Math.round(
                          commissionInfo.commissionRates
                            .cancellationPenaltyRate * 100,
                        )
                      : 5}
                    %)
                  </span>
                </div>
              </div>
              <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  {t("dialogs.cancel_warning")}
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <DialogClose asChild>
                <Button
                  variant="secondary"
                  className="flex-1 rounded-md px-4 py-2"
                >
                  {t("dialogs.keep_order_btn")}
                </Button>
              </DialogClose>
              <Button
                variant="danger"
                className="flex-1 rounded-md px-4 py-2"
                onClick={actions.confirmCancelOrder}
              >
                {t("dialogs.confirm_cancel_btn")}
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </Dialog>
    </>
  );
};

export default Header;