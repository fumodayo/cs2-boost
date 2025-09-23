import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { AppContext } from "../../context/AppContext";
import { setLocalStorage } from "~/utils/localStorage";
import getErrorMessage from "~/utils/errorHandler";
import { regexEmail } from "~/constants/regexs";
import { Dialog, DialogClose, DialogContent } from "../../@radix-ui/Dialog";
import { Button } from "../Button";
import FormField from "../FormField";
import { FaArrowLeft, FaArrowRight, FaXmark } from "react-icons/fa6";
import { authService } from "~/services/auth.service";

const ForgotPasswordModal = () => {
  const { t } = useTranslation();
  const {
    isOpenForgotModal,
    toggleForgotModal,
    toggleLoginModal,
    toggleInputOTPModal,
  } = useContext(AppContext);

  const { trigger, isMutating, error } = useSWRMutation(
    "/auth/forgot-password",
    (_, { arg }: { arg: string }) => authService.forgotPassword(arg),
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { email_address: "" },
  });

  const emailValue = watch("email_address", false);

  const handleGoBack = () => {
    reset();
    toggleLoginModal();
    toggleForgotModal();
  };

  const onSubmit: SubmitHandler<FieldValues> = async (form) => {
    try {
      await trigger(form.email_address);
      setLocalStorage("send-email", form.email_address);
      reset();
      toggleInputOTPModal();
      toggleForgotModal();
    } catch (e) {
      console.error("Forgot password failed:", e);
    }
  };

  return (
    <Dialog open={isOpenForgotModal} onOpenChange={toggleForgotModal}>
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
                {t("ForgotPasswordModal.title")}
              </h2>
              <p className="flex gap-1 text-sm text-muted-foreground">
                {t("ForgotPasswordModal.subtitle")}
              </p>
              <div className="mt-8">
                <div className="space-y-4">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <FormField
                      id="email_address"
                      autoComplete="off"
                      placeholder="Email Address"
                      register={register}
                      errors={errors}
                      errorMessage={error ? getErrorMessage(error) : undefined}
                      rules={{
                        required: "Email is required.",
                        pattern: {
                          value: regexEmail,
                          message: "Please enter a valid email address",
                        },
                      }}
                      className="mt-4 block w-full rounded-md border-0 bg-field px-4 py-2.5 text-field-foreground shadow-sm ring-1 ring-field-ring placeholder:text-muted-foreground hover:ring-field-ring-hover focus:ring-field-ring-hover disabled:pointer-events-none disabled:opacity-50 sm:text-sm"
                    />
                    <Button
                      type="submit"
                      disabled={isMutating || !emailValue}
                      variant="primary"
                      className="mt-4 w-full rounded-md px-5 py-3 text-sm sm:py-2.5"
                    >
                      {isMutating ? "Sending..." : t("ForgotModal.btn")}
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

export default ForgotPasswordModal;
