import { useContext } from "react";
import { BsGrid1X2Fill } from "react-icons/bs";
import { FaSignOutAlt } from "react-icons/fa";
import { FaChevronRight, FaPalette } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
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
} from "../@radix-ui/Dropdown";
import {
  IListOfPath,
  listOfPathClient,
  listOfPathPartner,
} from "~/constants/role";
import { useTranslation } from "react-i18next";
import { RootState } from "~/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useDeviceType, useStorageIPLocation } from "~/hooks";
import { axiosInstance } from "~/axiosAuth";
import { getLocalStorage } from "~/utils/localStorage";
import { signOut } from "~/redux/user/userSlice";
import { v4 as uuidv4 } from "uuid";

const DropdownItem = ({ path, icon: Icon, label }: IListOfPath) => {
  const { t } = useTranslation();

  return (
    <DropdownMenuItem className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
      <Link to={path} className="flex items-center justify-center">
        <Icon className="mr-2 w-5 text-center text-muted-foreground" />
        {t(`Globals.Services.${label}`)}
      </Link>
    </DropdownMenuItem>
  );
};

const Avatar = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useContext(AppContext);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const currentRole = currentUser?.role;

  useStorageIPLocation();
  useDeviceType();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/signout", {
        ip_location: getLocalStorage("ip_location", ""),
        id: currentUser?._id,
      });
      dispatch(signOut());
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex flex-col items-center outline-none"
        asChild
      >
        <button
          type="button"
          className="h-10 rounded-full ring-1 ring-accent focus:outline-none focus:ring-2 focus:ring-primary"
        >
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
          <span className="sr-only">Open user menu for user</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        <div className="flex items-center gap-x-3 px-2 py-2 text-sm font-medium">
          {/* AVATAR */}
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
              ID: {currentUser?.user_id}
            </p>
          </div>
        </div>

        {/* DASHBOARD */}
        {currentRole?.includes("partner")
          ? listOfPathPartner
              .slice(0, 1)
              .map(({ path }) => (
                <DropdownItem
                  key={uuidv4()}
                  icon={BsGrid1X2Fill}
                  label="Dashboard"
                  path={path}
                />
              ))
          : listOfPathClient
              .slice(0, 1)
              .map(({ path }) => (
                <DropdownItem
                  key={uuidv4()}
                  icon={BsGrid1X2Fill}
                  label="Dashboard"
                  path={path}
                />
              ))}

        <DropdownMenuSeparator className="-mx-1 my-1.5 h-px bg-accent/50" />

        {currentRole?.includes("partner")
          ? listOfPathPartner.map((props) => (
              <DropdownItem key={uuidv4()} {...props} />
            ))
          : listOfPathClient.map((props) => (
              <DropdownItem key={uuidv4()} {...props} />
            ))}

        <DropdownMenuSeparator className="-mx-1 my-1.5 h-px bg-accent/50" />

        {/* CHANGE THEME */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <FaPalette className="mr-2 w-5 text-center text-muted-foreground" />
            {t("Avatar.label.Change Theme")}
            <FaChevronRight className="ml-auto text-muted-foreground" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              className={`relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground ${
                theme === "dark" && "bg-accent"
              }`}
              onClick={() => setTheme("dark")}
            >
              <button className="flex items-center justify-center">
                <i
                  className={`ring-foreground/20" mr-2.5 h-4 w-4 rounded-full bg-[#181A20] ring-1`}
                />
                {t("Avatar.label.Dark Mode")}
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`relative mt-1 flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground ${
                theme === "light" && "bg-accent"
              }`}
              onClick={() => setTheme("light")}
            >
              <button className="flex items-center justify-center">
                <i
                  className={`ring-foreground/20" mr-2.5 h-4 w-4 rounded-full bg-[#F5F7FA] ring-1`}
                />
                {t("Avatar.label.Light Mode")}
              </button>
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
            {t("Avatar.label.Logout")}
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Avatar;
