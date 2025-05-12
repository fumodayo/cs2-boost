import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaSave, FaUnlockAlt } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { axiosAuth } from "~/axiosAuth";
import {
  Dialog,
  DialogClose,
  DialogTrigger,
  EditDialogContent,
} from "~/components/@radix-ui/Dialog";
import {
  Button,
  FormField,
  Input,
  UploadImage,
  Widget,
} from "~/components/shared";
import { regexPassword } from "~/constants/regexs";
import { RootState } from "~/redux/store";
import {
  updatedStart,
  updateFailure,
  updateSuccess,
} from "~/redux/user/userSlice";
import { ICurrentUserProps } from "~/types";
import { formateDate } from "~/utils";
import { v4 as uuidv4 } from "uuid";

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

const UserWidget = ({ currentUser }: { currentUser?: ICurrentUserProps }) => {
  const { t } = useTranslation();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState("");

  const { loading, error } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      current_password: "",
      new_password: "",
    },
  });

  const handleEditProfile = async () => {
    try {
      dispatch(updatedStart());
      const { data } = await axiosAuth.post(
        `/user/update/${currentUser?._id}`,
        {
          profile_picture: profileImage,
          username,
        },
      );
      dispatch(updateSuccess(data));
      setUsername("");
      setProfileImage(null);
      toast.success("Edit Successfully");
    } catch (err) {
      const { message } = err;
      dispatch(updateFailure(message));
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (form) => {
    try {
      await axiosAuth.post(`/user/change-password/${currentUser?._id}`, {
        ...form,
      });
      toast.success("Change Password Successfully");
      reset();
    } catch (err) {
      const { message } = err;
      setErrorMessage(message);
    }
  };

  return (
    <Widget>
      <Widget.Header>
        <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
          {t("SettingsPage.UserWidget.title")}
        </h3>
        <div className="flex space-x-2">
          {/* EDIT PROFILE */}
          <Dialog>
            <DialogTrigger>
              <Button
                variant="secondary"
                className="rounded-md px-4 py-2 text-sm"
              >
                <FaPencil className="mr-1.5" />
                {t("SettingsPage.UserWidget.btn.Edit Profile")}
              </Button>
            </DialogTrigger>
            <EditDialogContent title="Edit Your Profile">
              {/* CONTENT */}
              <div className="scroll-md relative flex-1 overflow-auto px-4 pt-6 sm:px-6">
                <form className="flex w-full flex-col gap-5 pb-20 sm:grid sm:grid-cols-2 sm:pb-10">
                  {/* UPLOAD AVATAR */}
                  <div className="col-span-full flex flex-col">
                    <label className="mb-1.5 block text-sm font-medium leading-6 text-foreground/90">
                      {t("UploadImage.title")}
                    </label>

                    <UploadImage onChangeImage={setProfileImage} />
                  </div>
                  <div className="col-span-full flex flex-col">
                    {/* Username Input */}
                    <Input
                      label="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      errorMessage={error}
                      placeholder={currentUser?.username}
                    />
                  </div>

                  {/* Email Address - Read Only */}
                  <div className="col-span-full">
                    <Input
                      readOnly
                      label="Email"
                      placeholder={currentUser?.email_address}
                      noteText="Please contact support if you need to change your email."
                    />
                  </div>
                </form>
              </div>

              {/* FOOTER */}
              <div className="flex flex-shrink-0 flex-row-reverse gap-3 rounded-b-xl border-t border-border bg-card-surface px-4 py-4">
                <Button
                  onClick={handleEditProfile}
                  variant="primary"
                  className="w-full rounded-md px-5 py-3 text-sm sm:w-auto sm:py-2.5"
                >
                  <FaSave className="mr-2" />
                  {t("Dialog.btn.Save Changes")}
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

          {/* CHANGE PASSWORD */}
          <Dialog>
            <DialogTrigger>
              <Button
                variant="secondary"
                className="rounded-md px-4 py-2 text-sm"
              >
                <FaUnlockAlt className="mr-1.5" />
                {t("SettingsPage.UserWidget.btn.Change Password")}
              </Button>
            </DialogTrigger>
            <EditDialogContent title="Change password">
              {/* CONTENT */}
              <div className="scroll-md relative flex-1 overflow-auto px-4 pt-6 sm:px-6">
                <div className="flex flex-col gap-5 pb-20 sm:pb-10">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      {t("Dialog.label.Change current password")}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground sm:text-xs">
                      {t(
                        "Dialog.label.Please enter your old password to change your password.",
                      )}
                    </p>
                  </div>
                  {/* Current Password */}
                  <FormField
                    id="current_password"
                    placeholder="Current Password"
                    className="mt-2 px-4 py-2.5"
                    type="password"
                    required
                    maxLength={24}
                    minLength={8}
                    rules={{
                      pattern: {
                        value: regexPassword,
                        message:
                          "The password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
                      },
                    }}
                    noteText="If you create an account with a google account, your password has been sent to gmail."
                    register={register}
                    errors={errors}
                    errorMessage={errorMessage}
                  />
                  {/* New Password */}
                  <FormField
                    id="new_password"
                    placeholder="New Password"
                    className="mt-2 px-4 py-2.5"
                    type="password"
                    required
                    maxLength={24}
                    minLength={8}
                    rules={{
                      pattern: {
                        value: regexPassword,
                        message:
                          "The password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
                      },
                    }}
                    noteText="Your password must be at least 6 characters and should include a combination of numbers, letters and special characters (!$@%)."
                    register={register}
                    errors={errors}
                    errorMessage={errorMessage}
                  />
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex flex-shrink-0 flex-row-reverse gap-3 rounded-b-xl border-t border-border bg-card-surface px-4 py-4">
                <Button
                  onClick={handleSubmit(onSubmit)}
                  variant="primary"
                  className="w-full rounded-md px-5 py-3 text-sm sm:w-auto sm:py-2.5"
                >
                  <FaSave className="mr-2" />
                  {t("Dialog.btn.Change password")}
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
        </div>
      </Widget.Header>
      <Widget.Content>
        <div className="grid grid-cols-2 lg:grid-cols-3">
          {currentUser &&
            Object.entries(currentUser)
              .filter(([key]) => showInformation.includes(key))
              .map(([key, value]) => (
                <div key={uuidv4()} className="px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium capitalize text-foreground">
                    {t(`Globals.User.label.${key.split("_").join(" ")}`)}
                  </dt>

                  <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                    {["cccd_issue_date", "date_of_birth"].includes(key) && value
                      ? formateDate(value)
                      : value}
                  </dd>
                </div>
              ))}
        </div>
      </Widget.Content>
    </Widget>
  );
};

export default UserWidget;
