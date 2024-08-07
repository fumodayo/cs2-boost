import React, { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import PrivateRoute from "./layouts/PrivateRoute";
import LoginModal from "./components/Modals/LoginModal";
import SignUpModal from "./components/Modals/SignUpModal";
import Game from "./pages/Game";
import Premie from "./pages/Premie";
import Wingman from "./pages/Wingman";
import FarmExp from "./pages/FarmExp";
import Checkout from "./pages/Checkout";
import Boosts from "./pages/user/Boosts";
import BoostId from "./pages/user/BoostId";
import ProgressBoosts from "./pages/user/ProgressBoosts";
import Settings from "./pages/user/Settings";
import NotFound from "./pages/NotFound";
import PendingBoosts from "./pages/user/PendingBoosts";
import Wallet from "./pages/user/Wallet";
import Income from "./pages/user/Income";
import BoosterRoute from "./layouts/BoosterRoute";
import Profile from "./pages/Profile";
import Loading from "./pages/Loading";
import { AppContext } from "./context/AppContext";
import AdminRoute from "./layouts/AdminRoute";
import ManagePremie from "./pages/admin/ManagePremie";
import ManageWingman from "./pages/admin/ManageWingman";

function App() {
  const { theme } = useContext(AppContext);

  return (
    <BrowserRouter>
      <React.Suspense fallback={<Loading />}>
        <ToastContainer theme={theme} />
        <LoginModal />
        <SignUpModal />
        <Routes>
          <Route index element={<Home />} />
          <Route path="counter-strike-2/*">
            <Route index element={<Game />} />
            <Route path="premier" element={<Premie />} />
            <Route path="wingman" element={<Wingman />} />
            <Route path="level-farming" element={<FarmExp />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="admin/*">
              <Route index element={<Navigate to="/admin/premier" replace />} />
              <Route path="premier" element={<ManagePremie />} />
              <Route path="wingman" element={<ManageWingman />} />
            </Route>
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="profile/:id" element={<Profile />} />
            <Route path="/dashboard">
              <Route
                index
                element={<Navigate to="/dashboard/boosts" replace />}
              />
              <Route path="boosts" element={<Boosts />} />
              <Route path="boosts/:id" element={<BoostId />} />
              <Route element={<BoosterRoute />}>
                <Route path="progress-boosts" element={<ProgressBoosts />} />
                <Route path="pending-boosts" element={<PendingBoosts />} />
                <Route path="income" element={<Income />} />
              </Route>
              <Route path="wallet" element={<Wallet />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="checkout/:id" element={<Checkout />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
