import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import {
  AlertDialogContent,
  Dialog,
  DialogClose,
  DialogTrigger,
} from "~/components/@radix-ui/Dialog";
import { Button, Widget } from "~/components/shared";
import UploadImageModal from "./UploadImageModal";
import { useTranslation } from "react-i18next";

const VerificationWidget = () => {
  const { t } = useTranslation();
  const [isOpenBeginModal, setOpenBeginModal] = useState(false);
  const [isOpenUploadModal, setOpenUploadModal] = useState(false);

  const toggled = () => {
    setOpenBeginModal((prev) => !prev);
    setOpenUploadModal((prev) => !prev);
  };

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
              {t("SettingsPage.VerificationWidget.Blank.title")}
            </span>
            <p className="mx-auto max-w-sm text-sm font-medium text-muted-foreground">
              {t("SettingsPage.VerificationWidget.Blank.subtitle")}
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
                {t("SettingsPage.VerificationWidget.Blank.btn")}
                <FaArrowRight className="ml-2" />
              </Button>
            </DialogTrigger>
            <AlertDialogContent
              title="Getting started"
              subtitle="We need some information to help us confirm your identity."
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
                      {t("Dialog.btn.Cancel")}
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={toggled}
                    variant="primary"
                    className="w-full rounded-md px-4 py-2 text-sm"
                  >
                    {t("Dialog.btn.Begin Verify")}
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
