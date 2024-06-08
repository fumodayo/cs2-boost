import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const isClient = currentUser?.role?.includes("client") || undefined;

  return isClient ? <Outlet /> : <Navigate to="/" />;
}
