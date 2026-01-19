import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  BotChatWidget,
  CongratsDialog,
  ForgotPasswordModal,
  LoginModal,
  RegisterModal,
  ResetPasswordModal,
} from "./components/ui";
import { AdminRoutes, ComingRoutes, DefaultRoutes, UserRoutes } from "./routes";
import { ScrollToTopRouter } from "./components/ui/Misc";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import { InputOtpModal } from "./components/ui/Modal";
import { LoadingPage } from "./pages";
import { SpeedInsights } from "@vercel/speed-insights/react";

const App = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
      }}
    >
      <Suspense fallback={<LoadingPage />}>
        <ScrollToTopRouter />
        <Toaster />
        <LoginModal />
        <RegisterModal />
        <ForgotPasswordModal />
        <InputOtpModal />
        <ResetPasswordModal />
        <CongratsDialog />
        <BotChatWidget />
        <Routes>
          <Route>{DefaultRoutes()}</Route>
          <Route>{UserRoutes()}</Route>
          <Route>{AdminRoutes()}</Route>
          <Route>{ComingRoutes()}</Route>
        </Routes>
        <SpeedInsights />
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
