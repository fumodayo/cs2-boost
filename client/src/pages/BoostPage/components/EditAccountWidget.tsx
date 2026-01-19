import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaLock } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Copy, FormField, Widget } from "~/components/ui";
import SlidePanel from "~/components/ui/SlidePanel/SlidePanel";
import { IAccount, IAccountPayload, IOrder } from "~/types";
import { Button } from "~/components/ui/Button";
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
  const { t } = useTranslation(["boost_page"]);
  const { login } = account;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditLoginOpen, setIsEditLoginOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: "onBlur",
    defaultValues: {
      login: "",
      password: "",
      backup_code: "",
    },
  });
  const handleEditAccount: SubmitHandler<FieldValues> = async (form) => {
    const updatedFields = Object.fromEntries(
      Object.entries(form).filter(([_, value]) => value !== ""),
    );
    if (Object.keys(updatedFields).length === 0) {
      toast.error(t("common:toasts.fill_at_least_one_field"));
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
        toast.success(t("common:toasts.edit_account_success"));
        reset();
        mutate();
        setIsEditLoginOpen(false);
      } else {
        toast.error(response.message || t("common:toasts.edit_account_failed"));
      }
    } catch (e) {
      toast.error(getErrorMessage(e) || t("common:toasts.edit_account_failed"));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Widget>
      <Widget.BigHeader>
        <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
          {t("account_widget.edit.title")}
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
                  {t(`account_widget.dialog.labels.${key}`)}
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
        <Button
          variant="transparent"
          className="rounded-md px-2 py-1.5 text-xs"
          onClick={() => setIsEditLoginOpen(true)}
        >
          <FaEdit className="mr-2" />
          {t("account_widget.edit.edit_login_btn")}
        </Button>
        <SlidePanel
          isOpen={isEditLoginOpen}
          onClose={() => {
            setIsEditLoginOpen(false);
            reset();
          }}
          title="Edit Account Logins"
        >
          <div className="space-y-6">
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
            <form className="space-y-5">
              <FormField
                id="login"
                label={t("account_widget.dialog.labels.login")}
                placeholder={login}
                className="px-4 py-2.5"
                register={register}
                errors={errors}
              />
              <FormField
                id="password"
                label={t("account_widget.dialog.labels.password")}
                type="password"
                placeholder={t(
                  "account_widget.dialog.placeholders.edit_password",
                )}
                className="px-4 py-2.5"
                register={register}
                errors={errors}
              />
              <FormField
                id="backup_code"
                label={t("account_widget.dialog.labels.backup_code")}
                placeholder={t(
                  "account_widget.dialog.placeholders.edit_backup_code",
                )}
                className="px-4 py-2.5"
                register={register}
                errors={errors}
              />
              <Link
                to="https://store.steampowered.com/twofactor/manage"
                target="_blank"
                className="mt-1 text-sm leading-6 text-muted-foreground hover:underline sm:text-xs"
              >
                {t("account_widget.dialog.steam_guard_link")}
              </Link>
            </form>
            <div className="flex items-center rounded-lg border border-warning-ring bg-warning-light p-4 text-warning-light-foreground backdrop-blur-xl">
              <FaLock className="mr-3 flex-shrink-0" />
              <div className="flex-1 text-sm">
                {t("account_widget.dialog.security_notice")}
              </div>
            </div>
            {/* FOOTER ACTIONS */}
            <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row-reverse">
              <Button
                disabled={isSubmitting}
                onClick={handleSubmit(handleEditAccount)}
                variant="primary"
                className="w-full rounded-md px-5 py-3 text-sm sm:w-auto sm:py-2.5"
              >
                <FaEdit className="mr-2" />
                {t("account_widget.dialog.edit_btn")}
              </Button>
              <Button
                variant="secondary"
                className="w-full rounded-md px-4 py-2 text-sm sm:w-auto"
                onClick={() => {
                  setIsEditLoginOpen(false);
                  reset();
                }}
              >
                {t("common:buttons.cancel")}
              </Button>
            </div>
          </div>
        </SlidePanel>
      </Widget.Footer>
    </Widget>
  );
};
export default EditAccountWidget;