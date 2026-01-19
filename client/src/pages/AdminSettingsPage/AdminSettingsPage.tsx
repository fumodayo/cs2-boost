import { Heading, Helmet } from "~/components/ui";
import { FaCog } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import { Navigation } from "./components";

const AdminSettingsPage: React.FC = () => {
  return (
    <>
      <Helmet title="admin_settings_page" />
      <div className="space-y-8 p-4 md:p-8">
        <Heading
          icon={FaCog}
          title="admin_settings_page_title"
          subtitle="admin_settings_page_subtitle"
        />

        <main className="mt-8">
          <Navigation />
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminSettingsPage;