import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaSave, FaUnlockAlt } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  FormField,
  Input,
  Spinner,
  UploadAvatar,
  UploadBanner,
  Widget,
} from "~/components/ui";
import SlidePanel from "~/components/ui/SlidePanel/SlidePanel";
import { regexPassword } from "~/constants/regexs";
import { RootState } from "~/redux/store";
import {
  updatedStart,
  updateFailure,
  updateSuccess,
} from "~/redux/user/userSlice";
import { formateDate } from "~/utils";
import getErrorMessage from "~/utils/errorHandler";
import { Button } from "~/components/ui/Button";
import { userService } from "~/services/user.service";
/* Col data user */
const showInformation = [
  "username",
  "user_id",
  "email_address",
  "language",
  "phone_number",
  "cccd_number",
  "full_name",
  "date_of_birth",
  "gender",
  "address",
  "cccd_issue_date",
];
const UserWidget = () => {
  const { t } = useTranslation(["settings_page", "common", "validation"]);
  const { currentUser, loading, error } = useSelector(
    (state: RootState) => state.user,
  );
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [username, setUsername] = useState(currentUser?.username || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isBannerUploading, setIsBannerUploading] = useState(false);
  const [uploadResetTrigger, setUploadResetTrigger] = useState(0);
  const [bannerResetTrigger, setBannerResetTrigger] = useState(0);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: "onBlur",
    defaultValues: {
      current_password: "",
      new_password: "",
    },
  });
  const handleEditProfile = async () => {
    const payload: {
      username?: string;
      profile_picture?: string;
      banner_picture?: string;
    } = {};
    if (username !== currentUser?.username) payload.username = username;
    if (profileImage) payload.profile_picture = profileImage;
    if (bannerImage) payload.banner_picture = bannerImage;
    if (Object.keys(payload).length === 0) {
      toast.error("No changes to save.");
      return;
    }
    try {
      dispatch(updatedStart());
      const data = await userService.updateUser(payload);
      dispatch(updateSuccess(data));
      setProfileImage(null);
      setBannerImage(null);
      setUploadResetTrigger((prev) => prev + 1);
      setBannerResetTrigger((prev) => prev + 1);
      toast.success(t("common:toasts.profile_updated_success"));
    } catch (err) {
      const message = getErrorMessage(err);
      dispatch(updateFailure(message));
      toast.error(message);
    }
  };
  const onSubmit: SubmitHandler<FieldValues> = async (form) => {
    try {
      const { current_password, new_password } = form;
      await userService.changePassword({ current_password, new_password });
      toast.success(t("common:toasts.password_changed_success"));
      reset();
    } catch (err) {
      const message = getErrorMessage(err);
      setErrorMessage(message);
    }
  };
  return (
    <Widget>
      <Widget.Header className="flex-col items-start gap-3 sm:flex-row sm:items-center">
        <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
          {t("settings_page:user_widget.title")}
        </h3>
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          {/* EDIT PROFILE */}
          <Button
            variant="secondary"
            className="rounded-md px-4 py-2 text-sm"
            onClick={() => setIsEditProfileOpen(true)}
          >
            <FaPencil className="mr-1.5" />
            {t("settings_page:user_widget.edit_profile_btn")}
          </Button>
          <SlidePanel
            isOpen={isEditProfileOpen}
            onClose={() => {
              setIsEditProfileOpen(false);
              setUsername(currentUser?.username || "");
            }}
            title={t("settings_page:dialogs.edit_profile_title")}
          >
            {/* CONTENT */}
            <div className="space-y-6">
              <form className="flex w-full flex-col gap-5">
                {/* UPLOAD AVATAR */}
                <UploadAvatar
                  currentAvatar={currentUser?.profile_picture}
                  onChangeImage={setProfileImage}
                  onLoadingChange={setIsUploading}
                  resetTrigger={uploadResetTrigger}
                />
                {/* Username Input */}
                <Input
                  label={t("common:form.username_label")}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  errorMessage={
                    error && error.includes("Username") ? error : undefined
                  }
                  placeholder={currentUser?.username}
                />
                {/* Email Address - Read Only */}
                <Input
                  readOnly
                  label={t("common:form.email_label")}
                  placeholder={currentUser?.email_address}
                  noteText={t("settings_page:dialogs.email_note")}
                />
                {/* UPLOAD BANNER */}
                <UploadBanner
                  onChangeImage={setBannerImage}
                  onLoadingChange={setIsBannerUploading}
                  resetTrigger={bannerResetTrigger}
                />
              </form>
              {/* FOOTER ACTIONS */}
              <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row-reverse">
                <Button
                  disabled={loading || isUploading || isBannerUploading}
                  onClick={handleEditProfile}
                  variant="primary"
                  className="w-full rounded-md px-5 py-3 text-sm sm:w-auto sm:py-2.5"
                >
                  <FaSave className="mr-2" />
                  {loading || isUploading ? (
                    <Spinner />
                  ) : (
                    t("common:buttons.save_changes")
                  )}
                </Button>
                <Button
                  variant="secondary"
                  className="w-full rounded-md px-4 py-2 text-sm sm:w-auto"
                  onClick={() => {
                    setIsEditProfileOpen(false);
                    setUsername(currentUser?.username || "");
                  }}
                >
                  {t("common:buttons.cancel")}
                </Button>
              </div>
            </div>
          </SlidePanel>
          {/* CHANGE PASSWORD */}
          <Button
            variant="secondary"
            className="rounded-md px-4 py-2 text-sm"
            onClick={() => setIsChangePasswordOpen(true)}
          >
            <FaUnlockAlt className="mr-1.5" />
            {t("settings_page:user_widget.change_password_btn")}
          </Button>
          <SlidePanel
            isOpen={isChangePasswordOpen}
            onClose={() => {
              setIsChangePasswordOpen(false);
              reset();
              setErrorMessage("");
            }}
            title={t("settings_page:dialogs.change_password_title")}
          >
            {/* CONTENT */}
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  {t("settings_page:dialogs.change_current_password_title")}
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground sm:text-xs">
                  {t("settings_page:dialogs.change_current_password_subtitle")}
                </p>
              </div>
              {/* Current Password */}
              <FormField
                id="current_password"
                placeholder={t("common:form.current_password_placeholder")}
                className="mt-2 px-4 py-2.5"
                type="password"
                required
                maxLength={24}
                minLength={8}
                rules={{
                  pattern: {
                    value: regexPassword,
                    message: t("validation:password_complexity"),
                  },
                }}
                noteText={t("settings_page:dialogs.password_note_google")}
                register={register}
                errors={errors}
                errorMessage={errorMessage}
              />
              {/* New Password */}
              <FormField
                id="new_password"
                placeholder={t("common:form.new_password_placeholder")}
                className="mt-2 px-4 py-2.5"
                type="password"
                required
                maxLength={24}
                minLength={8}
                rules={{
                  pattern: {
                    value: regexPassword,
                    message: t("validation:password_complexity"),
                  },
                }}
                noteText={t("settings_page:dialogs.password_note_complexity")}
                register={register}
                errors={errors}
                errorMessage={errorMessage}
              />
              {/* FOOTER ACTIONS */}
              <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row-reverse">
                <Button
                  onClick={handleSubmit(onSubmit)}
                  variant="primary"
                  className="w-full rounded-md px-5 py-3 text-sm sm:w-auto sm:py-2.5"
                >
                  <FaSave className="mr-2" />
                  {t("common:buttons.change_password")}
                </Button>
                <Button
                  variant="secondary"
                  className="w-full rounded-md px-4 py-2 text-sm sm:w-auto"
                  onClick={() => {
                    setIsChangePasswordOpen(false);
                    reset();
                    setErrorMessage("");
                  }}
                >
                  {t("common:buttons.cancel")}
                </Button>
              </div>
            </div>
          </SlidePanel>
        </div>
      </Widget.Header>
      <Widget.Content>
        <div className="grid grid-cols-2 lg:grid-cols-3">
          {currentUser &&
            Object.entries(currentUser)
              .filter(
                ([key]) =>
                  showInformation.includes(key) &&
                  currentUser[key as keyof typeof currentUser],
              )
              .map(([key, value]) => (
                <div key={key} className="px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium capitalize text-foreground">
                    {t(`settings_page:user_widget.labels.${key}`)}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                    {["cccd_issue_date", "date_of_birth"].includes(key) && value
                      ? formateDate(value as string)
                      : String(value)}
                  </dd>
                </div>
              ))}
        </div>
      </Widget.Content>
    </Widget>
  );
};
export default UserWidget;