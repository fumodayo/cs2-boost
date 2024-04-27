import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";

export default function BoosterRoute() {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const isBooster = currentUser?.role?.includes("booster") || undefined;

  return isBooster ? <Outlet /> : <Navigate to="/" />;
}
