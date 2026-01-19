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
import { TextArea, Widget } from "~/components/ui";
import { useSocketContext } from "~/hooks/useSocketContext";
import cn from "~/libs/utils";
import { ISendReportPayload, IUser } from "~/types";
import DialogSuccessReport from "./DialogSuccessReport";
import { reasonReports } from "~/constants/report";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/Button";
import { reportService } from "~/services/report.service";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
const BlankBoosterWidget = () => {
  const { t } = useTranslation("boost_page");
  return (
    <Widget>
      <div className="px-4 py-6 sm:px-6">
        <div className="text-center">
          <FaUsers className="mx-auto" />
          <h2 className="text-base font-medium leading-6 text-foreground">
            {t("booster_widget.blank.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("booster_widget.blank.subtitle")}
          </p>
        </div>
      </div>
    </Widget>
  );
};
interface FoundBoosterWidgetProps extends IUser {
  orderId?: string;
}
const FoundBoosterWidget = (props: FoundBoosterWidgetProps) => {
  const { orderId, ...partner } = props;
  const { t } = useTranslation("boost_page");
  const { username, profile_picture, _id } = props;
  const { onlineUsers } = useSocketContext();
  const isOnline = _id ? onlineUsers.includes(_id) : false;
  const { data: hasReported = false, mutate: mutateReportStatus } = useSWR(
    orderId ? `/report/check-order/${orderId}` : null,
    () =>
      orderId
        ? reportService.checkOrderReport(orderId)
        : Promise.resolve(false),
  );
  const [reason, setReason] = useState<{
    title?: string;
    description?: string;
  } | null>(null);
  const [isOpenDialogReport, setOpenDialogReport] = useState(false);
  const [isOpenDialogSubmit, setOpenDialogSubmit] = useState(false);
  const { trigger, isMutating } = useSWRMutation(
    "/api/report/send",
    (_, { arg }: { arg: ISendReportPayload }) => reportService.sendReport(arg),
  );
  const handleOption = (option: string) => {
    setReason({ title: option });
    if (reason?.title === option) {
      setReason(null);
    }
  };
  const handleSendReport = async () => {
    if (!reason || !reason.title || !reason.description) {
      toast.error(t("common:toasts.report_reason_required"));
      return;
    }
    try {
      const { title, description } = reason;
      const payload = {
        reportedUserId: props._id,
        title: title,
        description: description,
        orderId: orderId,
      };
      const data = await trigger(payload);
      if (data.success) {
        setOpenDialogReport(false);
        setOpenDialogSubmit(true);
        mutateReportStatus(true, false);
      }
    } catch (e) {
      console.error(e);
      toast.error(t("common:toasts.report_failed"));
    }
  };
  const translatedReasonReports = reasonReports.map((reason) => ({
    ...reason,
    description: t(`report_reasons.${reason.value}`),
  }));
  return (
    <>
      <Widget>
        <Widget.BigHeader>
          <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
            {t("booster_widget.title")}
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
                    {t("booster_widget.view_more_btn")}
                    <HiOutlineExternalLink className="ml-1" />
                  </Button>
                </Link>
                {/* REPORT PARTNER - Chỉ hiển thị nếu chưa report */}
                {!hasReported && (
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
                        {t("booster_widget.report_btn")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="relative max-h-[calc(100svh-150px)] overflow-y-auto">
                        <div className="sticky -top-7 -mt-10 h-10 w-full bg-gradient-to-b from-card" />
                        <div className="w-full rounded-xl bg-card px-6 py-8">
                          {/* Header */}
                          <Link
                            to={`/partner/${username}`}
                            className="mb-4 flex items-center gap-3"
                          >
                            <img
                              src={partner.profile_picture}
                              alt="logo"
                              className="size-9 rounded-full border border-border/60"
                            />
                            <h2 className="font-display truncate text-lg font-semibold text-foreground">
                              {partner.username}
                            </h2>
                          </Link>
                          <hr className="my-4 border-border opacity-20" />
                          {/* Title */}
                          <h3 className="mb-6 text-base font-medium text-muted-foreground">
                            {t("booster_widget.report_dialog.title")}
                          </h3>
                          {/* Reasons */}
                          <div className="flex flex-col space-y-4">
                            {translatedReasonReports.map(
                              ({ value, description }, idx) => (
                                <div key={idx} className="w-full">
                                  <Button
                                    onClick={() => handleOption(value)}
                                    className={`w-full rounded-lg px-5 py-4 text-left text-sm transition-all duration-150 ${
                                      reason?.title === value
                                        ? "border border-primary bg-accent/30 font-semibold text-foreground"
                                        : "border border-transparent bg-muted text-muted-foreground hover:bg-muted/70"
                                    }`}
                                  >
                                    {description}
                                  </Button>
                                  {/* Description Input */}
                                  {reason?.title === value && (
                                    <div className="relative mt-3 w-full rounded-lg border border-border bg-muted/40 p-4">
                                      <div className="absolute -top-2 left-6 h-0 w-0 border-x-8 border-b-8 border-x-transparent border-b-muted/40" />
                                      <div className="border-x-7 border-b-7 absolute -top-[6px] left-6 h-0 w-0 border-x-transparent border-b-border" />
                                      <TextArea
                                        rows={4}
                                        placeholder={t(
                                          "booster_widget.report_dialog.placeholder",
                                        )}
                                        className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                                        onChange={(e) =>
                                          setReason((state) => ({
                                            ...state,
                                            description: e.target.value,
                                          }))
                                        }
                                      />
                                      <div className="flex justify-end pt-3">
                                        <Button
                                          disabled={
                                            isMutating || !reason.description
                                          }
                                          variant="primary"
                                          className="px-5 py-2 text-sm font-medium"
                                          onClick={handleSendReport}
                                        >
                                          {t(
                                            "booster_widget.report_dialog.submit_btn",
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
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
import { isUserObject } from "~/utils/typeGuards";
interface BoosterWidgetProps {
  partner?: IUser | string | null;
  assign_partner?: IUser | string | null;
  orderId?: string;
}
const BoosterWidget = ({
  partner,
  assign_partner,
  orderId,
}: BoosterWidgetProps) => {
  const partnerUser = isUserObject(partner) ? partner : undefined;
  const assignUser = isUserObject(assign_partner) ? assign_partner : undefined;
  const mergedPartner = partnerUser || assignUser;
  return mergedPartner ? (
    <FoundBoosterWidget {...mergedPartner} orderId={orderId} />
  ) : (
    <BlankBoosterWidget />
  );
};
export default BoosterWidget;