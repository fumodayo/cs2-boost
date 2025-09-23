import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useSWRMutation from "swr/mutation";

import { AppContext } from "../../context/AppContext";
import { Dialog, DialogContent, DialogClose } from "../../@radix-ui/Dialog";
import { Button } from "../Button";
import { FaArrowLeft, FaArrowRight, FaXmark } from "react-icons/fa6";

import { getLocalStorage } from "~/utils/localStorage";
import getErrorMessage from "~/utils/errorHandler";
import { authService } from "~/services/auth.service";
import toast from "react-hot-toast";

const VERIFY_OTP_KEY = "/auth/auth-with-otp";
const RESEND_OTP_KEY = "/auth/forgot-password";
const RESEND_OTP_COUNTDOWN_TIME = 300;

const InputOtpModal = () => {
  const OTPLength = 6;
  const { t } = useTranslation();
  const {
    isOpenInputOTPModal,
    toggleInputOTPModal,
    toggleForgotModal,
    toggleResetPasswordModal,
  } = useContext(AppContext);

  const [otp, setOtp] = useState<string[]>(new Array(OTPLength).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const {
    trigger: triggerVerifyOtp,
    isMutating: isVerifying,
    error: verifyError,
  } = useSWRMutation(VERIFY_OTP_KEY, (_, { arg }: { arg: string }) =>
    authService.verifyOtp(arg),
  );

  const { trigger: triggerResendOtp, isMutating: isResending } = useSWRMutation(
    RESEND_OTP_KEY,
    (_, { arg }: { arg: string }) => authService.forgotPassword(arg),
  );
  const handleVerifyOtp = async (otpValue: string) => {
    if (otpValue.length !== OTPLength) return;

    try {
      await triggerVerifyOtp(otpValue);
      setOtp(new Array(OTPLength).fill(""));
      toggleInputOTPModal();
      toggleResetPasswordModal();
    } catch (err) {
      const error = getErrorMessage(err);
      toast.error("OTP verification failed");
      console.error("OTP verification failed", error);
    }
  };

  useEffect(() => {
    if (isOpenInputOTPModal && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpenInputOTPModal]);

  const handleChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[idx] = value.substring(value.length - 1);
    setOtp(newOtp);

    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === OTPLength) {
      handleVerifyOtp(combinedOtp);
    }

    if (value && idx < OTPLength - 1 && inputRefs.current[idx + 1]) {
      inputRefs.current[idx + 1].focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(paste)) {
      setOtp(paste.split(""));
      handleVerifyOtp(paste);
    }
  };

  const handleKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[idx] &&
      idx > 0 &&
      inputRefs.current[idx - 1]
    ) {
      inputRefs.current[idx - 1].focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyOtp(otp.join(""));
  };

  const handleGoBack = () => {
    toggleInputOTPModal();
    toggleForgotModal();
  };

  const [countdown, setCountdown] = useState(RESEND_OTP_COUNTDOWN_TIME);
  const isCountingDown = countdown > 0;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCountingDown) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCountingDown]);

  const handleResendCode = async () => {
    const email = getLocalStorage("send-email", "");
    if (!email) {
      toggleForgotModal();
      toggleInputOTPModal();
      return;
    }

    try {
      await triggerResendOtp(email);
      setCountdown(RESEND_OTP_COUNTDOWN_TIME);
    } catch (err) {
      const error = getErrorMessage(err);
      toast.error("Failed to resend OTP");
      console.error("Failed to resend OTP", error);
    }
  };

  return (
    <Dialog open={isOpenInputOTPModal} onOpenChange={toggleInputOTPModal}>
      <DialogContent>
        <div className="relative max-h-[calc(100svh-150px)] overflow-y-auto">
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
              <h2 className="font-display mb-2 text-3xl font-semibold text-foreground">
                {t("ForgotModal.title")}
              </h2>
              <p className="flex gap-1 text-sm text-muted-foreground">
                {t("ForgotModal.subtitle1")}
              </p>
              <div className="mt-8">
                <div className="space-y-8">
                  <form onSubmit={handleSubmit}>
                    <div className="mx-auto">
                      <div className="flex items-center justify-center gap-2">
                        {otp.map((value, idx) => (
                          <input
                            key={idx}
                            id={`otp-${idx}`}
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            pattern="[0-9]*"
                            maxLength={1}
                            placeholder="_"
                            onPaste={handlePaste}
                            ref={(input) => {
                              if (input) inputRefs.current[idx] = input;
                            }}
                            value={value}
                            onChange={(e) => handleChange(idx, e)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            disabled={isVerifying}
                            className="focus:ring-primary-500 h-12 w-full rounded border-0 bg-field text-center text-field-foreground ring-1 ring-inset ring-field-ring placeholder:text-muted-foreground hover:ring-field-ring-hover focus:ring-2 focus:ring-inset focus:ring-field-ring-hover md:h-10 lg:h-12"
                          />
                        ))}
                      </div>
                      {verifyError && (
                        <p className="mt-1 text-sm text-red-500">
                          {getErrorMessage(verifyError)}
                        </p>
                      )}
                    </div>
                    <Button
                      disabled={isVerifying || otp.join("").length < OTPLength}
                      variant="primary"
                      className="mt-4 w-full rounded-md px-5 py-3 text-sm sm:py-2.5"
                    >
                      {isVerifying ? "Verifying..." : t("ForgotModal.btn")}
                      {!isVerifying && <FaArrowRight className="ml-2" />}
                    </Button>
                  </form>
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    {t("ForgotModal.subtitle2")}
                    {isCountingDown ? (
                      `${t("ForgotModal.subtitle4")}${countdown}s`
                    ) : (
                      <Button
                        onClick={handleResendCode}
                        variant="none"
                        disabled={isResending}
                        className="ml-1 text-foreground hover:underline"
                      >
                        {isResending
                          ? "Sending..."
                          : t("ForgotModal.subtitle3")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogClose>
          <Button
            onClick={() => setOtp([])}
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

export default InputOtpModal;
