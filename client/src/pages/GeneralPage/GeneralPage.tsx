import {
  LoginSessionsWidget,
  UserWidget,
  VerificationWidget,
} from "./components";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { ICurrentUserProps } from "~/types";

const GeneralPage = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

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
        <UserWidget currentUser={currentUser as ICurrentUserProps} />

        {/* LOGIN SESSIONS */}
        <LoginSessionsWidget currentUser={currentUser as ICurrentUserProps} />
      </div>
    </div>
  );
};

export default GeneralPage;
