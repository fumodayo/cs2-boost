import { useCallback, useContext } from "react";
import Modal from "./Modal";
import { AppContext } from "../../context/AppContext";
import clsx from "clsx";
import { FaArrowRight } from "react-icons/fa";
import Input from "../Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const LoginModal = () => {
  const { t } = useTranslation();

  const { isOpenLoginModal, onCloseLoginModal, onOpenSignUpModal } =
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
    onCloseLoginModal();
    onOpenSignUpModal();
  }, [onCloseLoginModal, onOpenSignUpModal]);

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
          register={register}
          errors={errors}
        />
      </div>
      <button
        type="submit"
        className={clsx(
          "relative mt-4 inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
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
