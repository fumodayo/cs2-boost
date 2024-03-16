import clsx from "clsx";
import { useCallback, useContext } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FaArrowRight } from "react-icons/fa";

import { AppContext } from "../../context/AppContext";
import Modal from "./Modal";
import Input from "../Input";

const SignUpModal = () => {
  const { t } = useTranslation();

  const { isOpenSignUpModal, onCloseSignUpModal, onOpenLoginModal } =
    useContext(AppContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const toggle = useCallback(() => {
    onCloseSignUpModal();
    onOpenLoginModal();
  }, [onCloseSignUpModal, onOpenLoginModal]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
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

      <button
        type="submit"
        className={clsx(
          "relative mt-4 inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors",
          "hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
          "sm:py-2.5",
        )}
      >
        {t("Continue")}
        <FaArrowRight className="ml-2" />
      </button>
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
