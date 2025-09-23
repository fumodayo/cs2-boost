import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "~/redux/store";
import { ROLE } from "~/types/constants";

const PartnerLayout = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const isPartner = currentUser?.role.includes(ROLE.PARTNER);

  return isPartner ? <Outlet /> : <Navigate to="/" />;
};

export default PartnerLayout;
