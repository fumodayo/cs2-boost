import cn from "~/libs/utils";
import { Logo } from "~/components/ui/Misc";
import { listOfServices } from "~/constants/admin";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "~/components/ui/Button";
import { FaSignOutAlt } from "react-icons/fa";
import { FaChevronRight, FaPalette, FaGlobe } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { useContext } from "react";
import { AppContext } from "~/components/context/AppContext";
import { signOut } from "~/redux/user/userSlice";
import { useTranslation } from "react-i18next";
import { authService } from "~/services/auth.service";
import { getLocalStorage } from "~/utils/localStorage";
import useSWR from "swr";
import { adminService } from "~/services/admin.service";
import { reportService } from "~/services/report.service";
import MenuNotifications from "~/components/ui/Notification/MenuNotifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/@radix-ui/Dropdown";
const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useContext(AppContext);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");
  const ADMIN_ROOT_PATH = "/admin";
  const { data: partnerRequestsData } = useSWR(
    "/admin/partner-requests?status=pending",
    () =>
      adminService.getPartnerRequests(
        new URLSearchParams({ status: "pending" }),
      ),
    { refreshInterval: 30000 }, 
  );
  const { data: reportsData } = useSWR(
    "/reports?status=PENDING",
    () => reportService.getReports("PENDING"),
    { refreshInterval: 30000 },
  );
  const pendingPartnerRequestsCount =
    partnerRequestsData?.pagination?.total || 0;
  const pendingReportsCount = reportsData?.length || 0;
  const getBadgeCount = (value: string): number | null => {
    if (value === "/admin/partner-requests") {
      return pendingPartnerRequestsCount > 0
        ? pendingPartnerRequestsCount
        : null;
    }
    if (value === "/admin/manage-reports") {
      return pendingReportsCount > 0 ? pendingReportsCount : null;
    }
    return null;
  };
  const handleLogout = async () => {
    try {
      const payload = {
        ip_location: getLocalStorage("ip_location", ""),
        id: currentUser?._id as string,
      };
      await authService.signout(payload);
      dispatch(signOut());
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };
  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    document.documentElement.setAttribute("lang", lang);
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
            {listOfServices.map(({ titleKey, items }) => (
              <li key={titleKey}>
                <h3 className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-card-alt-foreground">
                  {t(titleKey)}
                </h3>
                <ul>
                  {items.map(({ labelKey, value, icon: Icon }) => {
                    const isDashboardLink = value.includes("dashboard");
                    const isActive =
                      pathname === value ||
                      pathname.startsWith(value + "/") ||
                      (isDashboardLink && pathname === ADMIN_ROOT_PATH);
                    const badgeCount = getBadgeCount(value);
                    return (
                      <li key={labelKey}>
                        <Link
                          to={value}
                          className={cn(
                            isActive
                              ? "bg-muted text-card-alt-foreground"
                              : "text-muted-foreground",
                            "group mb-1 flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium hover:bg-muted hover:text-card-alt-foreground",
                          )}
                        >
                          <div className="flex items-center">
                            <Icon
                              className={cn(
                                isActive
                                  ? "text-card-alt-foreground"
                                  : "text-muted-foreground",
                                "mr-3 h-4 w-4 flex-shrink-0 text-base group-hover:text-card-alt-foreground",
                              )}
                            />
                            {t(labelKey)}
                          </div>
                          {badgeCount !== null && (
                            <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white shadow-sm">
                              {badgeCount}
                            </span>
                          )}
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
      <div className="mt-auto border-t border-border bg-card-surface p-2">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-start gap-3 rounded-lg p-2 hover:bg-muted"
              >
                <div className="relative block h-10 w-10 shrink-0 rounded-full text-base">
                  <img
                    className="h-full w-full rounded-full object-cover"
                    src={currentUser?.profile_picture}
                    alt="avatar"
                  />
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-card-surface" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {currentUser?.username}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {t("sidebar.admin_mode")}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" side="top" align="start">
              {/* User Info Header */}
              <div className="flex items-center gap-x-3 px-2 py-2 text-sm font-medium">
                <div className="relative block h-10 w-10 shrink-0 rounded-lg text-base">
                  <img
                    className="h-full w-full rounded-lg object-cover"
                    src={currentUser?.profile_picture}
                    alt="avatar"
                  />
                </div>
                <div className="flex flex-col truncate">
                  <p className="text-sm text-foreground">
                    {currentUser?.username}
                  </p>
                  <p className="truncate text-xs font-medium text-muted-foreground">
                    ID: {currentUser?.user_id}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator className="-mx-1 my-1.5 h-px bg-accent/50" />
              {/* Language Submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <FaGlobe className="mr-2 w-5 text-center text-muted-foreground" />
                  {t("sidebar.change_language")}
                  <FaChevronRight className="ml-auto text-muted-foreground" />
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground",
                      i18n.language === "en" && "bg-accent",
                    )}
                    onClick={() => handleLanguageChange("en")}
                  >
                    <Button
                      variant="none"
                      className="flex items-center justify-center"
                    >
                      <span className="fi fi-gb fis mr-2.5 h-4 w-5 rounded-sm" />
                      {t("languages.en")}
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={cn(
                      "relative mt-1 flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground",
                      i18n.language === "vi" && "bg-accent",
                    )}
                    onClick={() => handleLanguageChange("vi")}
                  >
                    <Button
                      variant="none"
                      className="flex items-center justify-center"
                    >
                      <span className="fi fi-vn fis mr-2.5 h-4 w-5 rounded-sm" />
                      {t("languages.vi")}
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              {/* Theme Submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <FaPalette className="mr-2 w-5 text-center text-muted-foreground" />
                  {t("menu_theme.change_theme")}
                  <FaChevronRight className="ml-auto text-muted-foreground" />
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground",
                      theme === "dark" && "bg-accent",
                    )}
                    onClick={() => setTheme("dark")}
                  >
                    <Button
                      variant="none"
                      className="flex items-center justify-center"
                    >
                      <i className="mr-2.5 h-4 w-4 rounded-full bg-[#181A20] ring-1 ring-foreground/20" />
                      {t("menu_theme.dark_mode")}
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={cn(
                      "relative mt-1 flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground",
                      theme === "light" && "bg-accent",
                    )}
                    onClick={() => setTheme("light")}
                  >
                    <Button
                      variant="none"
                      className="flex items-center justify-center"
                    >
                      <i className="mr-2.5 h-4 w-4 rounded-full bg-[#F5F7FA] ring-1 ring-foreground/20" />
                      {t("menu_theme.light_mode")}
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              {/* Logout */}
              <DropdownMenuSeparator className="-mx-1 my-1.5 h-px bg-accent/50" />
              <DropdownMenuItem
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm text-danger-light-foreground outline-none transition-colors",
                  "focus:bg-danger-light focus:text-danger-light-foreground",
                )}
                onClick={handleLogout}
              >
                <a className="flex items-center justify-center">
                  <FaSignOutAlt className="mr-2 w-5 text-center text-danger-light-foreground" />
                  {t("avatar_menu.logout")}
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <MenuNotifications />
        </div>
      </div>
    </div>
  );
};
export default Sidebar;