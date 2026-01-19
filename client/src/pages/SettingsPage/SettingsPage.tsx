import { Heading, Helmet } from "~/components/ui";
import { FaCog } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import { Navigation } from "./components";

const SettingsPage = () => {
  return (
    <>
      <Helmet title="general_page" />
      <div>
        <Heading
          icon={FaCog}
          title="general_page_title"
          subtitle="general_page_subtitle"
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