import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import LoginModal from "./components/Modals/LoginModal";
import SignUpModal from "./components/Modals/SignUpModal";
import Game from "./pages/Game";
import Premie from "./pages/Premie";
import Wingman from "./pages/Wingman";
import FarmExp from "./pages/FarmExp";
import Checkout from "./pages/Checkout";
import Boosts from "./pages/user/Boosts";
import BoostId from "./pages/user/BoostId";

function App() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<div>Loading...</div>}>
        <LoginModal />
        <SignUpModal />
        <Routes>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="counter-strike-2/*">
            <Route index element={<Game />} />
            <Route path="premie" element={<Premie />} />
            <Route path="wingman" element={<Wingman />} />
            <Route path="level-farming" element={<FarmExp />} />
          </Route>
          <Route path="dashboard">
            <Route index element={<Boosts />} />
            <Route path="boosts" element={<Boosts />} />
            <Route path="boosts/:id" element={<BoostId />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
