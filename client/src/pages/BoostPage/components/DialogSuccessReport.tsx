import {
  Dialog,
  DialogClose,
  NotifyDialog,
} from "~/components/@radix-ui/Dialog";
import { Button } from "~/components/shared";

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
        title="Cảm ơn bạn đã gửi, chúc tôi sẽ giải quyết một cách sớm nhất"
      >
        <DialogClose>
          <Button
            variant="primary"
            className="w-full rounded-md px-4 py-2 text-sm"
          >
            Đóng
          </Button>
        </DialogClose>
      </NotifyDialog>
    </Dialog>
  );
};

export default DialogSuccessReport;
