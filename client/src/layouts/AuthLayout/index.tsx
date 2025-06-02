// import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import {
  Banner,
  Confetti,
  Footer,
  Header,
  SubHeader,
} from "~/components/shared";
import { RootState } from "~/redux/store";

const AuthLayout = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  // const [isLocked, setIsLocked] = useState(false);

  const isUser = currentUser?.role?.includes("client");

  return isUser ? (
    <div>
      <Confetti />
      <Header />
      <SubHeader />
      <div className="min-h-screen">
        {/* BANNER */}
        <Banner image="honkai-star-rail" />
        <div className="px-2 sm:px-6 lg:px-8">
          <div className="mx-auto py-36 2xl:max-w-[1550px]">
            <div className="col-span-1 px-2 lg:col-span-1">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default AuthLayout;
