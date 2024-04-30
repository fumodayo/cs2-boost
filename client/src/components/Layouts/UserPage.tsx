import clsx from "clsx";

import Sidebar from "./Sidebar";
import MiniNavbar from "./MiniNavbar";

interface UserPageProps {
  children: React.ReactNode;
}

const UserPage: React.FC<UserPageProps> = ({ children }) => {
  return (
    <>
      <Sidebar />
      <MiniNavbar />
      <main className={clsx("h-screen", "xl:ml-64")}>{children}</main>
    </>
  );
};

export default UserPage;
