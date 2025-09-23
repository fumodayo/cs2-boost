import cn from "~/libs/utils";
import Logo from "./Logo";
import { listOfServices } from "~/constants/admin";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./Button";
import { FaSignOutAlt } from "react-icons/fa";
import Tooltip from "../@radix-ui/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { IoIosSunny } from "react-icons/io";
import { FaMoon } from "react-icons/fa6";
import { signOut } from "~/redux/user/userSlice";
import { useTranslation } from "react-i18next";
import { authService } from "~/services/auth.service";
import { getLocalStorage } from "~/utils/localStorage";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { theme, setTheme } = useContext(AppContext);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const { i18n } = useTranslation();

  const ADMIN_ROOT_PATH = "/admin";

  const handleLogout = async () => {
    try {
      const payload = {
        ip_location: getLocalStorage("ip_location", ""),
        id: currentUser?._id as string,
      };
      await authService.signout(payload);
      dispatch(signOut());
    } catch (e) {
      console.error(e);
    }
  };

  const handleLanguageToggle = () => {
    const newLang = i18n.language === "en" ? "vi" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.setAttribute("lang", newLang);
  };

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
                  {items.map(({ label, value, icon: Icon }) => {
                    const isDashboardLink = value.includes("dashboard");
                    const isActive =
                      pathname === value ||
                      (isDashboardLink && pathname === ADMIN_ROOT_PATH);

                    return (
                      <li key={label}>
                        <Link
                          to={value}
                          className={cn(
                            isActive
                              ? "bg-muted text-card-alt-foreground"
                              : "text-muted-foreground",
                            "group mb-1 flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-muted hover:text-card-alt-foreground",
                          )}
                        >
                          <Icon
                            className={cn(
                              isActive
                                ? "text-card-alt-foreground"
                                : "text-muted-foreground",
                              "mr-3 h-4 w-4 flex-shrink-0 text-base group-hover:text-card-alt-foreground",
                            )}
                          />
                          {label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* FOOTER */}
      <div className="mt-auto border-t border-border bg-card-surface px-2.5 py-2">
        <div className="flex w-full cursor-pointer items-center justify-between rounded-md p-1.5 transition-colors hover:bg-muted">
          <div className="flex items-center">
            <div className="relative block h-8 w-8 shrink-0 rounded-full text-sm">
              <img
                className="h-full w-full rounded-full object-cover"
                src={currentUser?.profile_picture}
                alt="avatar"
              />
              <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-card" />
            </div>
            <div className="ml-2.5 truncate">
              <div className="text-sm font-medium text-foreground">
                {currentUser?.username}
              </div>
              <div className="truncate text-xs capitalize text-muted-foreground">
                Admin Mode
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-0.5">
            <Tooltip content="Change Language">
              <Button
                onClick={handleLanguageToggle}
                variant="ghost"
                className="h-8 w-8 rounded-md p-0 text-sm font-medium"
              >
                <span
                  className={cn(
                    `fi fi-${i18n.language === "en" ? "gb" : "vn"} fis rounded-sm`,
                    "h-4 w-5",
                  )}
                />
              </Button>
            </Tooltip>

            <Tooltip content="Theme">
              <Button
                variant="ghost"
                className="h-8 w-8 rounded-md text-sm font-medium"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? (
                  <IoIosSunny size={20} />
                ) : (
                  <FaMoon size={16} />
                )}
              </Button>
            </Tooltip>

            <Tooltip content="Logout">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="h-8 w-8 rounded-md text-sm font-medium text-danger-light-foreground hover:bg-danger-light"
              >
                <FaSignOutAlt className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
