import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "~/redux/store";
import { ObjectValues, ROLE } from "~/types/constants";

interface AdminViewOnlyRoutesProps {
  children: JSX.Element;
}

const AdminViewOnlyRoutes = ({ children }: AdminViewOnlyRoutesProps) => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const allowedRoles: ObjectValues<typeof ROLE>[] = [ROLE.CLIENT, ROLE.ADMIN];

  if (!currentUser || !currentUser.role.some((r) => allowedRoles.includes(r))) {
    return <Navigate to="/" replace />;
  }

  if (currentUser.is_banned) {
    return <Navigate to="/banned" replace />;
  }

  return children;
};

export default AdminViewOnlyRoutes;