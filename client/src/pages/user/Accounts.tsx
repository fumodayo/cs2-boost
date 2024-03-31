import { MdOutlinePendingActions } from "react-icons/md";
import UserPage from "../../components/Layouts/UserPage";
import { FaRocket } from "react-icons/fa6";

const Accounts = () => {
  return (
    <UserPage>
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-y-4">
          <div className="min-w-fit flex-1 flex-grow md:min-w-0">
            <div className="flex flex-wrap items-center gap-y-4">
              <div className="sm:truncate">
                <h1 className="font-display text-3xl font-semibold text-foreground sm:truncate sm:tracking-tight">
                  Accounts List
                </h1>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 sm:justify-normal md:ml-4 md:mt-0">
            <a
              className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
              href="/dashboard/pending-boosts"
            >
              <MdOutlinePendingActions className="mr-2 text-xl" />
              Get More Boost
            </a>
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

export default Accounts;
