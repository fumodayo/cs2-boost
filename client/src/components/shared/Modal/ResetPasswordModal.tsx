import { useTranslation } from "react-i18next";
import { useContext, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { useDispatch } from "react-redux";
import useSWRMutation from "swr/mutation";
import { AppContext } from "../../context/AppContext";
import { Dialog, DialogClose, DialogContent } from "../../@radix-ui/Dialog";
import { Button } from "../Button";
import FormField from "../FormField";
import { FaArrowLeft, FaArrowRight, FaXmark } from "react-icons/fa6";
import { authSuccess } from "~/redux/user/userSlice";
import { authService } from "~/services/auth.service";
import getErrorMessage from "~/utils/errorHandler";
import { regexPassword } from "~/constants/regexs";
import { IResetPasswordPayload } from "~/types";
import { getLocalStorage } from "~/utils/localStorage";

const RESET_PASSWORD_KEY = "/auth/reset-password";

const ResetPasswordModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    isOpenResetPasswordModal,
    toggleResetPasswordModal,
    toggleInputOTPModal,
  } = useContext(AppContext);
  const [errorMessage, setErrorMessage] = useState("");

  const { trigger, isMutating, error } = useSWRMutation(
    RESET_PASSWORD_KEY,
    (_, { arg }: { arg: IResetPasswordPayload }) => authService.resetPassword(arg),
  );

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { new_password: "", confirm_password: "" },
  });

  const handleGoBack = () => {
    reset();
    toggleResetPasswordModal();
    toggleInputOTPModal();
  };

  const onSubmit: SubmitHandler<FieldValues> = async (form) => {
    const { new_password, confirm_password } = form;
    if (new_password !== confirm_password) {
      setErrorMessage(
        "Please enter a new password compare to confirm password",
      );
    } else {
      try {
        const payload = {
          new_password: new_password,
          email_address: getLocalStorage("send-email", ""),
          ip_location: getLocalStorage("ip_location", ""),
          country: getLocalStorage("country", ""),
          device: getLocalStorage("device", ""),
        };
        const user = await trigger(payload);

        dispatch(authSuccess(user));
        reset();
        toggleResetPasswordModal();
      } catch (e) {
        console.error("Failed to reset password:", e);
      }
    }
  };

  return (
    <Dialog
      open={isOpenResetPasswordModal}
      onOpenChange={toggleResetPasswordModal}
    >
      <DialogContent>
        <div className="relative max-h-[calc(100svh-150px)] overflow-y-auto">
          <div className="sticky -top-7 -mt-10 h-10 w-full bg-gradient-to-b from-card" />
          <div className="flex w-full overflow-hidden rounded-xl bg-card">
            <div className="order-1 hidden rounded-r-lg bg-cover bg-center md:block md:w-1/2">
              <img
                className="h-full w-full object-none"
                src="/assets/illustrations/login-bg.png"
                alt="login-bg"
              />
            </div>
            <div className="order-0 mx-auto w-full p-8 py-12 sm:max-w-lg sm:p-14 md:w-1/2">
              <Button
                onClick={handleGoBack}
                variant="none"
                className="text-sm text-foreground hover:text-muted-foreground"
              >
                <FaArrowLeft className="mr-2" />
                {t("Globals.Go Back")}
              </Button>
              <h2 className="font-display mb-2 text-2xl font-semibold text-foreground">
                {t("ResetPasswordModal.title")}
              </h2>
              <p className="flex gap-1 text-sm text-muted-foreground">
                {t("ResetPasswordModal.subtitle")}
              </p>
              <div className="mt-8">
                <div className="space-y-4">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <FormField
                      id="new_password"
                      type="password"
                      placeholder="New Password"
                      register={register}
                      errors={errors}
                      required
                      maxLength={24}
                      minLength={8}
                      rules={{
                        pattern: {
                          value: regexPassword,
                          message:
                            "Password must contain uppercase, lowercase, number, and special character.",
                        },
                      }}
                      className="mt-4 block w-full rounded-md border-0 bg-field px-4 py-2.5 text-field-foreground shadow-sm ring-1 ring-field-ring placeholder:text-muted-foreground hover:ring-field-ring-hover focus:ring-field-ring-hover disabled:pointer-events-none disabled:opacity-50 sm:text-sm"
                    />
                    <FormField
                      id="confirm_password"
                      type="password"
                      placeholder="Confirm your password"
                      register={register}
                      errors={errors}
                      required
                      rules={{
                        validate: (value) =>
                          value === getValues("new_password") ||
                          "Passwords do not match.",
                      }}
                      className="mt-4 block w-full rounded-md border-0 bg-field px-4 py-2.5 text-field-foreground shadow-sm ring-1 ring-field-ring placeholder:text-muted-foreground hover:ring-field-ring-hover focus:ring-field-ring-hover disabled:pointer-events-none disabled:opacity-50 sm:text-sm"
                    />
                    {errorMessage ||
                      (error && (
                        <p className="mt-2 text-sm text-red-500">
                          {getErrorMessage(error)}
                        </p>
                      ))}
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isMutating}
                      className="mt-4 w-full rounded-md px-5 py-3 text-sm sm:py-2.5"
                    >
                      {isMutating ? "Changing..." : "Change Password"}
                      {!isMutating && <FaArrowRight className="ml-2" />}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogClose>
          <Button
            variant="light"
            className="absolute right-3 top-3 z-10 h-7 w-7 rounded-full p-1 sm:h-7 sm:w-7 md:text-white/80"
          >
            <FaXmark />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordModal;
