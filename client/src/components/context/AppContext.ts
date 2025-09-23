import { createContext } from "react";
import { ITheme, ICurrency } from "~/types";

export interface IAppContextTypeProps {
  theme: ITheme;
  currency: ICurrency;
  isOpenLoginModal: boolean;
  isOpenRegisterModal: boolean;
  isOpenInputOTPModal: boolean;
  isOpenResetPasswordModal: boolean;
  isOpenForgotModal: boolean;
  isOpenConfetti: boolean;
  isOpenCongratsDialog: boolean;
  setTheme: React.Dispatch<React.SetStateAction<ITheme>>;
  setCurrency: React.Dispatch<React.SetStateAction<ICurrency>>;
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
