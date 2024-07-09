import clsx from "clsx";
import { useCallback, useContext } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  authStart,
  authSuccess,
  authFailure,
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

import { FaArrowRight } from "react-icons/fa";

import { AppContext } from "../../context/AppContext";
import Modal from "./Modal";
import Input from "../Input";
import { useGetIP } from "../../hooks/useGetIP";
import { axiosInstance } from "../../axiosAuth";
import { Button } from "../Buttons/Button";

const SignUpModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.user);

  const { isOpenSignUpModal, onCloseSignUpModal, onOpenLoginModal } =
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
    onCloseSignUpModal();
    onOpenLoginModal();
  }, [onCloseSignUpModal, onOpenLoginModal]);

  const onSubmit: SubmitHandler<FieldValues> = async (form) => {
    try {
      dispatch(authStart());
      const ip = localStorage.getItem("ip_address");
      const country = localStorage.getItem("country_name");

      const { data } = await axiosInstance.post(`/auth/signup`, {
        ...form,
        ip: ip,
        country: country,
      });

      if (data.success === false) {
        dispatch(authFailure("This email is already taken"));
        return;
      }

      dispatch(authSuccess(data.user));

      onCloseSignUpModal();
    } catch (error) {
      dispatch(authFailure("This email is already taken"));
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
          rules={{
            pattern:
              /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          }}
          register={register}
          errors={errors}
          failure={error}
        />
      </div>
      <span
        className={clsx("mt-4 block text-sm text-muted-foreground sm:text-xs")}
      >
        {t("By creating an account, you agree to our")}
        <a
          className={clsx(
            "ml-1 cursor-pointer text-foreground hover:underline",
          )}
        >
          {t("Terms of Service")}
        </a>
        <span className="mx-1">&</span>
        <a className={clsx("cursor-pointer text-foreground hover:underline")}>
          {t("Privacy Policy")}
        </a>
      </span>

      <Button
        disabled={loading}
        type="submit"
        className={clsx(
          "mt-4 w-full rounded-md px-5 py-3 text-sm font-medium shadow-sm",
          "sm:py-2.5",
        )}
      >
        {loading ? "...Loading" : t("Continue")}
        <FaArrowRight className="ml-2" />
      </Button>
    </form>
  );

  return (
    <Modal
      title="Create Account"
      subtitle={
        <p className="text-sm text-muted-foreground">
          {t("Already a member")}?
          <button onClick={toggle} className="text-foreground hover:underline">
            {t("Login here")}.
          </button>
        </p>
      }
      text="Sign Up"
      isOpen={isOpenSignUpModal}
      onClose={onCloseSignUpModal}
      content={bodyContent}
    />
  );
};

export default SignUpModal;
