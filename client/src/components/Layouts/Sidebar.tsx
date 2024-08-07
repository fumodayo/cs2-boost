import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";

import Logo from "../Common/Logo";
import Avatar from "../Common/Avatar";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Notifications from "../Common/Notifications";
import {
  sidebarItemsForAdmin,
  sidebarItemsForBooster,
  sidebarItemsForClient,
} from "../../constants";

const Sidebar = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  let listOfServices;

  if (currentUser?.role?.includes("booster")) {
    listOfServices = sidebarItemsForBooster;
  } else if (currentUser?.role?.includes("admin")) {
    listOfServices = sidebarItemsForAdmin;
  } else {
    listOfServices = sidebarItemsForClient;
  }

  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  const slug = segments.length > 1 ? segments.pop() : null;

  const roleName =
    currentUser?.role?.find((role) => ["booster", "admin"].includes(role)) ||
    "Client";

  return (
    <div
      className={clsx(
        "hidden flex-col border-r border-border bg-card-alt",
        "xl:fixed xl:inset-y-0 xl:z-20 xl:flex xl:w-64",
      )}
    >
      {/* HEADER */}
      <div className="border-b border-border bg-card-surface px-4 py-4">
        <Logo />
      </div>

      {/* CONTENT */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto px-4 py-4">
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-7">
            {listOfServices.map(({ title, items }) => (
              <li key={title}>
                <h3 className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-card-alt-foreground">
                  {title}
                </h3>
                <ul>
                  {items.map((item) => (
                    <li key={item.label}>
                      {item.label === "Dashboard" ? (
                        <a
                          className={clsx(
                            "group pointer-events-none mb-1 flex items-center rounded-md px-2 py-2 text-sm font-medium text-muted-foreground opacity-50",
                            "hover:bg-muted hover:text-card-alt-foreground",
                          )}
                        >
                          <item.icon
                            className={clsx(
                              ", mr-3 w-4 flex-shrink-0 text-base text-muted-foreground",
                              "group-hover:text-card-alt-foreground",
                            )}
                          />
                          {item.label}
                        </a>
                      ) : (
                        <a
                          onClick={() => navigate(`${item.value}`)}
                          className={`${
                            item.value === slug && "bg-muted"
                          } group mb-1 flex items-center rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-card-alt-foreground`}
                        >
                          <item.icon className="mr-3 w-4 flex-shrink-0 text-base text-muted-foreground group-hover:text-card-alt-foreground" />
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* FOOTER */}
      <div className="mt-auto border-t border-border bg-card-surface px-4 py-4">
        <div className="flex items-center justify-between">
          <Avatar>
            <button className="text-left">
              <div className="flex items-center">
                <div className="relative block h-8 w-8 shrink-0 rounded-full text-sm">
                  <img
                    src={currentUser?.profile_picture}
                    alt="profile picture"
                    className="h-full w-full rounded-full object-cover"
                  />

                  {/* ACTIVE */}
                  <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-card" />
                </div>

                {/* USERNAME / ROLE */}
                <div className="ml-2.5 truncate">
                  <div className="text-sm font-medium text-foreground">
                    {currentUser?.username}
                  </div>
                  <div className="truncate text-xs capitalize text-muted-foreground">
                    {roleName} mode
                  </div>
                </div>
              </div>
            </button>
          </Avatar>

          {/* NOTIFICATIONS */}
          <Notifications />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
