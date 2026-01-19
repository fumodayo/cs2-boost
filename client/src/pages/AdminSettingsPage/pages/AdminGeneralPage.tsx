import { ProfileInfoCard } from "../components";

const AdminGeneralPage = () => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Profile Info Card */}
      <div className="lg:col-span-1">
        <ProfileInfoCard />
      </div>
    </div>
  );
};

export default AdminGeneralPage;