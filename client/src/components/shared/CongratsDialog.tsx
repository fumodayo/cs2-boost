import { Dialog } from "@radix-ui/react-dialog";
import { useContext } from "react";
import { NotifyDialog } from "../@radix-ui/Dialog";
import { Button } from "./Button";
import { AppContext } from "../context/AppContext";

const CongratsDialog = () => {
  const { isOpenCongratsDialog, toggleCongratsDialog } = useContext(AppContext);

  return (
    <Dialog open={isOpenCongratsDialog} onOpenChange={toggleCongratsDialog}>
      <NotifyDialog
        image="/assets/features/verified-icon.png"
        title="Chúc mừng!"
        subtitle="Bạn đã trở thành partner thành công."
      >
        <Button
          variant="primary"
          className="w-full rounded-md px-4 py-2 text-sm"
          onClick={toggleCongratsDialog}
        >
          Đóng
        </Button>
      </NotifyDialog>
    </Dialog>
  );
};

export default CongratsDialog;
