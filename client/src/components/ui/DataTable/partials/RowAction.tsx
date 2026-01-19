import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "~/redux/store";
import { IOrder } from "~/types";
import RowTable from "./RowTable";
import { Button } from "../../Button";
import { FaArrowRight, FaCheck, FaXmark } from "react-icons/fa6";
import useOrderActions from "~/hooks/useOrderActions";
import { isUserObject } from "~/utils/typeGuards";
import {
  Dialog,
  AlertDialogContent,
  DialogClose,
} from "~/components/@radix-ui/Dialog";
import { formatMoney } from "~/utils";

const RowAction = (props: IOrder) => {
  const { t } = useTranslation(["datatable", "boost_page"]);

  const { boost_id, assign_partner } = props;
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { actions, permissions, dialogs, commissionInfo } =
    useOrderActions(props);

  return (
    <>
      <RowTable>
        {permissions.canPay && (
          <div className="flex justify-end">
            <Link to={`/checkout/${boost_id}`}>
              <Button
                variant="light"
                className="flex h-8 rounded-md bg-success-light px-2.5 py-1.5 text-xs text-success-light-foreground hover:bg-success-light-hover focus:outline-success"
              >
                {t("actions.pay_now")} <FaArrowRight className="ml-1" />
              </Button>
            </Link>
          </div>
        )}

        {permissions.canAccept && (
          <div className="flex justify-end">
            <Button
              onClick={actions.handleAcceptOrder}
              disabled={actions.loading}
              variant="light"
              className="flex h-8 rounded-md bg-success-light px-2.5 py-1.5 text-xs text-success-light-foreground hover:bg-success-light-hover focus:outline-success"
            >
              {t("actions.accept_order")}
              <FaArrowRight className="ml-1" />
            </Button>
          </div>
        )}

        {permissions.canRefuse && (
          <div className="flex justify-end space-x-2">
            {isUserObject(assign_partner) &&
              assign_partner?.user_id === currentUser?.user_id && (
                <Button
                  onClick={actions.handleAcceptOrder}
                  disabled={actions.loading}
                  variant="light"
                  className="flex h-8 rounded-md bg-primary-light px-2.5 py-1.5 text-xs text-primary-light-foreground hover:bg-primary-light-hover focus:outline-primary"
                >
                  {t("actions.accept_order")} <FaCheck />
                </Button>
              )}
            <Button
              onClick={actions.handleRefuse}
              disabled={actions.loading}
              variant="light"
              className="flex h-8 rounded-md bg-danger-light px-2.5 py-1.5 text-xs text-danger-light-foreground hover:bg-danger-light-hover focus:outline-danger"
            >
              {t("actions.refuse")} <FaXmark className="ml-1" />
            </Button>
          </div>
        )}

        {permissions.canComplete && (
          <div className="flex justify-end space-x-2">
            <Button
              onClick={actions.handleCompletedOrder}
              disabled={actions.loading}
              variant="light"
              className="flex h-8 rounded-md bg-primary-light px-2.5 py-1.5 text-xs text-primary-light-foreground hover:bg-primary-light-hover focus:outline-primary"
            >
              {t("actions.completed")} <FaCheck className="ml-1" />
            </Button>
            <Button
              onClick={actions.handleCancelOrder}
              disabled={actions.loading}
              variant="light"
              className="flex h-8 rounded-md bg-danger-light px-2.5 py-1.5 text-xs text-danger-light-foreground hover:bg-danger-light-hover focus:outline-danger"
            >
              {t("actions.cancel")}
              <FaXmark className="ml-1" />
            </Button>
          </div>
        )}

        {permissions.canRenew && (
          <div className="flex justify-end">
            <Button
              onClick={actions.handleRenewOrder}
              variant="light"
              className="flex h-8 rounded-md bg-primary-light px-2.5 py-1.5 text-xs text-primary-light-foreground hover:bg-primary-light-hover focus:outline-primary"
            >
              {t("actions.renew_order")}
              <FaArrowRight className="ml-1" />
            </Button>
          </div>
        )}

        {permissions.canRecover && (
          <div className="flex justify-end">
            <Button
              onClick={actions.handleRecoveryOrder}
              variant="light"
              className="flex h-8 rounded-md bg-danger-light px-2.5 py-1.5 text-xs text-danger-light-foreground hover:bg-danger-light-hover focus:outline-danger"
            >
              {t("actions.recovery_order")}
              <FaArrowRight className="ml-1" />
            </Button>
          </div>
        )}
      </RowTable>

      {/* Accept Order Confirmation Dialog */}
      <Dialog
        open={dialogs.showAcceptDialog}
        onOpenChange={dialogs.setShowAcceptDialog}
      >
        <AlertDialogContent
          title={t("boost_page:dialogs.accept_title")}
          subtitle={t("boost_page:dialogs.accept_subtitle")}
        >
          <div className="w-full space-y-4">
            <div className="space-y-3">
              <div className="rounded-lg bg-muted p-4">
                <div className="mb-1 text-sm text-muted-foreground">
                  {t("boost_page:dialogs.order_value")}
                </div>
                <div className="text-lg font-semibold">
                  {formatMoney(commissionInfo.orderPrice, "vnd")}
                </div>
              </div>
              <div className="rounded-lg bg-green-500/10 p-4">
                <div className="mb-1 text-sm text-muted-foreground">
                  {t("boost_page:dialogs.your_earning")}
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
                  {t("boost_page:dialogs.cancel_btn")}
                </Button>
              </DialogClose>
              <Button
                variant="primary"
                className="flex-1 rounded-md px-4 py-2"
                onClick={actions.confirmAcceptOrder}
              >
                {t("boost_page:dialogs.confirm_accept_btn")}
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
          title={t("boost_page:dialogs.cancel_title")}
          subtitle={t("boost_page:dialogs.cancel_subtitle")}
        >
          <div className="w-full space-y-4">
            <div className="space-y-3">
              <div className="rounded-lg bg-red-500/10 p-4">
                <div className="mb-1 text-sm text-muted-foreground">
                  {t("boost_page:dialogs.penalty_amount")}
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
                  {t("boost_page:dialogs.cancel_warning")}
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <DialogClose asChild>
                <Button
                  variant="secondary"
                  className="flex-1 rounded-md px-4 py-2"
                >
                  {t("boost_page:dialogs.keep_order_btn")}
                </Button>
              </DialogClose>
              <Button
                variant="danger"
                className="flex-1 rounded-md px-4 py-2"
                onClick={actions.confirmCancelOrder}
              >
                {t("boost_page:dialogs.confirm_cancel_btn")}
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </Dialog>
    </>
  );
};

export default RowAction;