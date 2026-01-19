import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { AdminMobileHeader, Banner, Sidebar } from "~/components/ui";
import { AdminFooter } from "~/components/ui/Layout";
import { RootState } from "~/redux/store";
import { ROLE } from "~/types/constants";

const AdminLayout = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const isAdmin = currentUser?.role?.includes(ROLE.ADMIN);

  return isAdmin ? (
    <div>
      <AdminMobileHeader />
      <Sidebar />
      <div className="min-h-screen">
        {/* Banner */}
        <Banner image="genshin-impact" />
        <main className="mx-auto p-4 pt-20 sm:p-6 sm:pt-20 md:p-8 md:pt-8 xl:ml-64 xl:pt-8">
          <Outlet />
        </main>
      </div>
      <AdminFooter />
    </div>
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

export default AdminLayout;