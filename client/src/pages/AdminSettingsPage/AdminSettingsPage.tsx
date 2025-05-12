import { Helmet } from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { FaCog } from "react-icons/fa";

const AdminSettingsPage = () => {
  return (
    <>
      <Helmet title="Settings · CS2Boost" />
      <div>
        <Heading
          icon={FaCog}
          title="My Settings"
          subtitle="View and update your account settings."
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

export default AdminSettingsPage;
