import { Navigate, Route } from "react-router-dom";
import PATH from "~/constants/path";
import { AdminLayout } from "~/layouts";
import {
  AdminLoginPage,
  AdminSettingsPage,
  DashboardPage,
  ManageBoostPage,
  ManageOrdersPage,
  ManageReportsPage,
  ManageUsersPage,
} from "~/pages";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";

const AdminRoutes = () => {
  const { currentAdmin } = useSelector((state: RootState) => state.admin);
  console.log({ currentAdmin });

  return (
    <>
      <Route path={PATH.ADMIN.LOGIN} element={<AdminLoginPage />} />
      <Route
        path={PATH.ADMIN.DEFAULT}
        element={
          currentAdmin ? (
            <AdminLayout />
          ) : (
            <Navigate to={PATH.ADMIN.LOGIN} replace />
          )
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="manage-users" element={<ManageUsersPage />} />
        <Route path="manage-orders" element={<ManageOrdersPage />} />
        <Route path="manage-boost" element={<ManageBoostPage />} />
        <Route path="manage-reports" element={<ManageReportsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="*" element={<Navigate to="/*" replace />} />
      </Route>
    </>
  );
};

export default AdminRoutes;
