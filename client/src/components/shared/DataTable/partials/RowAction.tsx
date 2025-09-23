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

const RowAction = (props: IOrder) => {
  const { boost_id, assign_partner } = props;
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();

  const { actions, permissions } = useOrderActions(props);

  return (
    <RowTable>
      {permissions.canPay && (
        <div className="flex justify-end">
          <Link to={`/checkout/${boost_id}`}>
            <Button
              variant="light"
              className="flex h-8 rounded-md bg-success-light px-2.5 py-1.5 text-xs text-success-light-foreground hover:bg-success-light-hover focus:outline-success"
            >
              {t("DataTable.actions.Pay Now")} <FaArrowRight className="ml-1" />
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
            {t("DataTable.actions.Accept Order")}
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
                {t("DataTable.actions.Accept Order")} <FaCheck />
              </Button>
            )}
          <Button
            onClick={actions.handleRefuse}
            disabled={actions.loading}
            variant="light"
            className="flex h-8 rounded-md bg-danger-light px-2.5 py-1.5 text-xs text-danger-light-foreground hover:bg-danger-light-hover focus:outline-danger"
          >
            Refuse <FaXmark className="ml-1" />
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
            {t("DataTable.actions.Completed")} <FaCheck className="ml-1" />
          </Button>
          <Button
            onClick={actions.handleCancelOrder}
            disabled={actions.loading}
            variant="light"
            className="flex h-8 rounded-md bg-danger-light px-2.5 py-1.5 text-xs text-danger-light-foreground hover:bg-danger-light-hover focus:outline-danger"
          >
            {t("DataTable.actions.Cancel")} <FaXmark className="ml-1" />
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
            {t("DataTable.actions.Renew Order")}
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
            {t("DataTable.actions.Recovery Order")}
            <FaArrowRight className="ml-1" />
          </Button>
        </div>
      )}
    </RowTable>
  );
};

export default RowAction;
