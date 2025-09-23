import { Navigate, Route } from "react-router-dom";
import PATH from "~/constants/path";
import { AuthLayout, PartnerLayout } from "~/layouts";
import {
  BannedPage,
  BillReturnPage,
  BoostPage,
  CheckoutPage,
  FollowPartnersPage,
  GeneralPage,
  IncomePage,
  InformationPage,
  NotificationPage,
  OrdersPage,
  PendingBoostsPage,
  ProgressBoostsPage,
  PushSettingsPage,
  SettingsPage,
  SupportsPage,
  WalletPage,
} from "~/pages";

const UserRoutes = () => {
  return (
    <>
      <Route path={PATH.USER.BANNED} element={<BannedPage />} />
      <Route path={PATH.USER.CHECKOUT} element={<CheckoutPage />} />
      <Route path={PATH.USER.BILL_RETURN} element={<BillReturnPage />} />

      {/* <Route
        path={PATH.USER.BOOSTS_ID}
        element={
          <AdminViewOnlyRoutes>
              <BoostPage />
          </AdminViewOnlyRoutes>
        }
      /> */}
      <Route element={<AuthLayout />}>
        <Route path={PATH.USER.SUPPORTS} element={<SupportsPage />} />
        <Route path={PATH.USER.ORDERS} element={<OrdersPage />} />
        <Route path={PATH.USER.BOOSTS_ID} element={<BoostPage />} />
        <Route path={PATH.USER.WALLET} element={<WalletPage />} />
        <Route
          path={PATH.USER.FOLLOW_PARTNERS}
          element={<FollowPartnersPage />}
        />
        <Route path={PATH.USER.NOTIFICATION} element={<NotificationPage />} />

        <Route path={PATH.USER.SETTINGS} element={<SettingsPage />}>
          <Route index element={<GeneralPage />} />
          <Route path={PATH.USER.INFORMATION} element={<InformationPage />} />
          <Route
            path={PATH.USER.PUSH_NOTIFICATION}
            element={<PushSettingsPage />}
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
