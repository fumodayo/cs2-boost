import { useTranslation } from "react-i18next";
import { AppContext } from "../context/AppContext";
import { useContext, useEffect } from "react";
import { Dialog, DialogClose, DialogContent } from "../@radix-ui/Dialog";
import { Button } from "./Button";
import { FaArrowLeft, FaArrowRight, FaXmark } from "react-icons/fa6";
import FormField from "./FormField";
import { regexPassword } from "~/constants/regexs";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { authFailure, authStart, authSuccess } from "~/redux/user/userSlice";
import { getLocalStorage } from "~/utils/localStorage";
import { axiosInstance } from "~/axiosAuth";

const ResetPasswordModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { error } = useSelector((state: RootState) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  const {
    isOpenResetPasswordModal,
    toggleResetPasswordModal,
    toggleInputOTPModal,
  } = useContext(AppContext);

  const handleGoBack = () => {
    reset();
    toggleResetPasswordModal();
    toggleInputOTPModal();
  };

  useEffect(() => {
    dispatch(authFailure(""));
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (form) => {
    const { new_password, confirm_password } = form;
    if (new_password !== confirm_password) {
      dispatch(
        authFailure("Please enter a new password compare to confirm password"),
      );
    } else {
      try {
        dispatch(authStart());
        const { data } = await axiosInstance.post(`/auth/reset-password`, {
          ...form,
          email_address: getLocalStorage("send-email", ""),
          ip_location: getLocalStorage("ip_location", ""),
          country: getLocalStorage("country", ""),
          device: getLocalStorage("device", ""),
        });
        dispatch(authSuccess(data));
        reset();
        toggleResetPasswordModal();
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred";
        dispatch(authFailure(message));
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
                Change your password
              </h2>
              <p className="flex gap-1 text-sm text-muted-foreground">
                Enter a new password below to change your password
              </p>
              <div className="mt-8">
                <div className="space-y-4">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <FormField
                      id="new_password"
                      autoComplete="off"
                      type="password"
                      placeholder="New password"
                      register={register}
                      errors={errors}
                      errorMessage={error ?? undefined}
                      required
                      maxLength={24}
                      minLength={8}
                      rules={{
                        pattern: {
                          value: regexPassword,
                          message:
                            "The password must include: at least one uppercase letter, one lowercase letter, one number, and one special character",
                        },
                      }}
                      className="mt-4 block w-full rounded-md border-0 bg-field px-4 py-2.5 text-field-foreground shadow-sm ring-1 ring-field-ring placeholder:text-muted-foreground hover:ring-field-ring-hover focus:ring-field-ring-hover disabled:pointer-events-none disabled:opacity-50 sm:text-sm"
                    />
                    <FormField
                      id="confirm_password"
                      autoComplete="off"
                      type="password"
                      placeholder="Confirm your password"
                      register={register}
                      errors={errors}
                      errorMessage={error ?? undefined}
                      required
                      maxLength={24}
                      minLength={8}
                      rules={{
                        pattern: {
                          value: regexPassword,
                          message:
                            "The password must include: at least one uppercase letter, one lowercase letter, one number, and one special character",
                        },
                      }}
                      className="mt-4 block w-full rounded-md border-0 bg-field px-4 py-2.5 text-field-foreground shadow-sm ring-1 ring-field-ring placeholder:text-muted-foreground hover:ring-field-ring-hover focus:ring-field-ring-hover disabled:pointer-events-none disabled:opacity-50 sm:text-sm"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      className="mt-4 w-full rounded-md px-5 py-3 text-sm sm:py-2.5"
                    >
                      Change Password <FaArrowRight className="ml-2" />
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
