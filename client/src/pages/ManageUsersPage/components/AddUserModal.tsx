import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  Controller,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Dialog, EditDialogContent } from "~/components/@radix-ui/Dialog";
import { Label } from "@radix-ui/react-label";
import { Button, RadioGroup, RadioGroupItem } from "~/components/ui/Button";
import { ROLE } from "~/types/constants";
import { adminService } from "~/services/admin.service";
import { IAddUserPayload } from "~/types";
import useSWRMutation from "swr/mutation";
import { FormField } from "~/components/ui";

const ALLOWED_ROLES = [
  { id: ROLE.CLIENT, key: "CLIENT" },
  { id: ROLE.ADMIN, key: "ADMIN" },
];

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

const AddUserModal = ({ isOpen, onClose, onUserAdded }: AddUserModalProps) => {
  const { t } = useTranslation(["manage_users_page", "common"]);

  const { trigger, isMutating } = useSWRMutation(
    "/admin/users",
    async (_url: string, { arg }: { arg: IAddUserPayload }) => {
      return adminService.createUser(arg);
    },
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email_address: "",
      password: "",
      role: ROLE.CLIENT,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => reset(), 150);
    }
  }, [isOpen, reset]);

  const handleAddUser: SubmitHandler<FieldValues> = async (formData) => {
    const payload = {
      username: formData.username,
      email_address: formData.email_address,
      password: formData.password,
      role: [formData.role],
    };

    await toast.promise(trigger(payload), {
      loading: t("common:toasts.creating", { item: t("common:user") }),
      success: () => {
        onClose();
        onUserAdded();
        return t("common:toasts.created_success", {
          item: t("common:user_singular"),
        });
      },
      error: (err) =>
        err.response?.data?.message ||
        t("common:toasts.created_error", { item: "user" }),
    });
  };

  const onFormError = (formErrors: FieldValues) => {
    console.error("VALIDATION ERRORS:", formErrors);
    toast.error(t("common:toasts.fill_required_fields"));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <EditDialogContent title={t("add_user_modal.title")}>
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <form
              id="add-user-form"
              onSubmit={handleSubmit(handleAddUser, onFormError)}
            >
              <div className="space-y-6">
                <FormField
                  id="username"
                  label={t("add_user_modal.labels.username")}
                  placeholder={t("add_user_modal.placeholders.username")}
                  register={register}
                  errors={errors}
                />

                <FormField
                  id="email_address"
                  type="email"
                  label={t("add_user_modal.labels.email")}
                  placeholder={t("add_user_modal.placeholders.email")}
                  register={register}
                  errors={errors}
                />

                <FormField
                  id="password"
                  label={t("add_user_modal.labels.password")}
                  placeholder={t("add_user_modal.placeholders.password")}
                  noteText={t("add_user_modal.notes.password")}
                  type="password"
                  register={register}
                  errors={errors}
                />

                <div>
                  <Label>{t("add_user_modal.labels.role")}</Label>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="mt-2 space-y-2"
                      >
                        {ALLOWED_ROLES.map((role) => (
                          <div
                            key={role.id}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem value={role.id} id={role.id} />
                            <Label htmlFor={role.id} className="font-normal">
                              {t(`add_user_modal.roles.${role.key}`)}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.role.message as string}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="flex shrink-0 justify-end gap-x-3 border-t border-border px-4 py-4 sm:px-6">
            <Button
              size="sm"
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isMutating}
            >
              {t("common:buttons.cancel")}
            </Button>
            <Button
              size="sm"
              type="submit"
              form="add-user-form"
              variant="primary"
              disabled={isMutating}
            >
              {isMutating
                ? t("common:buttons.creating")
                : t("add_user_modal.create_user_btn")}
            </Button>
          </div>
        </div>
      </EditDialogContent>
    </Dialog>
  );
};

export default AddUserModal;