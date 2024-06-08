import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";

export default function AdminRoute() {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const isAdmin = currentUser?.role?.includes("admin") || undefined;

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
}
