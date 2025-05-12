import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFlag, FaUsers } from "react-icons/fa6";
import { HiOutlineExternalLink } from "react-icons/hi";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/components/@radix-ui/Dialog";
import { Button, TextArea, Widget } from "~/components/shared";
import { useSocketContext } from "~/hooks/useSocketContext";
import cn from "~/libs/utils";
import { ICurrentUserProps } from "~/types";
import DialogSuccessReport from "./DialogSuccessReport";
import { reasonReports } from "~/constants/report";
import { axiosAuth } from "~/axiosAuth";
import toast from "react-hot-toast";
import { RootState } from "~/redux/store";
import { useSelector } from "react-redux";

const BlankBoosterWidget = () => {
  const { t } = useTranslation();

  return (
    <Widget>
      <div className="px-4 py-6 sm:px-6">
        <div className="text-center">
          <FaUsers className="mx-auto" />
          <h2 className="text-base font-medium leading-6 text-foreground">
            {t("Boost.BoosterWidget.BlankBooster.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("Boost.BoosterWidget.BlankBooster.subtitle")}
          </p>
        </div>
      </div>
    </Widget>
  );
};

const FoundBoosterWidget = (partner: ICurrentUserProps) => {
  const { t } = useTranslation();
  const { username, profile_picture, user_id, _id } = partner;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(_id as string);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [reason, setReason] = useState<{
    title?: string;
    description?: string;
  } | null>(null);

  const [isOpenDialogReport, setOpenDialogReport] = useState(false);
  const [isOpenDialogSubmit, setOpenDialogSubmit] = useState(false);

  const handleOption = (option: string) => {
    setReason({ title: option });
    if (reason?.title === option) {
      setReason(null);
    }
  };

  const handleSendReport = async () => {
    try {
      setLoading(true);
      const { data } = await axiosAuth.post(`/report/send`, {
        customer_id: currentUser?._id,
        partner_id: partner._id,
        ...reason,
      });
      if (data.success) {
        setOpenDialogReport(false);
        setOpenDialogSubmit(true);
      }
    } catch (e) {
      console.error(e);
      toast.error("Fail Review");
    } finally {
      setLoading(false);
    }
  };

  console.log({ reason });

  return (
    <>
      <Widget>
        <Widget.BigHeader>
          <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
            {t("Boost.BoosterWidget.header")}
          </h3>
        </Widget.BigHeader>
        <div className="px-4 py-2 pt-0 sm:px-6 sm:py-5">
          <div className="flex flex-col items-center justify-center">
            {/* AVATAR */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="relative block h-12 w-12 shrink-0 rounded-full text-xl sm:h-16 sm:w-16">
                  <img
                    className="h-full w-full rounded-full object-cover"
                    src={profile_picture}
                    alt="avatar"
                  />

                  <span
                    className={cn(
                      "absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full ring-2 ring-card",
                      isOnline ? "bg-green-400" : "bg-gray-500",
                    )}
                  />
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="flex flex-col items-center gap-y-2 pt-1.5 sm:truncate">
              <h1 className="font-display flex flex-wrap items-center text-3xl font-semibold text-foreground sm:truncate sm:tracking-tight">
                {username}
              </h1>
              <div className="flex space-x-3 py-2">
                <Link to={`/partner/${username}`}>
                  <Button
                    variant="light"
                    className="rounded-md px-2.5 py-1.5 text-sm"
                  >
                    View more
                    <HiOutlineExternalLink className="ml-1" />
                  </Button>
                </Link>
                {/* REPORT PARTNER */}
                <Dialog
                  open={isOpenDialogReport}
                  onOpenChange={setOpenDialogReport}
                >
                  <DialogTrigger>
                    <Button
                      variant="light"
                      className="h-8 rounded-md bg-danger-light px-2.5 py-1.5 text-sm text-danger-light-foreground hover:bg-danger-light-hover focus:outline-danger"
                    >
                      <FaFlag className="mr-1" />
                      Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <div className="relative max-h-[calc(100svh-150px)] overflow-y-auto">
                      <div className="sticky -top-7 -mt-10 h-10 w-full bg-gradient-to-b from-card" />
                      <div className="w-full overflow-hidden rounded-xl bg-card px-5 py-7">
                        <Link
                          className="flex items-center gap-x-3 truncate"
                          to="/partner/buff163"
                        >
                          <img
                            className="size-8 rounded ring-1 ring-border/50"
                            src={partner.profile_picture}
                            alt="logo"
                          />
                          <h2 className="font-display truncate text-xl font-bold tracking-tight text-foreground">
                            {partner.username}
                          </h2>
                        </Link>
                        <hr className="mb-4 mt-4 w-full border-foreground opacity-10" />
                        <h3 className="mb-5">
                          Please tell us why you're reporting this person
                        </h3>
                        <div className="flex flex-col space-y-3">
                          {reasonReports.map(({ value, description }, idx) => (
                            <div key={idx}>
                              <div
                                className="flex w-full cursor-pointer items-center gap-6 overflow-hidden rounded-xl bg-card p-4 text-foreground shadow-lg ring-1 ring-inset ring-border transition-all hover:bg-accent/50 dark:bg-[#151926]/60 dark:hover:bg-[#212435]/60"
                                onClick={() => handleOption(value as string)}
                              >
                                {description}
                              </div>
                              {reason?.title === value && (
                                <div className="relative mt-3 w-full rounded-md border border-card-surface bg-accent p-4 text-white">
                                  <div className="absolute -top-2 left-4 h-0 w-0 border-x-8 border-b-8 border-x-transparent border-b-gray-500" />
                                  <div className="border-x-7 border-b-7 absolute -top-[6px] left-4 h-0 w-0 border-x-transparent border-b-gray-700" />

                                  <TextArea
                                    placeholder="Please provide more information"
                                    rows={5}
                                    onChange={(e) =>
                                      setReason((state) => ({
                                        ...state,
                                        description: e.target.value,
                                      }))
                                    }
                                  />
                                  <div className="flex items-end justify-end pt-2">
                                    <Button
                                      disabled={loading}
                                      variant="primary"
                                      className="rounded-md px-4 py-2 text-sm"
                                      onClick={handleSendReport}
                                    >
                                      Submit
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </Widget>
      <DialogSuccessReport
        isOpen={isOpenDialogSubmit}
        setOpen={setOpenDialogSubmit}
      />
    </>
  );
};

const BoosterWidget = ({
  partner,
  assign_partner,
}: {
  partner?: ICurrentUserProps;
  assign_partner?: ICurrentUserProps;
}) => {
  const mergedPartner = partner || assign_partner;

  return mergedPartner ? (
    <FoundBoosterWidget {...mergedPartner} />
  ) : (
    <BlankBoosterWidget />
  );
};

export default BoosterWidget;
