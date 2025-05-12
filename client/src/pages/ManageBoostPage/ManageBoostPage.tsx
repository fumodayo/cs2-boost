import { Helmet } from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { HiMiniRocketLaunch } from "react-icons/hi2";

const ManageBoostPage = () => {
  return (
    <>
      <Helmet title="Manage Boost · CS2Boost" />
      <div>
        <Heading
          icon={HiMiniRocketLaunch}
          title="Manage Boost"
          subtitle="Manage Boost."
        />
        <main>
          <div className="mt-8">
            <div className="space-y-4"></div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ManageBoostPage;
