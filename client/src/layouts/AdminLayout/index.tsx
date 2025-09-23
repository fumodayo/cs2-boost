import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { Banner, Sidebar } from "~/components/shared";
import { RootState } from "~/redux/store";
import { ROLE } from "~/types/constants";

const AdminLayout = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const isAdmin = currentUser?.role?.includes(ROLE.ADMIN);

  return isAdmin ? (
    <div>
      <Sidebar />
      {/* Banner */}
      <Banner image="genshin-impact" />
      <main className="mx-auto h-screen p-4 sm:p-6 md:p-8 xl:ml-64">
        <Outlet />
      </main>
    </div>
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

export default AdminLayout;
