import { Navigate, Route } from "react-router-dom";
import PATH from "~/constants/path";
import { AdminLayout } from "~/layouts";
import {
  AdminLoginPage,
  AdminSettingsPage,
  AdminGeneralPage,
  AdminSecurityPage,
  AdminCommissionPage,
  DashboardPage,
  ManageBoostPage,
  ManageOrdersPage,
  ManageReportsPage,
  ManageRevenue,
  ManageUsersPage,
  OrderDetailPage,
  UserDetailPage,
  EmailTemplatesPage,
  NotificationsManagePage,
  ManagePartnerRequestsPage,
  ManagePromoCodesPage,
  LiveChatsPage,
  NotificationPage,
} from "~/pages";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { ROLE } from "~/types/constants";

const AdminRoutes = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const isAdmin = currentUser?.role?.includes(ROLE.ADMIN);

  return (
    <>
      <Route path={PATH.ADMIN.LOGIN} element={<AdminLoginPage />} />
      <Route
        path={PATH.ADMIN.DEFAULT}
        element={
          isAdmin ? <AdminLayout /> : <Navigate to={PATH.ADMIN.LOGIN} replace />
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="manage-users" element={<ManageUsersPage />} />
        <Route path="manage-users/:userId" element={<UserDetailPage />} />
        <Route path="manage-orders" element={<ManageOrdersPage />} />
        <Route path="manage-orders/:id" element={<OrderDetailPage />} />
        <Route path="manage-boost/*" element={<ManageBoostPage />} />
        <Route path="manage-reports" element={<ManageReportsPage />} />
        <Route path="manage-revenue" element={<ManageRevenue />} />
        <Route path="live-chats" element={<LiveChatsPage />} />
        <Route
          path="partner-requests"
          element={<ManagePartnerRequestsPage />}
        />
        <Route path="promo-codes" element={<ManagePromoCodesPage />} />
        <Route path="commission" element={<AdminCommissionPage />} />
        <Route path="settings" element={<AdminSettingsPage />}>
          <Route index element={<AdminGeneralPage />} />
          <Route path="security" element={<AdminSecurityPage />} />
        </Route>
        <Route path="notifications" element={<NotificationsManagePage />} />
        <Route path="all-notifications" element={<NotificationPage />} />
        <Route path="email-templates" element={<EmailTemplatesPage />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </>
  );
};

export default AdminRoutes;