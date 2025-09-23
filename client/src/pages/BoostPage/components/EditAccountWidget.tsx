import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaLock } from "react-icons/fa6";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogTrigger,
  EditDialogContent,
} from "~/components/@radix-ui/Dialog";
import { Copy, FormField, Widget } from "~/components/shared";
import { IAccount, IAccountPayload, IOrder } from "~/types";
import { Button } from "~/components/shared/Button";
import { orderService } from "~/services/order.service";
import getErrorMessage from "~/utils/errorHandler";
import { FaEdit } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

interface EditAccountWidgetProps {
  account: IAccount;
  order: IOrder;
  mutate: () => void;
}

const EditAccountWidget = ({
  account,
  order,
  mutate,
}: EditAccountWidgetProps) => {
  const { t } = useTranslation();
  const { login, backup_code } = account;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      login: "",
      password: "",
      backup_code: "",
    },
  });

  const handleEditAccount: SubmitHandler<FieldValues> = async (form) => {
    const updatedFields = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(form).filter(([_, value]) => value !== ""),
    );

    if (Object.keys(updatedFields).length === 0) {
      toast.error("Please fill at least one field to update.");
      return;
    }

    const finalPayload = {
      login: account.login,
      backup_code: account.backup_code,
      ...updatedFields,
    } as IAccountPayload;

    try {
      setIsSubmitting(true);
      const response = await orderService.editAccountOnOrder(
        account._id,
        finalPayload,
      );

      if (response.success) {
        toast.success("Account updated successfully");
        reset();
        mutate();
      } else {
        toast.error(response.message || "Failed to edit account");
      }
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      toast.error(errorMessage || "Failed to edit account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Widget>
      <Widget.BigHeader>
        <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
          {t("Boost.AccountWidget.EditAccount.title")}
        </h3>
      </Widget.BigHeader>
      <Widget.Content>
        <div className="grid grid-cols-2 lg:grid-cols-3">
          {Object.entries(account)
            .filter(([key]) =>
              ["login", "password", "backup_code"].includes(key),
            )
            .map(([key, value]) => (
              <div
                key={uuidv4()}
                className="border-t border-border/50 px-4 py-6 sm:col-span-3 sm:grid sm:grid-cols-3 sm:px-0"
              >
                <dt className="text-sm font-medium capitalize text-foreground">
                  {key.replace("_", " ")}
                </dt>
                <Copy value={value} text={key}>
                  <dd className="mt-1 flex items-center gap-x-2 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                    {key === "login" ? value : "********"}
                  </dd>
                </Copy>
              </div>
            ))}
        </div>
      </Widget.Content>
      <Widget.Footer>
        <Dialog>
          <DialogTrigger>
            <Button
              variant="transparent"
              className="rounded-md px-2 py-1.5 text-xs"
            >
              <FaEdit className="mr-2" />
              {t("Boost.AccountWidget.EditAccount.btn")}
            </Button>
          </DialogTrigger>
          <EditDialogContent title="Edit Account Logins">
            <div className="scroll-md relative flex-1 overflow-auto px-4 pt-6 sm:px-6">
              {/* TITLE */}
              <div className="rounded-lg border border-border bg-accent px-3 py-2">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-card p-1.5 shadow-sm lg:h-14 lg:w-14">
                    <img
                      className="h-8 w-8"
                      src="/assets/games/counter-strike-2/logo.png"
                      alt="rank"
                    />
                  </div>
                  <div className="ml-2.5 truncate">
                    <div className="truncate text-sm font-medium text-foreground">
                      {order?.title}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {order?.type?.replace("-", " ")} Boost
                    </p>
                  </div>
                </div>
              </div>

              {/* CONTENT */}
              <form className="space-y-5 py-5">
                <FormField
                  id="login"
                  label="Login"
                  placeholder={login}
                  className="px-4 py-2.5"
                  register={register}
                  errors={errors}
                />
                <FormField
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="********"
                  className="px-4 py-2.5"
                  register={register}
                  errors={errors}
                />
                <FormField
                  id="backup_code"
                  label="Backup Code"
                  placeholder={backup_code}
                  className="px-4 py-2.5"
                  register={register}
                  errors={errors}
                />

                <Link
                  to="https://store.steampowered.com/twofactor/manage"
                  target="_blank"
                  className="mt-1 text-sm leading-6 text-muted-foreground hover:underline sm:text-xs"
                >
                  {t("Dialog.label.How to Generate Steam Guard Backup Codes?")}
                </Link>
              </form>
              <div className="flex items-center rounded-lg border border-warning-ring bg-warning-light p-4 text-warning-light-foreground backdrop-blur-xl">
                <FaLock className="mr-3 flex-shrink-0" />
                <div className="flex-1 text-sm">
                  {t(
                    "Dialog.label.Your login credentials are secured using state-of-the-art encryption and are only visible to you and the booster.",
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex flex-shrink-0 flex-row-reverse gap-3 rounded-b-xl border-t border-border bg-card-surface px-4 py-4">
              <Button
                disabled={isSubmitting}
                onClick={handleSubmit(handleEditAccount)}
                variant="primary"
                className="w-full rounded-md px-5 py-3 text-sm sm:w-auto sm:py-2.5"
              >
                <FaEdit className="mr-2" />
                {t("Dialog.btn.Edit Account")}
              </Button>
              <DialogClose>
                <Button
                  variant="secondary"
                  className="w-full rounded-md px-4 py-2 text-sm sm:w-auto"
                >
                  {t("Dialog.btn.Cancel")}
                </Button>
              </DialogClose>
            </div>
          </EditDialogContent>
        </Dialog>
      </Widget.Footer>
    </Widget>
  );
};

export default EditAccountWidget;
