import { useEffect, useState } from "react";
import { ITheme, ICurrency } from "~/types";
import { AppContext, IAppContextTypeProps } from "./AppContext";

interface IContextProviderProps {
  children: React.ReactNode;
}

export default function AppContextProvider({
  children,
}: IContextProviderProps) {
  const storedTheme = localStorage.getItem("theme");
  const storedCurrency = localStorage.getItem("currency");
  const [theme, setTheme] = useState((storedTheme as ITheme) || "dark");
  const [currency, setCurrency] = useState(
    (storedCurrency as ICurrency) || "vnd",
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

  const toggleLoginModal = (isOpen?: boolean) =>
    setIsOpenLoginModal((prev) => (isOpen !== undefined ? isOpen : !prev));
  const toggleRegisterModal = (isOpen?: boolean) =>
    setIsOpenRegisterModal((prev) => (isOpen !== undefined ? isOpen : !prev));
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