import { FaPlay, FaXmark } from "react-icons/fa6";
import Widget from "../Widget";
import * as Dialog from "@radix-ui/react-dialog";
import ReadQR from "../ReadQR";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const headers = [
  "full name",
  "address",
  "phone",
  "gender",
  "birth date",
  "CCCD number",
  "CCCD issue date",
];

const IDVerification = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <div className="mx-auto grid grid-cols-1 grid-rows-1 items-start gap-x-5 gap-y-5 lg:mx-0 lg:grid-cols-3">
      {/* VERIFY */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-1 lg:col-start-3 lg:row-end-1 lg:grid-cols-1">
        <div className="rank-gradient grad-league-of-legends-silver -mx-4 border bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl">
          <div className="flex w-full items-center px-4 py-6 sm:px-6">
            <img
              src="https://cdn.gameboost.com/static/features/verified-icon.webp"
              className="mr-2 opacity-30"
            />
            <div className="flex flex-col items-baseline gap-x-1">
              <span className="text-2xl font-semibold leading-10 tracking-tight text-foreground">
                Not Verified
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                Complete the verification process to become a verified user
              </span>
            </div>
          </div>
          <div className="flex items-center border-t border-border bg-muted/50 px-4 py-3 sm:rounded-b-xl sm:px-6">
            <Dialog.Root>
              <Dialog.Trigger>
                <button className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-transparent px-2 py-1.5 text-xs font-medium text-primary-light-foreground outline-none transition-colors hover:bg-primary-light focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50">
                  <FaPlay className="mr-2" />
                  Start Verification
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
                <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-lg duration-200 sm:rounded-lg md:w-full">
                  <Dialog.Close asChild>
                    <div className="ml-3 flex h-7 items-center justify-end">
                      <button className="relative h-8 w-8 items-center justify-center overflow-hidden whitespace-nowrap rounded-full bg-transparent p-1 text-sm font-medium text-secondary-light-foreground outline-none transition-colors hover:bg-secondary-light focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50">
                        <span className="sr-only">Close</span>
                        <FaXmark className="flex items-center justify-center text-2xl" />
                      </button>
                    </div>
                  </Dialog.Close>
                  <ReadQR />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </div>

      {/* INFORMATION */}
      <div className="space-y-4 lg:col-span-2 lg:row-span-2 lg:row-end-2 lg:space-y-6">
        <Widget
          titleHeader="Personal Info"
          headers={headers}
          boostItem={currentUser}
        />
      </div>
    </div>
  );
};

export default IDVerification;
