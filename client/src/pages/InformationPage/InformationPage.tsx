import { IntroductionWidget, SocialMediaWidget } from "./components";
import { useSelector } from "react-redux";
import { SkeletonLoader } from "~/components/ui";
import { RootState } from "~/redux/store";

const InformationPage = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  if (!currentUser) {
    return <SkeletonLoader />;
  }

  return (
    <div className="grid gap-6 p-6 xl:grid-cols-2">
      <div className="h-fit w-full">
        <SocialMediaWidget currentUser={currentUser} />
      </div>
      <div className="h-fit w-full">
        <IntroductionWidget currentUser={currentUser} />
      </div>
    </div>
  );
};

export default InformationPage;