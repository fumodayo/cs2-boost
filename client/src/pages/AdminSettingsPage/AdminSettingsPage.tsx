import React from "react";
import { Helmet } from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { FaUserCog } from "react-icons/fa";
import { ProfileInfoCard, ChangePasswordCard } from "./components";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";

const AdminSettingsPage: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  if (!currentUser) {
    return <div>Loading admin data...</div>;
  }

  return (
    <>
      <Helmet title="My Settings · Admin Panel" />
      <div className="space-y-8 p-4 md:p-8">
        <Heading
          icon={FaUserCog}
          title="My Account Settings"
          subtitle="Manage your personal information and security settings."
        />

        <main className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <div className="lg:col-span-1">
            <ProfileInfoCard />
          </div>

          <div className="lg:col-span-1">
            <ChangePasswordCard />
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminSettingsPage;
