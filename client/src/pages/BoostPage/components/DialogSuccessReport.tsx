import {
  Dialog,
  DialogClose,
  NotifyDialog,
} from "~/components/@radix-ui/Dialog";
import { Button } from "~/components/shared/Button";

const DialogSuccessReport = ({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: (state: boolean) => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <NotifyDialog
        image="/assets/features/verified-icon.png"
        title="Thanks for sending, I hope it will be resolved soon."
      >
        <DialogClose>
          <Button
            variant="primary"
            className="w-full rounded-md px-4 py-2 text-sm"
          >
            Close
          </Button>
        </DialogClose>
      </NotifyDialog>
    </Dialog>
  );
};

export default DialogSuccessReport;
