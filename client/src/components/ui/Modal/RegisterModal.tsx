import { useContext, useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent } from "../../@radix-ui/Dialog";
import { Link } from "react-router-dom";
import { FaArrowRight, FaGoogle, FaXmark } from "react-icons/fa6";
import { AppContext } from "../../context/AppContext";
import { Trans, useTranslation } from "react-i18next";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FormField } from "~/components/ui/Form";
import { useDeviceType, useStorageIPLocation } from "~/hooks";
import { getLocalStorage } from "~/utils/localStorage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { authFailure, authStart, authSuccess } from "~/redux/user/userSlice";
import { regexEmail, regexPassword } from "~/constants/regexs";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "~/utils/firebase";
import { Button } from "../Button";
import getErrorMessage from "~/utils/errorHandler";
import { authService } from "~/services/auth.service";
import { IGoogleAuthPayload, IRegisterPayload } from "~/types";
import { liveChatService } from "~/services/liveChat.service";
import { Spinner } from "~/components/ui/Feedback";
const GUEST_LIVE_CHAT_ID_KEY = "cs2boost_guest_live_chat_id";
const GUEST_EMAIL_KEY = "cs2boost_guest_email";
const RegisterModal = () => {
  const { t } = useTranslation(["auth", "common", "validation"]);
  const { isOpenRegisterModal, toggleRegisterModal, toggleLoginModal } =
    useContext(AppContext);
  const { loading, error } = useSelector((state: RootState) => state.user);
  const [isLoadingAuthWithGoogle, setIsLoadingAuthWithGoogle] = useState(false);
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
      email_address: "",
      password: "",
    },
  });
  useEffect(() => {
    dispatch(authFailure(""));
  }, []);
  const toggled = () => {
    reset();
    clearErrors();
    toggleLoginModal();
    toggleRegisterModal();
    dispatch(authFailure(""));
  };
  useStorageIPLocation();
  useDeviceType();
  const onSubmit: SubmitHandler<FieldValues> = async (form) => {
    try {
      dispatch(authStart());
      const payload = {
        ...form,
        ip_location: getLocalStorage("ip_location", ""),
        country: getLocalStorage("country", ""),
        device: getLocalStorage("device", ""),
      } as IRegisterPayload;
      const data = await authService.register(payload);
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
      toggleRegisterModal();
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(authFailure(message));
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
      toggleRegisterModal();
    } catch (err) {
      const error = getErrorMessage(err);
      dispatch(authFailure(error));
    } finally {
      setIsLoadingAuthWithGoogle(false);
    }
  };
  return (
    <Dialog open={isOpenRegisterModal} onOpenChange={toggleRegisterModal}>
      <DialogContent>
        <div className="relative max-h-[calc(100svh-150px)] overflow-y-auto rounded-xl bg-card">
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
                {t("register_modal.title", { ns: "auth" })}
              </h2>
              <p className="flex gap-1 text-sm text-muted-foreground">
                {t("register_modal.already_member", { ns: "auth" })}
                <Button
                  variant="none"
                  onClick={toggled}
                  className="text-foreground hover:underline"
                >
                  {t("register_modal.login_here", { ns: "auth" })}
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
                          {t("buttons.signup_with_google", { ns: "common" })}
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="w-1/5 border-b border-border lg:w-1/4" />
                    <div className="text-center text-xs capitalize text-muted-foreground">
                      {t("register_modal.with_email", { ns: "auth" })}
                    </div>
                    <span className="w-1/5 border-b border-border lg:w-1/4" />
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <FormField
                      disabled={loading}
                      id="email_address"
                      placeholder={t("form.email_placeholder", {
                        ns: "common",
                      })}
                      className="px-4 py-2.5"
                      required
                      rules={{
                        pattern: {
                          value: regexEmail,
                          message: t("invalid_email", { ns: "validation" }),
                        },
                      }}
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
                      required
                      maxLength={24}
                      minLength={8}
                      rules={{
                        pattern: {
                          value: regexPassword,
                          message: t("password_complexity", {
                            ns: "validation",
                          }),
                        },
                      }}
                      register={register}
                      errors={errors}
                      errorMessage={error ?? undefined}
                    />
                    <span className="mt-4 block text-sm text-muted-foreground sm:text-xs">
                      <Trans
                        i18nKey="register_modal.terms_and_policy"
                        ns="auth"
                        t={t}
                        components={{
                          tos: (
                            <Link
                              to="/"
                              className="text-foreground hover:underline"
                            />
                          ),
                          pp: (
                            <Link
                              to="/"
                              className="text-foreground hover:underline"
                            />
                          ),
                        }}
                      />
                    </span>
                    <Button
                      disabled={loading}
                      variant="primary"
                      className="mt-4 w-full rounded-md px-5 py-3 text-sm sm:py-2.5"
                    >
                      {loading ? (
                        <Spinner />
                      ) : (
                        <>
                          {t("buttons.continue", { ns: "common" })}
                          <FaArrowRight className="ml-2" />
                        </>
                      )}
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
            disabled={loading}
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
export default RegisterModal;