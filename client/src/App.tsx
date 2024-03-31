import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import Accounts from "./pages/user/Accounts";
import Settings from "./pages/user/Settings";
import NotFound from "./pages/NotFound";
import PendingBoosts from "./pages/user/PendingBoosts";

function App() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<div>Loading...</div>}>
        <LoginModal />
        <SignUpModal />
        <Routes>
          <Route index element={<Home />} />
          <Route path="checkout/:id" element={<Checkout />} />
          <Route path="counter-strike-2/*">
            <Route index element={<Game />} />
            <Route path="premier" element={<Premie />} />
            <Route path="wingman" element={<Wingman />} />
            <Route path="level-farming" element={<FarmExp />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="dashboard">
              <Route index element={<Boosts />} />
              <Route path="boosts" element={<Boosts />} />
              <Route path="boosts/:id" element={<BoostId />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="settings" element={<Settings />} />
              <Route path="pending-boosts" element={<PendingBoosts />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
