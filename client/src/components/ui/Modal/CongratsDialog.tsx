import { Dialog } from "@radix-ui/react-dialog";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { NotifyDialog } from "../../@radix-ui/Dialog";
import { AppContext } from "../../context/AppContext";
import { Button } from "../Button";

const CongratsDialog = () => {
  const { t } = useTranslation(["settings_page", "common"]);
  const { isOpenCongratsDialog, toggleCongratsDialog } = useContext(AppContext);

  return (
    <Dialog open={isOpenCongratsDialog} onOpenChange={toggleCongratsDialog}>
      <NotifyDialog
        image="/assets/features/verified-icon.png"
        title={t("congrats_dialog.title")}
        subtitle={t("congrats_dialog.subtitle")}
      >
        <Button
          variant="primary"
          className="w-full rounded-md px-4 py-2 text-sm"
          onClick={toggleCongratsDialog}
        >
          {t("buttons.close", { ns: "common" })}
        </Button>
      </NotifyDialog>
    </Dialog>
  );
};

export default CongratsDialog;