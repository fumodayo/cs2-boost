import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  CongratsDialog,
  ForgotPasswordModal,
  LoginModal,
  RegisterModal,
  ResetPasswordModal,
} from "./components/shared";
import { AdminRoutes, ComingRoutes, DefaultRoutes, UserRoutes } from "./routes";
import ScrollToTopRouter from "./components/shared/ScrollToTopRouter";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import InputOtpModal from "./components/shared/InputOtpModal";
import { LoadingPage } from "./pages";

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <ScrollToTopRouter />
        <Toaster />
        <LoginModal />
        <RegisterModal />
        <ForgotPasswordModal />
        <InputOtpModal />
        <ResetPasswordModal />
        <CongratsDialog />
        <Routes>
          <Route>{DefaultRoutes()}</Route>
          <Route>{UserRoutes()}</Route>
          <Route>{AdminRoutes()}</Route>
          <Route>{ComingRoutes()}</Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
