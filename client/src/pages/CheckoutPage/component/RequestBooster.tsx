import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaUserFriends } from "react-icons/fa";
import { FaClock, FaXmark } from "react-icons/fa6";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { Chip, MultiSelect, ErrorDisplay } from "~/components/ui";
import { Button } from "~/components/ui/Button";
import { useSocketContext } from "~/hooks/useSocketContext";
import { RootState } from "~/redux/store";
import { orderService } from "~/services/order.service";
import { userService } from "~/services/user.service";
import { IUser } from "~/types";

const SelectedPartnerCard: React.FC<{
  partner: IUser;
  isOnline: boolean;
  onCancel: () => void;
}> = ({ partner, isOnline, onCancel }) => {
  const { t } = useTranslation("checkout_page");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">
          {t("booster_request.selected_booster")}
        </h3>
        <Button
          onClick={onCancel}
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-danger"
        >
          <FaXmark /> {t("booster_request.cancel")}
        </Button>
      </div>
      <div className="rounded-lg border border-border p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={partner.profile_picture}
              className="h-10 w-10 rounded-full object-cover"
              alt={partner.username}
            />
            <div>
              <p className="font-semibold text-foreground">
                {partner.username}
              </p>
              <p className="text-xs text-muted-foreground">
                #{partner.user_id}
              </p>
            </div>
          </div>
          <Chip className="gap-1.5">
            <FaClock />
            {isOnline
              ? t("booster_request.status.online")
              : t("booster_request.status.offline")}
          </Chip>
        </div>
      </div>
    </div>
  );
};
interface RequestBoosterProps {
  orderId: string;
  initialAssignedPartner?: IUser | null;
}

const RequestBooster: React.FC<RequestBoosterProps> = ({
  orderId,
  initialAssignedPartner,
}) => {
  const { t } = useTranslation("checkout_page");
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { onlinePartners } = useSocketContext();

  const [isExpanded, setIsExpanded] = useState(!!initialAssignedPartner);
  const [selectedPartner, setSelectedPartner] = useState<IUser | null>(
    initialAssignedPartner || null,
  );
  const [isAssigning, setIsAssigning] = useState(false);

  const {
    data: partnersData,
    error,
    isLoading,
  } = useSWR(
    "/user/get-partners",
    () => userService.getPartners({ partner_id: currentUser?._id }),
    {
      keepPreviousData: true,
    },
  );

  const partnersFromAPI = partnersData?.data || [];

  const handlePartnerSelect = async (partner: IUser | null) => {
    console.log({ partner });
    if (!partner || !orderId || !currentUser?._id || isAssigning) return;

    setIsAssigning(true);
    try {
      await orderService.assignPartner(orderId, { partnerId: partner._id });
      setSelectedPartner(partner);
      setIsExpanded(true);
    } catch (err) {
      console.error("Failed to assign partner:", err);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleCancelSelection = async () => {
    if (!currentUser?._id || !orderId || !selectedPartner) return;

    setIsAssigning(true);
    try {
      await orderService.assignPartner(orderId, { partnerId: undefined });
      setSelectedPartner(null);
    } catch (err) {
      console.error("Failed to un-assign partner:", err);
    } finally {
      setIsAssigning(false);
    }
  };

  const isOnline = selectedPartner?._id
    ? onlinePartners.includes(selectedPartner._id)
    : false;

  return (
    <>
      {!isExpanded && !selectedPartner ? (
        <Button
          variant="secondary"
          onClick={() => setIsExpanded(true)}
          className="rounded-full px-6 py-3 text-sm sm:py-2.5"
        >
          <FaUserFriends size={18} className="mr-2" />
          {t("booster_request.request_booster_btn")}
        </Button>
      ) : (
        <div className="w-full border-y border-border py-6">
          {selectedPartner ? (
            <SelectedPartnerCard
              partner={selectedPartner}
              isOnline={isOnline}
              onCancel={handleCancelSelection}
            />
          ) : (
            <>
              <h3 className="text-lg font-medium text-foreground">
                {t("booster_request.request_booster_title")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("booster_request.looking_for_booster")}
              </p>
              <div className="mt-4">
                {error && (
                  <ErrorDisplay message={t("errors.load_partners_failed")} />
                )}
                <MultiSelect
                  isLoading={isLoading || isAssigning}
                  options={partnersFromAPI}
                  value={selectedPartner}
                  onChange={handlePartnerSelect}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default RequestBooster;