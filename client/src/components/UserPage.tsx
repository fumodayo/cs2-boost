import Sidebar from "./Sidebar";

interface UserPageProps {
  children: React.ReactNode;
}

const UserPage: React.FC<UserPageProps> = ({ children }) => {
  return (
    <>
      <Sidebar />
      <main className="h-screen xl:ml-64">
        <div className="container">{children}</div>
      </main>
    </>
  );
};

export default UserPage;
