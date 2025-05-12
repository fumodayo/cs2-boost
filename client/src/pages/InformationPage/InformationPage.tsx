import { IntroductionWidget, SocialMediaWidget } from "./components";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";

const InformationPage = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="h-full">
        <SocialMediaWidget currentUser={currentUser} />
      </div>
      <div className="h-full">
        <IntroductionWidget currentUser={currentUser} />
      </div>
    </div>
  );
};

export default InformationPage;
