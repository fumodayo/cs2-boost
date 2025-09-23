import React from "react";
import useSWRMutation from "swr/mutation";
import { toast } from "react-hot-toast";
import { FaMoneyBillWave } from "react-icons/fa";
import { Button } from "~/components/shared/Button";
import { IPayout, IUser } from "~/types";
import { formatMoney } from "~/utils";
import { Spinner } from "~/components/shared";
import { useTranslation } from "react-i18next";
import { payoutService } from "~/services/payout.service";
import getErrorMessage from "~/utils/errorHandler";

interface PayoutRequestsCardProps {
  data: IPayout[] | undefined;
  error: string;
  isLoading: boolean;
  onActionSuccess: () => void;
}

const PayoutRequestsCard: React.FC<PayoutRequestsCardProps> = ({
  data,
  error,
  isLoading,
  onActionSuccess,
}) => {
  const { t } = useTranslation();
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  const { trigger: triggerApprove, isMutating: isApproving } = useSWRMutation(
    "/payouts/approve",
    (_, { arg }: { arg: string }) => payoutService.approvePayout(arg),
  );
  const { trigger: triggerDecline, isMutating: isDeclining } = useSWRMutation(
    "/payouts/decline",
    (_, { arg }: { arg: string }) => payoutService.declinePayout(arg),
  );

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await triggerApprove(id);
      toast.success("Payout approved!");
      onActionSuccess();
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      console.error(errorMessage);
      toast.error("Failed to approve payout.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (id: string) => {
    setProcessingId(id);
    try {
      await triggerDecline(id);
      toast.success("Payout declined!");
      onActionSuccess();
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      console.error(errorMessage);
      toast.error("Failed to decline payout.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="border border-border bg-card shadow-sm sm:rounded-xl">
      <div className="border-b border-border p-4">
        <h3 className="flex items-center text-lg font-semibold text-foreground">
          <FaMoneyBillWave className="mr-3 text-yellow-500" />
          {t("ManageRevenuePage.PayoutRequests.title", {
            count: data?.length || 0,
          })}
        </h3>
      </div>
      <div className="divide-y divide-border">
        {isLoading && (
          <div className="p-4 text-center">
            <Spinner />
          </div>
        )}
        {error && !isLoading && (
          <div className="p-4 text-center text-red-500">
            {t("ManageRevenuePage.PayoutRequests.error")}
          </div>
        )}
        {!isLoading &&
          data?.map((req) => {
            const partnerData = req.partner as IUser;
            return (
              <div key={req._id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={partnerData.profile_picture}
                      alt={partnerData.username}
                      className="h-9 w-9 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {partnerData.full_name || partnerData.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(req.createdAt).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {formatMoney(req.amount, "vnd")}
                  </p>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleDecline(req._id)}
                    disabled={isApproving || isDeclining}
                  >
                    {isDeclining && processingId === req._id ? (
                      <Spinner size="sm" />
                    ) : (
                      t("ManageRevenuePage.PayoutRequests.declineBtn")
                    )}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove(req._id)}
                    disabled={isApproving || isDeclining}
                  >
                    {isApproving && processingId === req._id ? (
                      <Spinner size="sm" />
                    ) : (
                      t("ManageRevenuePage.PayoutRequests.approveBtn")
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        {!isLoading && data?.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {t("ManageRevenuePage.PayoutRequests.empty")}
          </p>
        )}
      </div>
    </div>
  );
};
export default PayoutRequestsCard;
