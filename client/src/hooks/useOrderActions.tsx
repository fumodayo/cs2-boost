import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { orderService } from "~/services/order.service";
import { IApiResponse, IOrder, OrderServicePayloadResponse } from "~/types";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { ROLE_USER } from "~/constants/user";
import { ORDER_STATUS } from "~/types/constants";
import { isUserObject } from "~/utils/typeGuards";
import getErrorMessage from "~/utils/errorHandler";

const useOrderActions = (order: IOrder) => {
  const { boost_id, status, user, assign_partner, partner, retryCount } = order;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const permissions = useMemo(() => {
    if (!currentUser) {
      return {};
    }
    const isPartnerRole = currentUser.role?.includes(ROLE_USER.PARTNER);

    const isOrderOwner =
      isUserObject(user) && user?.user_id === currentUser.user_id;
    const isAssignedPartner =
      isUserObject(assign_partner) &&
      assign_partner?.user_id === currentUser.user_id;
    const isProcessingPartner =
      isUserObject(partner) && partner?.user_id === currentUser.user_id;

    return {
      canPay: status === ORDER_STATUS.PENDING && isOrderOwner,
      canAccept: status === ORDER_STATUS.IN_ACTIVE && isPartnerRole,
      canRefuse:
        status === ORDER_STATUS.WAITING && (isOrderOwner || isAssignedPartner),
      canComplete: status === ORDER_STATUS.IN_PROGRESS && isProcessingPartner,
      canCancel: status === ORDER_STATUS.IN_PROGRESS && isProcessingPartner,
      canRenew:
        status === ORDER_STATUS.COMPLETED && isOrderOwner && retryCount < 1,
      canRecover:
        status === ORDER_STATUS.CANCEL && isOrderOwner && retryCount < 1,
      canDelete: status === ORDER_STATUS.PENDING && isOrderOwner,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, currentUser]);

  const handleApiCall = async <T extends IApiResponse>(
    apiCall: () => OrderServicePayloadResponse<T>,
    successMessage: string,
    successNavigation?: string | ((responseData: T) => string),
  ) => {
    try {
      setLoading(true);
      const response = await apiCall();

      if (response.success) {
        toast.success(successMessage);
        if (successNavigation) {
          const path =
            typeof successNavigation === "function"
              ? successNavigation(response)
              : successNavigation;
          navigate(path);
        }
      }
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRefuse = () =>
    handleApiCall(
      () => orderService.refuseOrder(boost_id),
      "Order refused successfully",
    );

  const handleAcceptOrder = () =>
    handleApiCall(
      () => orderService.acceptOrder(boost_id),
      "Order accepted successfully",
      `/orders/boosts/${boost_id}`,
    );

  const handleCompletedOrder = () =>
    handleApiCall(
      () => orderService.completeOrder(boost_id),
      "Order completed successfully",
      "/pending-boosts",
    );

  const handleCancelOrder = () =>
    handleApiCall(
      () => orderService.cancelOrder(boost_id),
      "Cancellation request sent successfully",
    );

  const handleRenewOrder = () =>
    handleApiCall(
      () => orderService.renewOrder(boost_id),
      "Order renewed successfully",
      (data) => `/checkout/${data}`,
    );

  const handleRecoveryOrder = () =>
    handleApiCall(
      () => orderService.recoveryOrder(boost_id),
      "Order recovered successfully",
      (data) => `/orders/boosts/${data}`,
    );

  const handleDeleteOrder = () =>
    handleApiCall(
      () => orderService.deleteOrder(boost_id),
      "Order deleted successfully",
      "/orders",
    );

  return {
    actions: {
      loading,
      handleAcceptOrder,
      handleCancelOrder,
      handleCompletedOrder,
      handleDeleteOrder,
      handleRecoveryOrder,
      handleRefuse,
      handleRenewOrder,
    },
    permissions,
  };
};

export default useOrderActions;
