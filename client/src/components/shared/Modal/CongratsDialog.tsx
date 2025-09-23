import { Dialog } from "@radix-ui/react-dialog";
import { useContext } from "react";
import { NotifyDialog } from "../../@radix-ui/Dialog";
import { AppContext } from "../../context/AppContext";
import { Button } from "../Button";

const CongratsDialog = () => {
  const { isOpenCongratsDialog, toggleCongratsDialog } = useContext(AppContext);

  return (
    <Dialog open={isOpenCongratsDialog} onOpenChange={toggleCongratsDialog}>
      <NotifyDialog
        image="/assets/features/verified-icon.png"
        title="Congratulations!"
        subtitle="You have become a successful partner."
      >
        <Button
          variant="primary"
          className="w-full rounded-md px-4 py-2 text-sm"
          onClick={toggleCongratsDialog}
        >
          Close
        </Button>
      </NotifyDialog>
    </Dialog>
  );
};

export default CongratsDialog;
