import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import { FaShieldAlt } from "react-icons/fa";
import { IChangePasswordPayload } from "~/types";
import getErrorMessage from "~/utils/errorHandler";
import { FormField, Spinner } from "~/components/shared";
import { Button } from "~/components/shared/Button";
import { useTranslation } from "react-i18next";
import { userService } from "~/services/user.service";

const ChangePasswordCard: React.FC = () => {
  const { t } = useTranslation();
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
      toast.success("Password changed successfully!");
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
              {t("AdminSettingsPage.PasswordCard.title")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("AdminSettingsPage.PasswordCard.subtitle")}
            </p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 p-6 pt-0">
          <FormField
            id="current_password"
            type="password"
            label="Current Password"
            register={register}
            errors={errors}
            required
          />
          <FormField
            id="new_password"
            type="password"
            label="New Password"
            register={register}
            errors={errors}
            required
            rules={{
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long.",
              },
            }}
          />
          <FormField
            id="confirm_password"
            type="password"
            label="Confirm New Password"
            register={register}
            errors={errors}
            required
            rules={{
              validate: (value) =>
                value === watch("new_password") || "Passwords do not match.",
            }}
          />
        </div>
        <div className="flex items-center justify-end gap-3 bg-muted/50 px-6 py-4">
          <Button type="submit" disabled={isMutating}>
            {isMutating ? (
              <Spinner size="sm" />
            ) : (
              t("AdminSettingsPage.PasswordCard.updateBtn")
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordCard;
