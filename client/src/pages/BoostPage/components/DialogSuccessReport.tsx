import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogClose,
  NotifyDialog,
} from "~/components/@radix-ui/Dialog";
import { Button } from "~/components/ui/Button";

const DialogSuccessReport = ({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: (state: boolean) => void;
}) => {
  const { t } = useTranslation(["boost_page", "common"]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <NotifyDialog
        image="/assets/features/verified-icon.png"
        title={t("report_success_dialog.title", { ns: "boost_page" })}
      >
        <DialogClose>
          <Button
            variant="primary"
            className="w-full rounded-md px-4 py-2 text-sm"
          >
            {t("buttons.close", { ns: "common" })}
          </Button>
        </DialogClose>
      </NotifyDialog>
    </Dialog>
  );
};

export default DialogSuccessReport;