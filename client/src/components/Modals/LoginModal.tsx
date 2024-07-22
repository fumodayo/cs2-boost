import clsx from "clsx";
import { useCallback, useContext, useEffect, useState } from "react";
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
import { Button } from "../Buttons/Button";

const accounts = {
  user: {
    email: "user.test@gmail.com",
    password: "0123@Abc",
  },
  booster: {
    email: "booster.test@gmail.com",
    password: "0123@Abc",
  },
  admin: {
    email: "admin.test@gmail.com",
    password: "0123@Abc",
  },
};

type AccountKeys = keyof typeof accounts;

const LoginModal = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.user);
  const [selectedAccount, setSelectedAccount] = useState(accounts.user);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKey = event.target.value as AccountKeys;
    setSelectedAccount(accounts[selectedKey]);
    dispatch(authFailure(""));
  };

  const { t } = useTranslation();

  const { isOpenLoginModal, onCloseLoginModal, onOpenSignUpModal } =
    useContext(AppContext);

  useGetIP();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const { email, password } = selectedAccount;
    setValue("email", email);
    setValue("password", password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccount]);

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
      <div className="flex flex-col pb-2">
        <h3 className="text-lg font-bold">Demo</h3>
        <select
          defaultValue="user"
          onChange={handleSelectChange}
          className="h-8 w-[100px] justify-between rounded-md border-0 bg-field px-2 text-sm text-field-foreground shadow-sm outline-none ring-1 ring-field-ring"
        >
          {Object.keys(accounts).map((account) => (
            <option className="capitalize" key={account} value={account}>
              {account}
            </option>
          ))}
        </select>
      </div>
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
      <Button
        disabled={loading}
        type="submit"
        className={clsx(
          "mt-4 w-full rounded-md px-5 py-3 text-sm font-medium shadow-sm",
          "sm:py-2.5",
        )}
      >
        {loading ? "Loading..." : t("Continue")}
        <FaArrowRight className="ml-2" />
      </Button>
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
