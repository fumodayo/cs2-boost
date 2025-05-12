import { Helmet } from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { FaCog } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import { Navigation } from "./components";

const SettingsPage = () => {
  return (
    <>
      <Helmet title="General" />
      <div>
        <Heading
          icon={FaCog}
          title="My Settings"
          subtitle="View and update your account settings."
        />
        <main className="mt-8">
          <Navigation />
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default SettingsPage;
