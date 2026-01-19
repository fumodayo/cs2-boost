import { useContext, useEffect } from "react";
import {
  DeleteAccountWidget,
  LoginSessionsWidget,
  UserWidget,
  VerificationWidget,
} from "./components";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { IUser } from "~/types";
import { AppContext } from "~/components/context/AppContext";

const GeneralPage = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { toggleConfetti, toggleCongratsDialog } = useContext(AppContext);

  useEffect(() => {
    const shouldCelebrate = localStorage.getItem("showPartnerCelebration");
    if (shouldCelebrate === "true") {
      localStorage.removeItem("showPartnerCelebration");
      setTimeout(() => {
        toggleConfetti();
        toggleCongratsDialog();
      }, 500);
    }
  }, [toggleConfetti, toggleCongratsDialog]);

  return (
    <div className="mx-auto grid grid-cols-1 grid-rows-1 items-start gap-x-5 gap-y-5 lg:mx-0 lg:grid-cols-3">
      {!currentUser?.is_verified && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-start-3 lg:row-end-1 lg:grid-cols-1">
          {/* VERIFICATION WIDGET */}
          <VerificationWidget />
        </div>
      )}
      {/* LIST WIDGET */}
      <div className="space-y-4 lg:col-span-2 lg:row-span-2 lg:row-end-2 lg:space-y-6">
        {/* USER INFORMATION */}
        <UserWidget />

        {/* DELETE ACCOUNT */}
        <DeleteAccountWidget />

        {/* LOGIN SESSIONS */}
        <LoginSessionsWidget currentUser={currentUser as IUser} />
      </div>
    </div>
  );
};

export default GeneralPage;