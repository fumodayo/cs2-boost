import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import { FaUserEdit } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "~/redux/store";
import { updateSuccess } from "~/redux/user/userSlice";
import { IUpdateUserPayload } from "~/types";
import getErrorMessage from "~/utils/errorHandler";
import { FormField, Spinner } from "~/components/shared";
import { Button } from "~/components/shared/Button";
import { useTranslation } from "react-i18next";
import { userService } from "~/services/user.service";

const ProfileInfoCard: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<IUpdateUserPayload>({
    defaultValues: {
      username: currentUser?.username || "",
      email_address: currentUser?.email_address || "",
    },
  });

  const { trigger, isMutating } = useSWRMutation(
    `/users/me`,
    (_, { arg }: { arg: IUpdateUserPayload }) => userService.updateUser(arg),
  );

  const onSubmit: SubmitHandler<IUpdateUserPayload> = async (formData) => {
    try {
      const updatedUser = await trigger(formData);
      dispatch(updateSuccess(updatedUser));
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <FaUserEdit size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {t("AdminSettingsPage.ProfileCard.title")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("AdminSettingsPage.ProfileCard.subtitle")}
            </p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 p-6 pt-0">
          <FormField
            id="username"
            label="Username"
            register={register}
            errors={errors}
            required
          />
          <FormField
            id="email_address"
            label="Email Address"
            type="email"
            register={register}
            errors={errors}
            required
          />
        </div>
        <div className="flex items-center justify-end gap-3 bg-muted/50 px-6 py-4">
          <Button type="submit" disabled={!isDirty || isMutating}>
            {isMutating ? <Spinner size="sm" /> : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfoCard;
