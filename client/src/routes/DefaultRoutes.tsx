import { Navigate, Route } from "react-router-dom";
import PATH from "~/constants/path";
import { DefaultLayout } from "~/layouts";
import {
  GameModePage,
  HomePage,
  LevelFarmingPage,
  NotFoundPage,
  PartnerPage,
  PartnersPage,
  PremierPage,
  WingmanPage,
} from "~/pages";

const DefaultRoutes = () => {
  return (
    <>
      <Route index element={<HomePage />} />
      <Route path={PATH.DEFAULT.PARTNERS} element={<PartnersPage />} />
      <Route path={PATH.DEFAULT.PARTNER} element={<PartnerPage />} />
      <Route path={PATH.DEFAULT.GAME_MODE} element={<DefaultLayout />}>
        <Route index element={<GameModePage />} />
        <Route path={PATH.DEFAULT.PREMIER} element={<PremierPage />} />
        <Route path={PATH.DEFAULT.WINGMAN} element={<WingmanPage />} />
        <Route
          path={PATH.DEFAULT.LEVEL_FARMING}
          element={<LevelFarmingPage />}
        />
        <Route path={PATH.NOTFOUND} element={<Navigate to="/*" replace />} />
      </Route>
      <Route path={PATH.NOTFOUND} element={<NotFoundPage />} />
    </>
  );
};

export default DefaultRoutes;
