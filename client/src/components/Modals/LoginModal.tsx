import clsx from "clsx";
import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { FaArrowRight } from "react-icons/fa";

import { AppContext } from "../../context/AppContext";
import {
  authStart,
  authSuccess,
  authFailure,
} from "../../redux/user/userSlice";
import { RootState } from "../../redux/store";
import Modal from "./Modal";
import Input from "../Input";
import { useGetIP } from "../../hooks/useGetIP";
import { axiosInstance } from "../../axiosAuth";

const LoginModal = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.user);

  const { t } = useTranslation();

  const { isOpenLoginModal, onCloseLoginModal, onOpenSignUpModal } =
    useContext(AppContext);

  useGetIP();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const toggle = useCallback(() => {
    reset();
    dispatch(authFailure(""));
    onCloseLoginModal();
    onOpenSignUpModal();
  }, [onCloseLoginModal, onOpenSignUpModal]);

  const onSubmit: SubmitHandler<FieldValues> = async (form) => {
    try {
      dispatch(authStart());
      const ip = localStorage.getItem("ip_address");
      const country = localStorage.getItem("country_name");
      
      const { data } = await axiosInstance.post(`/auth/signin`, {
        ...form,
        ip: ip,
        country: country,
      });

      if (data.success === false) {
        dispatch(authFailure("Wrong password or email"));
        return;
      }

      dispatch(authSuccess(data.user));

      onCloseLoginModal();
    } catch (error) {
      dispatch(authFailure("Wrong password or email"));
    }
  };

  const bodyContent = (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Input
          id="email"
          placeholder="Email Address"
          required
          rules={{ pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/ }}
          register={register}
          errors={errors}
          failure={error}
          autoFocused
        />
        <Input
          id="password"
          placeholder="Password"
          type="password"
          required
          register={register}
          errors={errors}
          failure={error}
        />
      </div>
      <button
        disabled={loading}
        type="submit"
        className={clsx(
          "relative mt-4 inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors",
          "hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
          "sm:py-2.5",
        )}
      >
        {loading ? "Loading..." : t("Continue")}
        <FaArrowRight className="ml-2" />
      </button>
    </form>
  );

  return (
    <Modal
      title="Login"
      subtitle={
        <p className="text-sm text-muted-foreground">
          {t("Don't have an account")}?
          <button onClick={toggle} className="text-foreground hover:underline">
            {t("Create one here")}.
          </button>
        </p>
      }
      text="Login"
      isOpen={isOpenLoginModal}
      onClose={onCloseLoginModal}
      content={bodyContent}
    />
  );
};

export default LoginModal;
