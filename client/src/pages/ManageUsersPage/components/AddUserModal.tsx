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
import { Button, RadioGroup, RadioGroupItem } from "~/components/shared/Button";
import { ROLE } from "~/types/constants";
import { adminService } from "~/services/admin.service";
import { IAddUserPayload } from "~/types";
import useSWRMutation from "swr/mutation";
import { FormField } from "~/components/shared";

const ALLOWED_ROLES = [
  { id: ROLE.CLIENT, label: "Client" },
  { id: ROLE.ADMIN, label: "Admin" },
];

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

const AddUserModal = ({ isOpen, onClose, onUserAdded }: AddUserModalProps) => {
  const { t } = useTranslation();

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
      loading: t("Toast.creating", { item: "user" }),
      success: () => {
        onClose();
        onUserAdded();
        return t("Toast.createdSuccess", { item: "User" });
      },
      error: (err) =>
        err.response?.data?.message ||
        t("Toast.createdError", { item: "user" }),
    });
  };

  const onFormError = (formErrors: FieldValues) => {
    console.error("VALIDATION ERRORS:", formErrors);
    toast.error("Please fill in all required fields correctly.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <EditDialogContent title="addUser">
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <form
              id="add-user-form"
              onSubmit={handleSubmit(handleAddUser, onFormError)}
            >
              <div className="space-y-6">
                <FormField
                  id="username"
                  label="Username"
                  placeholder="e.g. john.doe"
                  register={register}
                  errors={errors}
                />

                <FormField
                  id="email_address"
                  label="Email"
                  type="email"
                  placeholder="e.g. user@example.com"
                  register={register}
                  errors={errors}
                />

                <FormField
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Enter a strong password"
                  register={register}
                  errors={errors}
                  noteText="Minimum 8 characters long."
                />

                <div>
                  <Label>Role</Label>
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
                              {role.label}
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
              {t("Common.cancel", "Cancel")}
            </Button>
            <Button
              size="sm"
              type="submit"
              form="add-user-form"
              variant="primary"
              disabled={isMutating}
            >
              {isMutating
                ? t("Common.creating", "Creating...")
                : t("Common.createUser", "Create User")}
            </Button>
          </div>
        </div>
      </EditDialogContent>
    </Dialog>
  );
};

export default AddUserModal;
