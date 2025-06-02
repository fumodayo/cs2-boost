import { IntroductionWidget, SocialMediaWidget } from "./components";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { ICurrentUserProps } from "~/types";

const InformationPage = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="h-full">
        <SocialMediaWidget currentUser={currentUser as ICurrentUserProps} />
      </div>
      <div className="h-full">
        <IntroductionWidget currentUser={currentUser as ICurrentUserProps} />
      </div>
    </div>
  );
};

export default InformationPage;
