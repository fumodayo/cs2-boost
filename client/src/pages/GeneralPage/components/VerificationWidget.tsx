import { useState } from "react";
import {
  FaArrowRight,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  AlertDialogContent,
  Dialog,
  DialogClose,
  DialogTrigger,
} from "~/components/@radix-ui/Dialog";
import { Widget } from "~/components/ui";
import UploadImageModal from "./UploadImageModal";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/Button";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
const VerificationWidget = () => {
  const { t } = useTranslation(["settings_page", "common"]);
  const [isOpenBeginModal, setOpenBeginModal] = useState(false);
  const [isOpenUploadModal, setOpenUploadModal] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const partnerStatus = currentUser?.partner_request_status;
  const toggled = () => {
    setOpenBeginModal((prev) => !prev);
    setOpenUploadModal((prev) => !prev);
  };
  const getCCCDExpirationDate = () => {
    if (!currentUser?.cccd_issue_date) return null;
    const issueDate = new Date(currentUser.cccd_issue_date);
    const expirationDate = new Date(issueDate);
    expirationDate.setFullYear(expirationDate.getFullYear() + 5);
    return expirationDate;
  };
  const expirationDate = getCCCDExpirationDate();
  const formattedExpirationDate = expirationDate
    ? expirationDate.toLocaleDateString("vi-VN")
    : "";
  if (partnerStatus === "approved") {
    return (
      <Widget>
        {/* Warning Banner if CCCD expiring soon */}
        {currentUser?.cccd_warning_sent && (
          <div className="border-b border-yellow-300 bg-yellow-100 px-4 py-3 dark:border-yellow-700 dark:bg-yellow-900/30">
            <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
              <FaExclamationTriangle className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm font-medium">
                {t("verification_widget.cccd_expiring_warning", {
                  date: formattedExpirationDate,
                })}
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="mt-2 w-full"
              onClick={() => setOpenUploadModal(true)}
            >
              {t("verification_widget.renew_cccd_btn")}
            </Button>
          </div>
        )}
        <div className="relative overflow-clip px-0 py-6 text-center sm:px-6">
          <img
            className="mx-auto"
            src="/assets/features/verified-icon.png"
            alt="verified"
          />
          <div className="flex flex-col gap-x-1 text-center">
            <span className="text-2xl font-semibold leading-10 tracking-tight text-foreground">
              {t("verification_widget.partner_title")}
            </span>
            <p className="mx-auto max-w-sm text-sm font-medium text-muted-foreground">
              {t("verification_widget.partner_subtitle")}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center border-t border-border bg-muted/20 px-4 py-3 sm:rounded-b-xl sm:px-4">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <FaCheckCircle />
            <span className="text-sm font-medium">
              {t("verification_widget.partner_badge")}
            </span>
          </div>
        </div>
      </Widget>
    );
  }
  if (partnerStatus === "pending") {
    return (
      <Widget>
        <div className="relative overflow-clip px-0 py-6 text-center sm:px-6">
          <img
            className="mx-auto opacity-50"
            src="/assets/features/unverified-icon.png"
            alt="pending"
          />
          <div className="flex flex-col gap-x-1 text-center">
            <span className="text-2xl font-semibold leading-10 tracking-tight text-foreground">
              {t("verification_widget.pending_title")}
            </span>
            <p className="mx-auto max-w-sm text-sm font-medium text-muted-foreground">
              {t("verification_widget.pending_subtitle")}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center border-t border-border bg-muted/20 px-4 py-3 sm:rounded-b-xl sm:px-4">
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <FaClock className="animate-pulse" />
            <span className="text-sm font-medium">
              {t("verification_widget.pending_badge")}
            </span>
          </div>
        </div>
      </Widget>
    );
  }
  return (
    <>
      <UploadImageModal
        open={isOpenUploadModal}
        onOpenChange={setOpenUploadModal}
      />
      <Widget>
        {/* HEADER */}
        <div className="relative overflow-clip px-0 py-6 text-center sm:px-6">
          <img
            className="mx-auto opacity-30"
            src="/assets/features/unverified-icon.png"
            alt="un-verification"
          />
          <div className="flex flex-col gap-x-1 text-center">
            <span className="text-2xl font-semibold leading-10 tracking-tight text-foreground">
              {t("verification_widget.title")}
            </span>
            <p className="mx-auto max-w-sm text-sm font-medium text-muted-foreground">
              {t("verification_widget.subtitle")}
            </p>
          </div>
        </div>
        {/* FOOTER */}
        <div className="flex items-center border-t border-border bg-muted/20 px-4 py-3 sm:rounded-b-xl sm:px-4">
          <Dialog open={isOpenBeginModal} onOpenChange={setOpenBeginModal}>
            <DialogTrigger>
              <Button
                variant="secondary"
                className="w-full rounded-md px-5 py-3 text-sm sm:py-2.5"
              >
                {t("verification_widget.verify_btn")}
                <FaArrowRight className="ml-2" />
              </Button>
            </DialogTrigger>
            <AlertDialogContent
              title={t("verification_widget.getting_started_title")}
              subtitle={t("verification_widget.getting_started_subtitle")}
            >
              <div className="flex w-full flex-col">
                <div className="flex items-center justify-center">
                  <img
                    className="h-full w-full"
                    src="/assets/tutorial/scan-cccd.png"
                    alt="scan-cccd"
                  />
                </div>
                <div className="mt-3.5 flex w-full flex-col space-y-2 sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
                  <DialogClose className="w-full">
                    <Button
                      variant="light"
                      className="w-full rounded-md px-4 py-2 text-sm"
                    >
                      {t("buttons.cancel", { ns: "common" })}
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={toggled}
                    variant="primary"
                    className="w-full rounded-md px-4 py-2 text-sm"
                  >
                    {t("verification_widget.begin_verify_btn")}
                  </Button>
                </div>
              </div>
            </AlertDialogContent>
          </Dialog>
        </div>
      </Widget>
    </>
  );
};
export default VerificationWidget;