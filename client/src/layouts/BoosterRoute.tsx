import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";
import { parseJwt } from "../utils/formatJwt";
import { signOut } from "../redux/user/userSlice";

export default function BoosterRoute() {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const isBooster = currentUser?.role?.includes("booster") || undefined;

  const dispatch = useDispatch();
  const token = localStorage.getItem("access_token");

  if (token) {
    const decodeJwt = parseJwt(token);

    if (decodeJwt.exp * 1000 <= Date.now()) {
      console.log("logout");
    }
  } else {
    dispatch(signOut());
  }

  return isBooster ? <Outlet /> : <Navigate to="/" />;
}
