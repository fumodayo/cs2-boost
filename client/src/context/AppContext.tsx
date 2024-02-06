import React, { createContext, useEffect, useState } from "react";

type ContextProviderProps = {
  children: React.ReactNode;
};

type Theme = "dark" | "light";
type Currency = "vnd" | "usd";
type Modal = false | true;

type AppContextType = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  currency: Currency;
  setCurrency: React.Dispatch<React.SetStateAction<Currency>>;
  isOpenLoginModal: Modal;
  onOpenLoginModal: () => void;
  onCloseLoginModal: () => void;
  isOpenSignUpModal: Modal;
  onOpenSignUpModal: () => void;
  onCloseSignUpModal: () => void;
};

export const AppContext = createContext<AppContextType>({} as AppContextType);

export default function AppContextProvider({ children }: ContextProviderProps) {
  const storedTheme = localStorage.getItem("theme");
  const storedCurrency = localStorage.getItem("currency");
  const [theme, setTheme] = useState<Theme>(
    storedTheme === "dark" || storedTheme === "light"
      ? (storedTheme as Theme)
      : "light",
  );

  const [currency, setCurrency] = useState<Currency>(
    storedCurrency === "vnd" || storedCurrency === "usd"
      ? (storedCurrency as Currency)
      : "usd",
  );

  const [isOpenLoginModal, setIsOpenLoginModal] = useState<Modal>(false);

  const onOpenLoginModal = () => {
    setIsOpenLoginModal(true);
  };

  const onCloseLoginModal = () => {
    setIsOpenLoginModal(false);
  };

  const [isOpenSignUpModal, setIsOpenSignUpModal] = useState<Modal>(false);

  const onOpenSignUpModal = () => {
    setIsOpenSignUpModal(true);
  };

  const onCloseSignUpModal = () => {
    setIsOpenSignUpModal(false);
  };

  useEffect(() => {
    currency && localStorage.setItem("currency", currency);
  }, [currency]);

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "dark");
    }
  }, [theme]);

  const contextValue: AppContextType = {
    theme,
    setTheme,
    currency,
    setCurrency,
    isOpenLoginModal,
    onOpenLoginModal,
    onCloseLoginModal,
    isOpenSignUpModal,
    onOpenSignUpModal,
    onCloseSignUpModal,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
