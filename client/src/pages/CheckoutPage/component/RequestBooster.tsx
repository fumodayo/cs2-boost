import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus, FaUserFriends } from "react-icons/fa";
import { FaClock, FaXmark } from "react-icons/fa6";
import { axiosAuth } from "~/axiosAuth";
import { Button, Chip, MultiSelect } from "~/components/shared";
import { useSocketContext } from "~/hooks/useSocketContext";
import { ICurrentUserProps } from "~/types";
import { setLocalStorage } from "~/utils/localStorage";

const RequestBooster = () => {
  const { t } = useTranslation();
  const [isShowSelect, setIsShowSelect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [partners, setPartners] = useState<ICurrentUserProps[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<ICurrentUserProps>({});
  const [isSelect, setIsSelect] = useState(false);

  const { onlinePartners } = useSocketContext();
  const isOnline = onlinePartners.includes(selectedPartner?._id as string);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosAuth.post("/user/get-partners");
        setPartners(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleRequestPartner = async () => {
    setLocalStorage("assign_partner", selectedPartner?._id);
    setIsSelect(true);
  };

  return (
    <>
      {isShowSelect ? (
        <div className="border-y border-border py-6">
          {isSelect ? (
            <>
              <div className="mb-2 flex items-center justify-between lg:mx-0">
                <h3 className="text-lg font-medium text-foreground">
                  {t("CheckoutPage.label.Selected Booster")}
                </h3>
                <div className="flex items-center">
                  <Button
                    onClick={() => setIsSelect((state) => !state)}
                    variant="transparent"
                    className="rounded-md px-2 py-1.5 text-xs text-warning-light-foreground hover:bg-warning-light focus:outline-warning"
                  >
                    <FaXmark className="mr-1.5" />
                    {t("CheckoutPage.label.Cancel")}
                  </Button>
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-border shadow-sm">
                <div className="flex items-center justify-between gap-x-1.5 px-4 py-4 sm:px-4">
                  <div className="flex items-center">
                    <div className="relative block h-10 w-10 shrink-0 rounded-full text-base">
                      <img
                        src={selectedPartner.profile_picture}
                        className="h-full w-full rounded-full object-cover"
                        alt={selectedPartner.username}
                      />
                    </div>
                    <div className="ml-2.5 truncate">
                      <div className="truncate text-sm font-medium text-foreground">
                        {selectedPartner.username}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        #{selectedPartner.user_id}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-x-2">
                    {isOnline ? (
                      <Chip className="bg-success-light text-success-light-foreground ring-success-ring">
                        <FaClock className="mr-1.5" />
                        Online
                      </Chip>
                    ) : (
                      <Chip className="text-danger-light-foreground ring-danger-ring">
                        <FaClock className="mr-1.5" />
                        Offline
                      </Chip>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-foreground">
                {t("CheckoutPage.label.Request Booster")}
              </h3>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>{t("CheckoutPage.label.Looking for a specific booster?")}</p>
              </div>
              <div className="mt-6 flex items-end gap-2">
                <div className="w-full">
                  <MultiSelect
                    options={partners}
                    onChange={(value) =>
                      setSelectedPartner(value as ICurrentUserProps)
                    }
                  />
                </div>
                <Button
                  disabled={isLoading}
                  variant="secondary"
                  className="ml-1 h-10 truncate rounded-md px-5 py-3 text-sm sm:py-2.5"
                  onClick={handleRequestPartner}
                >
                  <FaPlus size={36} className="mr-2" />
                  {t("CheckoutPage.label.Request")}
                </Button>
              </div>
            </>
          )}
        </div>
      ) : (
        <Button
          variant="secondary"
          onClick={() => setIsShowSelect(true)}
          className="rounded-full px-6 py-3 text-sm sm:py-2.5"
        >
          <FaUserFriends size={18} className="mr-2" />
          {t("CheckoutPage.label.Request a specific Booster")}
        </Button>
      )}
    </>
  );
};

export default RequestBooster;
