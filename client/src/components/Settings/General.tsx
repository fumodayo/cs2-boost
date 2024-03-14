import Widget from "../Widget";
import { FaDesktop, FaEye, FaTrashCan, FaXmark } from "react-icons/fa6";

const userInfo = {
  username: "Sơn Thái",
  handle: "son-thai",
  id: "#59162",
  email: "thaigiui2016@gmail.com",
  language: "_",
  games: "_",
};

const headers = [
  "username",
  "handle",
  "user ID",
  "email address",
  "language",
  "games",
];

const General = () => {
  return (
    <div className="mx-auto grid grid-cols-1 grid-rows-1 items-start gap-x-5 gap-y-5 lg:mx-0 lg:grid-cols-3">
      {/* CREDIT */}

      {/* INFORMATION */}
      <div className="space-y-4 lg:col-span-2 lg:row-span-2 lg:row-end-2 lg:space-y-6">
        <Widget
          titleHeader="User Information"
          headers={headers}
          boostItem={userInfo}
        />

        {/* DELETE ACCOUNT */}
        <div className="grad-valorant-immortal rounded-lg bg-card bg-gradient-to-br via-card to-card to-50% px-4 py-5 shadow ring-1 ring-danger-ring sm:p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold leading-6 text-foreground">
                Delete Account
              </h3>
              <div className="mt-2 max-w-xl text-sm text-foreground/90">
                This is irreversible. We will permanently remove your account,
                you will lose all the store credit and loyalty coins you have.
              </div>
            </div>
            <button className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-danger px-4 py-2 text-sm font-medium text-danger-foreground shadow-sm outline-none transition-colors hover:bg-danger-hover focus:outline focus:outline-offset-2 focus:outline-danger focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50">
              <FaTrashCan className="mr-2" />
              Delete Account
            </button>
          </div>
        </div>

        {/* LOGIN SESSIONS */}
        <div className="-mx-4 border bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl">
          <div className="flex flex-row items-center space-y-1.5 border-b border-border bg-muted/50 px-4 py-4 sm:rounded-t-xl sm:px-6">
            <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
              Login Sessions
            </h3>
            <div className="ml-auto flex items-center gap-x-1.5">
              <button className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary-light px-2 py-1.5 text-xs font-medium text-secondary-light-foreground outline-none transition-colors hover:bg-secondary-light-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50">
                <FaEye className="mr-2" /> Show IPs
              </button>
              <button className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-danger-light px-2 py-1.5 text-xs font-medium text-danger-light-foreground outline-none transition-colors hover:bg-danger-light-hover focus:outline focus:outline-offset-2 focus:outline-danger focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50">
                <FaXmark className="mr-2" /> Logout All Devices
              </button>
            </div>
          </div>
          <div className="px-0 pt-0 sm:px-6">
            <ul className="divide-y divide-border rounded-md">
              <li className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4 leading-6 sm:px-0">
                <div className="flex min-w-[150px] flex-1 items-center">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border p-3 shadow-sm">
                    <FaDesktop className="text-xl text-foreground/90" />
                  </div>
                  <div className="ml-4 flex min-w-0 flex-1 flex-col">
                    <span className="font-display items-center truncate font-medium sm:flex">
                      Windows
                      <span className="px-0.5 text-muted-foreground sm:px-1.5">
                        .
                      </span>
                      Chrome
                      <span className="font-sans ml-1 inline-flex items-center rounded-md bg-primary-light px-2 py-1 text-xs font-medium text-primary-light-foreground ring-1 ring-inset ring-primary-ring sm:ml-2">
                        <svg
                          className="-ml-0.5 mr-1.5 h-2 w-2"
                          fill="currentColor"
                          viewBox="0 0 8 8"
                        >
                          <circle cx="4" cy="4" r="3"></circle>
                        </svg>
                        Current
                      </span>
                    </span>
                    <span className="flex-shrink-0 items-center gap-x-1.5 truncate text-sm text-muted-foreground sm:flex">
                      <span className="text-muted-foreground">·</span> 9 seconds
                      ago
                    </span>
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-x-3">
                  <div className="block h-9 w-24 rounded-md bg-muted" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default General;
