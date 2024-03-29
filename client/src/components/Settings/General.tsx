import clsx from "clsx";
import * as Dialog from "@radix-ui/react-dialog";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { FaDesktop, FaEye, FaTrashCan, FaXmark } from "react-icons/fa6";

import Widget from "../Widget";
import Input from "../Input";

const userInfo = {
  username: "Sơn Thái",
  handle: "son-thai",
  id: "#59162",
  email: "thaigiui2016@gmail.com",
  language: "_",
  games: "_",
};

const headers = [
  "username",
  "handle",
  "user ID",
  "email address",
  "language",
  "games",
];

const General = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      confirm: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
  };

  return (
    <div
      className={clsx(
        "mx-auto grid grid-cols-1 grid-rows-1 items-start gap-x-5 gap-y-5",
        "lg:mx-0 lg:grid-cols-3",
      )}
    >
      {/* CREDIT */}

      {/* INFORMATION */}
      <div
        className={clsx(
          "space-y-4",
          "lg:col-span-2 lg:row-span-2 lg:row-end-2 lg:space-y-6",
        )}
      >
        <Widget
          titleHeader="User Information"
          headers={headers}
          boostItem={userInfo}
        />

        {/* DELETE ACCOUNT */}
        <div
          className={clsx(
            "rounded-lg bg-card bg-gradient-to-br via-card to-card to-50% px-4 py-5 shadow ring-1 ring-danger-ring",
            "sm:p-6",
          )}
        >
          <div
            className={clsx(
              "flex flex-col gap-6",
              "sm:flex-row sm:items-center sm:justify-between",
            )}
          >
            <div>
              <h3 className="text-base font-semibold leading-6 text-foreground">
                Delete Account
              </h3>
              <div className="mt-2 max-w-xl text-sm text-foreground/90">
                This is irreversible. We will permanently remove your account,
                you will lose all the store credit and loyalty coins you have.
              </div>
            </div>
            <Dialog.Root>
              <Dialog.Trigger>
                <button
                  className={clsx(
                    "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-danger px-4 py-2 text-sm font-medium text-danger-foreground shadow-sm outline-none transition-colors",
                    "hover:bg-danger-hover focus:outline focus:outline-offset-2 focus:outline-danger focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                  )}
                >
                  <FaTrashCan className="mr-2" />
                  Delete Account
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-background/80" />
                <Dialog.Content
                  className={clsx(
                    "min-h fixed top-1/2 z-40 mx-auto min-h-fit w-full -translate-y-1/2 overflow-clip rounded-xl bg-card text-left shadow-xl outline-none transition-all",
                    "focus:outline-none ",
                    "sm:left-1/2 sm:max-w-lg sm:-translate-x-1/2",
                  )}
                >
                  {/* HEADER */}
                  <div
                    className={clsx(
                      "flex items-center justify-between px-6 pb-0 pt-6",
                      "sm:pt-5",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="gradient-red flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-red-400 text-sm text-white ring-2 ring-red-500/30">
                          <FaTrashCan />
                        </div>
                      </div>
                      <Dialog.Title className="font-display text-lg font-medium leading-6 text-foreground">
                        Delete Account
                      </Dialog.Title>
                    </div>
                    <Dialog.Close>
                      <button
                        type="button"
                        className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary-light text-sm font-medium text-secondary-light-foreground outline-none transition-colors hover:bg-secondary-light-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:h-9 sm:w-9"
                      >
                        <span className="sr-only">Close</span>
                        <FaXmark className="flex h-5 w-5 items-center justify-center" />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">
                    <div className="mb-4 w-full text-sm">
                      Enter your username to confirm the deletion of your
                      account.
                    </div>
                    <span className="font-mono mb-4 inline-flex w-full items-center rounded-md bg-secondary-light px-4 py-3 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-secondary-ring">
                      Sơn Thái
                    </span>
                    <Input
                      register={register}
                      errors={errors}
                      style="h-9"
                      id="confirm"
                      placeholder="Enter your username"
                    />
                  </div>

                  {/* FOOTER */}
                  <div
                    className={clsx(
                      "flex flex-row-reverse items-center gap-2 border-t border-border bg-muted/50 px-6 py-6",
                      "sm:gap-3 sm:rounded-b-xl sm:px-6 sm:py-4",
                    )}
                  >
                    <button
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                      className={clsx(
                        "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-danger px-4 py-2 text-sm font-medium text-danger-foreground shadow-sm outline-none transition-colors",
                        "hover:bg-danger-hover focus:outline focus:outline-offset-2 focus:outline-danger focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                      )}
                    >
                      Delete Account
                    </button>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </Dialog.Close>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>

        {/* LOGIN SESSIONS */}
        <div className="-mx-4 border bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl">
          <div className="flex flex-row items-center space-y-1.5 border-b border-border bg-muted/50 px-4 py-4 sm:rounded-t-xl sm:px-6">
            <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
              Login Sessions
            </h3>
            <div className="ml-auto flex items-center gap-x-1.5">
              <button className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary-light px-2 py-1.5 text-xs font-medium text-secondary-light-foreground outline-none transition-colors hover:bg-secondary-light-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50">
                <FaEye className="mr-2" /> Show IPs
              </button>
              <button className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-danger-light px-2 py-1.5 text-xs font-medium text-danger-light-foreground outline-none transition-colors hover:bg-danger-light-hover focus:outline focus:outline-offset-2 focus:outline-danger focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50">
                <FaXmark className="mr-2" /> Logout All Devices
              </button>
            </div>
          </div>
          <div className="px-0 pt-0 sm:px-6">
            <ul className="divide-y divide-border rounded-md">
              <li className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4 leading-6 sm:px-0">
                <div className="flex min-w-[150px] flex-1 items-center">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border p-3 shadow-sm">
                    <FaDesktop className="text-xl text-foreground/90" />
                  </div>
                  <div className="ml-4 flex min-w-0 flex-1 flex-col">
                    <span className="font-display items-center truncate font-medium sm:flex">
                      Windows
                      <span className="px-0.5 text-muted-foreground sm:px-1.5">
                        .
                      </span>
                      Chrome
                      <span className="font-sans ml-1 inline-flex items-center rounded-md bg-primary-light px-2 py-1 text-xs font-medium text-primary-light-foreground ring-1 ring-inset ring-primary-ring sm:ml-2">
                        <svg
                          className="-ml-0.5 mr-1.5 h-2 w-2"
                          fill="currentColor"
                          viewBox="0 0 8 8"
                        >
                          <circle cx="4" cy="4" r="3"></circle>
                        </svg>
                        Current
                      </span>
                    </span>
                    <span className="flex-shrink-0 items-center gap-x-1.5 truncate text-sm text-muted-foreground sm:flex">
                      <span className="text-muted-foreground">·</span> 9 seconds
                      ago
                    </span>
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-x-3">
                  <div className="block h-9 w-24 rounded-md bg-muted" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default General;
