import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { Banner, Sidebar } from "~/components/shared";
import { RootState } from "~/redux/store";

const AdminLayout = () => {
  const { currentAdmin } = useSelector((state: RootState) => state.admin);

  return currentAdmin ? (
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
