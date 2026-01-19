import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { FaArrowRight, FaGoogle, FaXmark } from "react-icons/fa6";
import { Dialog, DialogClose, DialogContent } from "../../@radix-ui/Dialog";
import { Button } from "../Button";
import { useTranslation } from "react-i18next";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { FormField } from "~/components/ui/Form";
import { useDeviceType, useStorageIPLocation } from "~/hooks";
import { getLocalStorage } from "~/utils/localStorage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { authFailure, authStart, authSuccess } from "~/redux/user/userSlice";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "~/utils/firebase";
import getErrorMessage from "~/utils/errorHandler";
import { IGoogleAuthPayload } from "~/types";
import { authService } from "~/services/auth.service";
import { liveChatService } from "~/services/liveChat.service";
import { Spinner } from "~/components/ui/Feedback";
const GUEST_LIVE_CHAT_ID_KEY = "cs2boost_guest_live_chat_id";
const GUEST_EMAIL_KEY = "cs2boost_guest_email";
const LoginModal = () => {
  const { t } = useTranslation(["auth", "common"]);
  const { loading, error } = useSelector((state: RootState) => state.user);
  const [isLoadingAuthWithGoogle, setIsLoadingAuthWithGoogle] = useState(false);
  const {
    isOpenLoginModal,
    toggleRegisterModal,
    toggleLoginModal,
    toggleForgotModal,
  } = useContext(AppContext);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: "onBlur",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  useEffect(() => {
    dispatch(authFailure(""));
  }, [dispatch]);
  const toggled = () => {
    clearErrors();
    reset();
    toggleLoginModal();
    toggleRegisterModal();
    dispatch(authFailure(""));
  };
  const toggledForgotPassword = () => {
    clearErrors();
    reset();
    toggleLoginModal();
    toggleForgotModal();
    dispatch(authFailure(""));
  };
  useStorageIPLocation();
  useDeviceType();
  const onSubmit: SubmitHandler<FieldValues> = async (form) => {
    const { identifier, password } = form;
    if (identifier && password) {
      try {
        dispatch(authStart());
        const payload = {
          identifier,
          password,
          ip_location: getLocalStorage("ip_location", ""),
          country: getLocalStorage("country", ""),
          device: getLocalStorage("device", ""),
        };
        const data = await authService.login(payload);
        dispatch(authSuccess(data));
        const guestId = localStorage.getItem(GUEST_LIVE_CHAT_ID_KEY);
        if (guestId) {
          try {
            await liveChatService.mergeGuestChats(guestId);
            localStorage.removeItem(GUEST_LIVE_CHAT_ID_KEY);
            localStorage.removeItem(GUEST_EMAIL_KEY);
          } catch (error) {
            console.error("Failed to merge guest chats", error);
          }
        }
        reset();
        toggleLoginModal();
      } catch (err) {
        const error = getErrorMessage(err);
        dispatch(authFailure(error));
      }
    } else {
      return;
    }
  };
  const handleAuthWithGoogle = async () => {
    setIsLoadingAuthWithGoogle(true);
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const results = await signInWithPopup(auth, provider);
      const payload = {
        username: results.user.displayName,
        email_address: results.user.email,
        profile_picture: results.user.photoURL,
        ip_location: getLocalStorage("ip_location", ""),
        country: getLocalStorage("country", ""),
        device: getLocalStorage("device", ""),
      } as IGoogleAuthPayload;
      const data = await authService.authWithGmail(payload);
      dispatch(authSuccess(data));
      const guestId = localStorage.getItem(GUEST_LIVE_CHAT_ID_KEY);
      if (guestId) {
        try {
          await liveChatService.mergeGuestChats(guestId);
          localStorage.removeItem(GUEST_LIVE_CHAT_ID_KEY);
          localStorage.removeItem(GUEST_EMAIL_KEY);
        } catch (error) {
          console.error("Failed to merge guest chats", error);
        }
      }
      reset();
      toggleLoginModal();
    } catch (err) {
      const error = getErrorMessage(err);
      dispatch(authFailure(error));
    } finally {
      setIsLoadingAuthWithGoogle(false);
    }
  };
  return (
    <Dialog open={isOpenLoginModal} onOpenChange={toggleLoginModal}>
      <DialogContent>
        <div className="relative max-h-[calc(100svh-250px)] overflow-y-auto">
          <div className="flex w-full overflow-hidden rounded-xl bg-card">
            <div className="order-1 hidden rounded-r-lg bg-cover bg-center md:block md:w-1/2">
              <img
                className="h-full w-full object-none"
                src="/assets/illustrations/login-bg.png"
                alt="login-bg"
              />
            </div>
            <div className="order-0 mx-auto w-full p-8 py-12 sm:max-w-lg sm:p-14 md:w-1/2">
              <h2 className="font-display mb-2 text-3xl font-semibold text-foreground">
                {t("login_modal.title", { ns: "auth" })}
              </h2>
              <p className="flex gap-1 text-sm text-muted-foreground">
                {t("login_modal.no_account", { ns: "auth" })}
                <Button
                  variant="none"
                  onClick={toggled}
                  className="text-foreground hover:underline"
                >
                  {t("login_modal.create_one", { ns: "auth" })}
                </Button>
              </p>
              <div className="mt-4">
                <div className="space-y-4">
                  <div className="flex">
                    <Button
                      disabled={loading || isLoadingAuthWithGoogle}
                      onClick={handleAuthWithGoogle}
                      variant="secondary"
                      className="flex-1 rounded-md px-5 py-3 text-sm font-medium hover:bg-[#ea4335] hover:text-neutral-100 hover:ring-[#ea4335] sm:py-2.5"
                    >
                      {isLoadingAuthWithGoogle ? (
                        <Spinner />
                      ) : (
                        <>
                          <FaGoogle size={18} className="mr-1" />
                          {t("buttons.login_with_google", { ns: "common" })}
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="w-1/5 border-b border-border lg:w-1/4" />
                    <div className="text-center text-xs capitalize text-muted-foreground">
                      {t("login_modal.with_email", { ns: "auth" })}
                    </div>
                    <span className="w-1/5 border-b border-border lg:w-1/4" />
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <FormField
                      disabled={loading}
                      autoFocus
                      id="identifier"
                      placeholder={t("form.email_or_username_placeholder", {
                        ns: "common",
                      })}
                      className="px-4 py-2.5"
                      register={register}
                      errors={errors}
                      errorMessage={error ?? undefined}
                    />
                    <FormField
                      disabled={loading}
                      id="password"
                      placeholder={t("form.password_placeholder", {
                        ns: "common",
                      })}
                      className="mt-2 px-4 py-2.5"
                      type="password"
                      register={register}
                      errors={errors}
                      errorMessage={error ?? undefined}
                    />
                    <span
                      onClick={toggledForgotPassword}
                      className="mt-2 block cursor-pointer text-sm text-muted-foreground hover:underline sm:text-xs"
                    >
                      {t("login_modal.forgot_password", { ns: "auth" })}
                    </span>
                    <Button
                      disabled={loading}
                      variant="primary"
                      className="mt-4 w-full rounded-md px-5 py-3 text-sm sm:py-2.5"
                    >
                      {t("buttons.continue", { ns: "common" })}
                      <FaArrowRight className="ml-2" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogClose>
          <Button
            onClick={() => {
              reset();
              dispatch(authFailure(""));
            }}
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
export default LoginModal;