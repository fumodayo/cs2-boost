import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import { FaShieldAlt } from "react-icons/fa";
import { IChangePasswordPayload } from "~/types";
import getErrorMessage from "~/utils/errorHandler";
import { FormField, Spinner } from "~/components/ui";
import { Button } from "~/components/ui/Button";
import { useTranslation } from "react-i18next";
import { userService } from "~/services/user.service";

const ChangePasswordCard: React.FC = () => {
  const { t } = useTranslation(["admin_settings_page", "common", "validation"]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<IChangePasswordPayload>();

  const { trigger, isMutating } = useSWRMutation(
    `/users/me/change-password`,
    (_, { arg }: { arg: IChangePasswordPayload }) =>
      userService.changePassword(arg),
  );

  const onSubmit: SubmitHandler<IChangePasswordPayload> = async (formData) => {
    try {
      await trigger(formData);
      toast.success(t("common:toasts.password_changed_success"));
      reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <FaShieldAlt size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {t("password_card.title")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("password_card.subtitle")}
            </p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 p-6 pt-0">
          <FormField
            id="current_password"
            type="password"
            label={t("common:form.current_password_label")}
            placeholder={t("common:form.current_password_placeholder")}
            register={register}
            errors={errors}
            required
          />
          <FormField
            id="new_password"
            type="password"
            label={t("common:form.new_password_label")}
            placeholder={t("common:form.new_password_placeholder")}
            register={register}
            errors={errors}
            required
            rules={{
              minLength: {
                value: 8,
                message: t("validation:min_length", { count: 8 }),
              },
            }}
          />
          <FormField
            id="confirm_password"
            type="password"
            label={t("common:form.confirm_password_label")}
            placeholder={t("common:form.confirm_password_placeholder")}
            register={register}
            errors={errors}
            required
            rules={{
              validate: (value) =>
                value === watch("new_password") ||
                t("validation:passwords_do_not_match"),
            }}
          />
        </div>
        <div className="flex items-center justify-end gap-3 bg-muted/50 px-6 py-4">
          <Button size="sm" type="submit" disabled={isMutating}>
            {isMutating ? <Spinner /> : t("password_card.update_btn")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordCard;