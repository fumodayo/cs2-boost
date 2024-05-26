import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";
import { signOut } from "../redux/user/userSlice";
import { parseJwt } from "../utils/formatJwt";

export default function AdminRoute() {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const isAdmin = currentUser?.role?.includes("admin") || undefined;

  const dispatch = useDispatch();
  const token = localStorage.getItem("access_token");

  if (token) {
    const decodeJwt = parseJwt(token);

    if (decodeJwt.exp * 1000 <= Date.now()) {
      dispatch(signOut());
    }
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
}
