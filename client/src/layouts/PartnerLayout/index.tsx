import { Navigate, Outlet } from "react-router-dom";

const PartnerLayout = () => {
  const currentUser = { name: "a", role: ["user", "partner"] };
  // const currentUser = {}

  const isPartner = currentUser.role.includes("partner");

  return isPartner ? <Outlet /> : <Navigate to="/" />;
};

export default PartnerLayout;
