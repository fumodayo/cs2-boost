import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../context/AppContext";
import { Dialog, DialogContent } from "../@radix-ui/Dialog";
import { Button } from "./Button";
import { FaArrowLeft, FaArrowRight, FaXmark } from "react-icons/fa6";
import { DialogClose } from "@radix-ui/react-dialog";
import { getLocalStorage } from "~/utils/localStorage";
import { axiosInstance } from "~/axiosAuth";
import { useDeviceType, useStorageIPLocation } from "~/hooks";

const InputOtpModal = () => {
  const OTPLength = 6;
  const { t } = useTranslation();
  const {
    isOpenInputOTPModal,
    toggleInputOTPModal,
    toggleForgotModal,
    toggleResetPasswordModal,
  } = useContext(AppContext);

  const [errorMessage, setErrorMessage] = useState("");

  const handleGoBack = () => {
    toggleInputOTPModal();
    toggleForgotModal();
  };

  const [otp, setOtp] = useState(new Array(OTPLength).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useStorageIPLocation();
  useDeviceType();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = async (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Allow only one input
    newOtp[idx] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Submit trigger
    const combineOtp = newOtp.join("");
    if (combineOtp.length === OTPLength) {
      // API: AUTH WITH OTP
      try {
        const { data } = await axiosInstance.post(`/auth/auth-with-otp`, {
          otp: combineOtp,
        });
        if (data.success) {
          setOtp(new Array(OTPLength).fill(""));
          toggleInputOTPModal();
          toggleResetPasswordModal();
        }
      } catch (err) {
        const message = (err as { message: string }).message;
        setErrorMessage(message);
      }
    }

    // Move to next input if current field is filled
    if (value && idx < OTPLength - 1 && inputRefs.current[idx + 1]) {
      inputRefs.current[idx + 1].focus();
    }
  };

  const handleClick = (idx: number) => {
    inputRefs.current[idx].setSelectionRange(1, 1);

    // optional
    if (idx > 0 && !otp[idx - 1]) {
      inputRefs.current[otp.indexOf("")].focus();
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
      // Move focus to previous input field on backspace
      inputRefs.current[idx - 1].focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post(`/auth/auth-with-otp`, {
        otp: otp.join(""),
      });

      if (data.success) {
        setOtp(new Array(OTPLength).fill(""));
        toggleInputOTPModal();
        toggleResetPasswordModal();
      }
    } catch (err) {
      const message = (err as { message: string }).message;
      setErrorMessage(message);
    }
  };

  const [isResendCountdown, setIsResendCountdown] = useState(true);
  const [countdownTime, setCountdownTime] = useState(60);

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;

    if (isResendCountdown) {
      timer = setInterval(() => {
        setCountdownTime((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setIsResendCountdown(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isResendCountdown]);

  const handleResendCode = async () => {
    setIsResendCountdown(true);
    try {
      const email = getLocalStorage("send-email", "");
      if (!email) {
        toggleForgotModal();
        toggleInputOTPModal();
      }

      const { data } = await axiosInstance.post(`/auth/forgot-password`, {
        email_address: email,
      });

      if (data.success) {
        console.log("OTP resent successfully!");
      } else {
        setErrorMessage("Failed to send OTP!");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setErrorMessage("Failed to send OTP!");
    }
  };

  return (
    <Dialog open={isOpenInputOTPModal} onOpenChange={toggleInputOTPModal}>
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
                            aria-label={`pin input ${idx + 1} of 6`}
                            ref={(input) => {
                              if (input) inputRefs.current[idx] = input;
                            }}
                            value={value}
                            onChange={(e) => handleChange(idx, e)}
                            onClick={() => handleClick(idx)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            className="focus:ring-primary-500 h-12 w-full rounded border-0 bg-field text-center text-field-foreground ring-1 ring-inset ring-field-ring placeholder:text-muted-foreground hover:ring-field-ring-hover focus:ring-2 focus:ring-inset focus:ring-field-ring-hover md:h-10 lg:h-12"
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-sm text-red-500">
                        {errorMessage}
                      </p>
                    </div>
                    <Button
                      disabled={otp.join("").length < OTPLength}
                      variant="primary"
                      className="mt-4 w-full rounded-md px-5 py-3 text-sm sm:py-2.5"
                    >
                      {t("ForgotModal.btn")} <FaArrowRight className="ml-2" />
                    </Button>
                  </form>
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    {t("ForgotModal.subtitle2")}
                    {isResendCountdown ? (
                      `Resend in ${countdownTime}s`
                    ) : (
                      <Button
                        onClick={handleResendCode}
                        variant="none"
                        className="ml-1 text-foreground hover:underline"
                      >
                        {t("ForgotModal.subtitle3")}
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
