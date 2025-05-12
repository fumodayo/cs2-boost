import cn from "~/libs/utils";
import Logo from "./Logo";
import { listOfServices } from "~/constants/admin";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./Button";
import { FaSignOutAlt } from "react-icons/fa";
import Tooltip from "../@radix-ui/Tooltip";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { IoIosSunny } from "react-icons/io";
import { FaMoon } from "react-icons/fa6";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { theme, setTheme } = useContext(AppContext);
  const { currentAdmin } = useSelector((state: RootState) => state.admin);

  return (
    <div
      className={cn(
        "hidden flex-col border-r border-border bg-card-alt xl:fixed xl:inset-y-0 xl:z-20 xl:flex xl:w-64",
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
                  {items.map(({ label, value, icon: Icon }) => (
                    <li key={label}>
                      <Link
                        to={value}
                        className={cn(
                          value === pathname && "bg-muted",
                          "group mb-1 flex items-center rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-card-alt-foreground",
                        )}
                      >
                        <Icon className="mr-3 w-4 flex-shrink-0 text-base text-muted-foreground group-hover:text-card-alt-foreground" />
                        {label}
                      </Link>
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
          {/* USER */}
          <div className="text-left">
            <div className="flex items-center">
              <div className="relative block h-8 w-8 shrink-0 rounded-full text-sm">
                <img
                  className="h-full w-full rounded-full object-cover"
                  src={currentAdmin?.profile_picture}
                  alt="avatar"
                />
                {/* ACTIVE */}
                <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-card" />
              </div>
              <div className="flex items-center justify-between">
                <div className="ml-2.5 truncate">
                  <div className="text-sm font-medium text-foreground">
                    {currentAdmin?.username}
                  </div>
                  <div className="truncate text-xs capitalize text-muted-foreground">
                    Admin Mode
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* DARK / LIGHT MODE */}
            <Tooltip content="Theme">
              <Button
                variant="light"
                className="rounded-md px-2 py-2 text-sm font-medium shadow-sm"
              >
                {theme === "light" ? (
                  <IoIosSunny onClick={() => setTheme("dark")} size={18} />
                ) : (
                  <FaMoon onClick={() => setTheme("light")} size={16} />
                )}
              </Button>
            </Tooltip>

            {/* LOGOUT */}
            <Tooltip content="Logout">
              <Button
                variant="light"
                className="rounded-md px-2 py-2 text-sm font-medium shadow-sm hover:bg-danger-light"
              >
                <div className="relative block shrink-0 rounded-full text-sm">
                  <FaSignOutAlt className="w-5 text-center text-danger-light-foreground" />
                </div>
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
