import { createContext, useEffect, useState } from "react";
import { ICurrencyProps, IThemeProps } from "~/types";

interface IContextProviderProps {
  children: React.ReactNode;
}

interface IAppContextTypeProps {
  theme: IThemeProps;
  currency: ICurrencyProps;
  isOpenLoginModal: boolean;
  isOpenRegisterModal: boolean;
  isOpenInputOTPModal: boolean;
  isOpenResetPasswordModal: boolean;
  isOpenForgotModal: boolean;
  isOpenConfetti: boolean;
  isOpenCongratsDialog: boolean;
  setTheme: React.Dispatch<React.SetStateAction<IThemeProps>>;
  setCurrency: React.Dispatch<React.SetStateAction<ICurrencyProps>>;
  toggleLoginModal: () => void;
  toggleRegisterModal: () => void;
  toggleInputOTPModal: () => void;
  toggleResetPasswordModal: () => void;
  toggleForgotModal: () => void;
  toggleConfetti: () => void;
  toggleCongratsDialog: () => void;
}

export const AppContext = createContext<IAppContextTypeProps>(
  {} as IAppContextTypeProps,
);

export default function AppContextProvider({
  children,
}: IContextProviderProps) {
  const storedTheme = localStorage.getItem("theme");
  const storedCurrency = localStorage.getItem("currency");
  const [theme, setTheme] = useState((storedTheme as IThemeProps) || "dark");
  const [currency, setCurrency] = useState(
    (storedCurrency as ICurrencyProps) || "vnd",
  );

  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [isOpenRegisterModal, setIsOpenRegisterModal] = useState(false);
  const [isOpenForgotModal, setIsOpenForgotModal] = useState(false);
  const [isOpenConfetti, setIsOpenConfetti] = useState(false);
  const [isOpenInputOTPModal, setIsOpenInputOTPModal] = useState(false);
  const [isOpenResetPasswordModal, setIsOpenResetPasswordModal] =
    useState(false);
  const [isOpenCongratsDialog, setShowCongratsDialog] = useState(false);

  const toggleConfetti = () => setIsOpenConfetti((prev) => !prev);

  const toggleLoginModal = () => setIsOpenLoginModal((prev) => !prev);
  const toggleRegisterModal = () => setIsOpenRegisterModal((prev) => !prev);
  const toggleForgotModal = () => setIsOpenForgotModal((prev) => !prev);
  const toggleInputOTPModal = () => setIsOpenInputOTPModal((prev) => !prev);
  const toggleResetPasswordModal = () =>
    setIsOpenResetPasswordModal((prev) => !prev);
  const toggleCongratsDialog = () => setShowCongratsDialog((prev) => !prev);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  const contextValue: IAppContextTypeProps = {
    theme,
    currency,
    isOpenLoginModal,
    isOpenRegisterModal,
    isOpenForgotModal,
    isOpenConfetti,
    isOpenInputOTPModal,
    isOpenResetPasswordModal,
    isOpenCongratsDialog,
    setTheme,
    setCurrency,
    toggleLoginModal,
    toggleRegisterModal,
    toggleForgotModal,
    toggleInputOTPModal,
    toggleResetPasswordModal,
    toggleConfetti,
    toggleCongratsDialog,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
