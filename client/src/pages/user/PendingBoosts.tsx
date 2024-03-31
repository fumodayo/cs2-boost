import { FaRocket } from "react-icons/fa6";
import UserPage from "../../components/Layouts/UserPage";

const PendingBoosts = () => {
  return (
    <UserPage>
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-y-4">
          <div className="min-w-fit flex-1 flex-grow md:min-w-0">
            <div className="flex flex-wrap items-center gap-y-4">
              <div className="sm:truncate">
                <h1 className="font-display text-3xl font-semibold text-foreground sm:truncate sm:tracking-tight">
                  Pending Boosts List
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* INFORMATION */}
        {/* <DataTable
          headers={headers}
          
        /> */}
      </div>
    </UserPage>
  );
};

export default PendingBoosts;
