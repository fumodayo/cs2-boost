import { useContext } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { FaChevronRight, FaPalette, FaGlobe } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import cn from "~/libs/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../@radix-ui/Dropdown";
import { useTranslation } from "react-i18next";
import { RootState } from "~/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useDeviceType } from "~/hooks";
import { getLocalStorage } from "~/utils/localStorage";
import { signOut } from "~/redux/user/userSlice";
import toast from "react-hot-toast";
import getErrorMessage from "~/utils/errorHandler";
import { authService } from "~/services/auth.service";
import { Button } from "../Button";
import { listOfServices } from "~/constants/admin";

const AdminAvatar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation("common");
  const { theme, setTheme } = useContext(AppContext);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const { isMobile } = useDeviceType();

  const handleLogout = async () => {
    try {
      const payload = {
        ip_location: getLocalStorage("ip_location", ""),
        id: currentUser?._id as string,
      };
      await authService.signout(payload);
      dispatch(signOut());
      navigate("/");
    } catch (err) {
      const error = getErrorMessage(err);
      toast.error(error);
    }
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    document.documentElement.setAttribute("lang", lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex flex-col items-center outline-none"
        asChild
      >
        <Button className="h-10 rounded-full ring-1 ring-accent focus:outline-none focus:ring-2 focus:ring-primary">
          <div className="relative block h-10 w-10 shrink-0 rounded-full text-base">
            {currentUser?.profile_picture && (
              <img
                className="h-full w-full rounded-full object-cover"
                src={currentUser.profile_picture}
                alt="avatar"
                crossOrigin="anonymous"
              />
            )}
          </div>
          <span className="sr-only">{t("sr_only.open_user_menu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
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
            <p className="text-sm text-foreground">{currentUser?.username}</p>
            <p className="truncate text-xs font-medium text-muted-foreground">
              {t("avatar_menu.user_id", { userId: currentUser?.user_id })}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="-mx-1 my-1.5 h-px bg-accent/50" />

        {/* Admin Navigation Links */}
        {listOfServices.map(({ titleKey, items }) => (
          <div key={titleKey}>
            <p className="px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t(titleKey)}
            </p>
            {items.map(({ labelKey, value, icon: Icon }) => {
              const isActive = pathname === value;
              return (
                <DropdownMenuItem
                  key={labelKey}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors",
                    "focus:bg-accent focus:text-accent-foreground",
                    isActive && "bg-accent",
                  )}
                >
                  <Link to={value} className="flex w-full items-center">
                    <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {t(labelKey)}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </div>
        ))}

        <DropdownMenuSeparator className="-mx-1 my-1.5 h-px bg-accent/50" />

        {/* Language Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <FaGlobe className="mr-2 w-5 text-center text-muted-foreground" />
            {t("sidebar.change_language")}
            <FaChevronRight className="ml-auto text-muted-foreground" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent
            sideOffset={isMobile ? -150 : 0}
            alignOffset={isMobile ? 50 : 0}
          >
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

        {/* Change Theme */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <FaPalette className="mr-2 w-5 text-center text-muted-foreground" />
            {t("menu_theme.change_theme")}
            <FaChevronRight className="ml-auto text-muted-foreground" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent
            sideOffset={isMobile ? -150 : 0}
            alignOffset={isMobile ? 50 : 0}
          >
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

        {/* LOGOUT */}
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
  );
};

export default AdminAvatar;