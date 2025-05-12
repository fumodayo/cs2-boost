import { useContext, useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent } from "../@radix-ui/Dialog";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import { FaArrowRight, FaGoogle, FaXmark } from "react-icons/fa6";
import { AppContext } from "../context/AppContext";
import { useTranslation } from "react-i18next";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { axiosInstance } from "~/axiosAuth";
import FormField from "./FormField";
import { useDeviceType, useStorageIPLocation } from "~/hooks";
import { getLocalStorage } from "~/utils/localStorage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { authFailure, authStart, authSuccess } from "~/redux/user/userSlice";
import { regexEmail, regexPassword } from "~/constants/regexs";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "~/utils/firebase";
import { IconLoading } from "~/icons";

const RegisterModal = () => {
  const { t } = useTranslation();
  const { isOpenRegisterModal, toggleRegisterModal, toggleLoginModal } =
    useContext(AppContext);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<FieldValues>({
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
      const { data } = await axiosInstance.post(`/auth/register`, {
        ...form,
        ip_location: getLocalStorage("ip_location", ""),
        country: getLocalStorage("country", ""),
        device: getLocalStorage("device", ""),
      });
      dispatch(authSuccess(data));
      reset();
      toggleRegisterModal();
    } catch (err) {
      const { message } = err;
      dispatch(authFailure(message));
    }
  };

  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const handleAuthWithGoogle = async () => {
    setIsLoadingBtn(true);
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const results = await signInWithPopup(auth, provider);

      const { data } = await axiosInstance.post(`/auth/auth-with-gmail`, {
        username: results.user.displayName,
        email_address: results.user.email,
        profile_picture: results.user.photoURL,
        ip_location: getLocalStorage("ip_location", ""),
        country: getLocalStorage("country", ""),
        device: getLocalStorage("device", ""),
      });

      dispatch(authSuccess(data));
      reset();
      toggleRegisterModal();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingBtn(false);
    }
  };

  const preventEnterKeySubmission = (
    e: React.KeyboardEvent<HTMLFormElement>,
  ) => {
    const target = e.target;
    if (e.key === "Enter" && target instanceof HTMLInputElement) {
      e.preventDefault();
    }
  };

  return (
    <Dialog open={isOpenRegisterModal} onOpenChange={toggleRegisterModal}>
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
              <h2 className="font-display mb-2 text-3xl font-semibold text-foreground">
                {t("RegisterModal.title")}
              </h2>
              <p className="flex gap-1 text-sm text-muted-foreground">
                {t("RegisterModal.subtitle1")}
                <Button
                  onClick={toggled}
                  className="text-foreground hover:underline"
                >
                  {t("RegisterModal.btn1")}
                </Button>
              </p>
              <div className="mt-4">
                <div className="space-y-4">
                  <div className="flex">
                    <Button
                      disabled={isLoadingBtn}
                      onClick={handleAuthWithGoogle}
                      variant="secondary"
                      className="flex-1 rounded-md px-5 py-3 text-sm font-medium hover:bg-[#ea4335] hover:text-neutral-100 hover:ring-[#ea4335] sm:py-2.5"
                    >
                      {isLoadingBtn ? (
                        <div role="status">
                          <IconLoading />
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <>
                          <FaGoogle size={18} className="mr-1" />
                          {t("RegisterModal.btn2")}
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="w-1/5 border-b border-border lg:w-1/4" />
                    <div className="text-center text-xs capitalize text-muted-foreground">
                      {t("RegisterModal.subtitle2")}
                    </div>
                    <span className="w-1/5 border-b border-border lg:w-1/4" />
                  </div>
                  <form
                    onKeyDown={preventEnterKeySubmission}
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <FormField
                      id="email_address"
                      placeholder="Email Address"
                      className="px-4 py-2.5"
                      required
                      rules={{
                        pattern: {
                          value: regexEmail,
                          message: "Please enter a valid email address",
                        },
                      }}
                      register={register}
                      errors={errors}
                      errorMessage={error}
                    />
                    <FormField
                      id="password"
                      placeholder="Password"
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
                      register={register}
                      errors={errors}
                      errorMessage={error}
                    />
                    <span className="mt-4 block text-sm text-muted-foreground sm:text-xs">
                      {t("RegisterModal.description1")}{" "}
                      <Link to="/" className="text-foreground hover:underline">
                        {t("RegisterModal.description2")}
                      </Link>
                      {" & "}
                      <Link to="/" className="text-foreground hover:underline">
                        {t("RegisterModal.description3")}
                      </Link>
                    </span>
                    <Button
                      variant="primary"
                      className="mt-4 w-full rounded-md px-5 py-3 text-sm sm:py-2.5"
                    >
                      {t("RegisterModal.btn3")}{" "}
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
