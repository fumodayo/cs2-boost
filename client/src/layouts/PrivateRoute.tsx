import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";
import { signOut } from "../redux/user/userSlice";
import { parseJwt } from "../utils/formatJwt";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const isClient = currentUser?.role?.includes("client") || undefined;

  const dispatch = useDispatch();
  const token = localStorage.getItem("access_token");

  if (token) {
    const decodeJwt = parseJwt(token);

    if (decodeJwt.exp * 1000 <= Date.now()) {
      dispatch(signOut());
    }
  } else {
    dispatch(signOut());
  }

  return isClient ? <Outlet /> : <Navigate to="/" />;
}
