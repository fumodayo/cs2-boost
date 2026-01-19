import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaFingerprint, FaLock, FaPlus } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import { FormField, Widget } from "~/components/ui";
import SlidePanel from "~/components/ui/SlidePanel/SlidePanel";
import { IOrder } from "~/types";
import { Button } from "~/components/ui/Button";
import { orderService } from "~/services/order.service";
import getErrorMessage from "~/utils/errorHandler";
interface BlankAccountWidgetProps {
  order: IOrder;
  mutate: () => void;
}
const BlankAccountWidget = ({ order, mutate }: BlankAccountWidgetProps) => {
  const { t } = useTranslation(["boost_page", "common"]);
  const { id: boost_id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddLoginOpen, setIsAddLoginOpen] = useState(false);
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
  const handleAddAccount: SubmitHandler<FieldValues> = async (form) => {
    if (!boost_id) return;
    const { login, password, backup_code } = form;
    try {
      setIsSubmitting(true);
      const payload = { login, password, backup_code };
      const response = await orderService.addAccountToOrder(boost_id, payload);
      if (response.success) {
        toast.success(t("common:toasts.add_account_success"));
        reset();
        mutate();
        setIsAddLoginOpen(false);
      } else {
        toast.error(response.message || t("common:toasts.add_account_failed"));
      }
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      toast.error(errorMessage || t("common:toasts.add_account_failed"));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Widget>
      <div className="px-4 py-6 sm:px-6">
        <div className="text-center">
          <FaFingerprint className="mx-auto" />
          <h2 className="text-base font-medium leading-6 text-foreground">
            {t("account_widget.blank.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("account_widget.blank.subtitle")}
          </p>
        </div>
      </div>
      <Widget.Footer>
        <Button
          variant="transparent"
          className="rounded-md px-2 py-1.5 text-xs"
          onClick={() => setIsAddLoginOpen(true)}
        >
          <FaPlus className="mr-2" />
          {t("account_widget.blank.add_logins_btn")}
        </Button>
        <SlidePanel
          isOpen={isAddLoginOpen}
          onClose={() => {
            setIsAddLoginOpen(false);
            reset();
          }}
          title={t("account_widget.dialog.add_title")}
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
                  <p className="truncate text-xs capitalize text-muted-foreground">
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
                placeholder={t("account_widget.dialog.placeholders.login")}
                className="px-4 py-2.5"
                required
                register={register}
                errors={errors}
              />
              <FormField
                id="password"
                type="password"
                label={t("account_widget.dialog.labels.password")}
                placeholder={t("account_widget.dialog.placeholders.password")}
                className="px-4 py-2.5"
                required
                register={register}
                errors={errors}
              />
              <FormField
                id="backup_code"
                label={t("account_widget.dialog.labels.backup_code")}
                placeholder={t(
                  "account_widget.dialog.placeholders.backup_code",
                )}
                className="px-4 py-2.5"
                required
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
                onClick={handleSubmit(handleAddAccount)}
                variant="primary"
                className="w-full rounded-md px-5 py-3 text-sm sm:w-auto sm:py-2.5"
              >
                <FaPlus className="mr-2" />
                {t("account_widget.dialog.add_btn")}
              </Button>
              <Button
                variant="secondary"
                className="w-full rounded-md px-4 py-2 text-sm sm:w-auto"
                onClick={() => {
                  setIsAddLoginOpen(false);
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
export default BlankAccountWidget;