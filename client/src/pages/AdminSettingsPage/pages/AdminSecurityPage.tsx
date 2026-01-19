import { ChangePasswordCard } from "../components";

const AdminSecurityPage = () => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="lg:col-span-1">
        <ChangePasswordCard />
      </div>
    </div>
  );
};

export default AdminSecurityPage;