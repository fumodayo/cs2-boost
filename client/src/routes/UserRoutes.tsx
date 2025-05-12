import { Navigate, Route } from "react-router-dom";
import PATH from "~/constants/path";
import { AuthLayout, PartnerLayout } from "~/layouts";
import {
  BoostPage,
  CheckoutPage,
  FollowPartnersPage,
  GeneralPage,
  IncomePage,
  InformationPage,
  NotificationsPage,
  OrdersPage,
  PendingBoostsPage,
  ProgressBoostsPage,
  SettingsPage,
  SupportsPage,
  WalletPage,
} from "~/pages";

const UserRoutes = () => {
  return (
    <>
      <Route path={PATH.USER.CHECKOUT} element={<CheckoutPage />} />
      <Route element={<AuthLayout />}>
        <Route path={PATH.USER.SUPPORTS} element={<SupportsPage />} />
        <Route path={PATH.USER.ORDERS} element={<OrdersPage />} />
        <Route path={PATH.USER.BOOSTS_ID} element={<BoostPage />} />
        <Route path={PATH.USER.WALLET} element={<WalletPage />} />
        <Route
          path={PATH.USER.FOLLOW_PARTNERS}
          element={<FollowPartnersPage />}
        />

        <Route path={PATH.USER.SETTINGS} element={<SettingsPage />}>
          <Route index element={<GeneralPage />} />
          <Route path={PATH.USER.INFORMATION} element={<InformationPage />} />
          <Route
            path={PATH.USER.NOTIFICATIONS}
            element={<NotificationsPage />}
          />
          <Route path={PATH.NOTFOUND} element={<Navigate to="/*" replace />} />
        </Route>
        <Route element={<PartnerLayout />}>
          <Route
            path={PATH.USER.PROGRESS_BOOSTS}
            element={<ProgressBoostsPage />}
          />
          <Route
            path={PATH.USER.PENDING_BOOSTS}
            element={<PendingBoostsPage />}
          />
          <Route path={PATH.USER.INCOME} element={<IncomePage />} />
        </Route>
      </Route>
    </>
  );
};

export default UserRoutes;
