import { useContext } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { IconType } from "react-icons";
import { BsGrid1X2Fill } from "react-icons/bs";
import { FaPalette, FaChevronRight, FaSignOutAlt } from "react-icons/fa";

import Separator from "../Separator";
import { AppContext } from "../../context/AppContext";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../redux/user/userSlice";
import { RootState } from "../../redux/store";
import { Theme } from "../../types";
import { listOfServices } from "../../constants";

interface AvatarItemProps {
  label?: string;
  link?: string;
  icon?: IconType;
}

interface AvatarProps {
  children: React.ReactNode;
}

const AvatarItem: React.FC<AvatarItemProps> = ({ label, link, icon: Icon }) => {
  return (
    <DropdownMenu.Item
      className={clsx(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors",
        "focus:bg-accent focus:text-accent-foreground",
      )}
    >
      <a
        className="flex items-center justify-center"
        href={`/dashboard/${link}`}
      >
        {Icon && (
          <Icon className="mr-2 w-5 text-center text-base text-muted-foreground" />
        )}
        {label}
      </a>
    </DropdownMenu.Item>
  );
};

const Avatar: React.FC<AvatarProps> = ({ children }) => {
  const dispatch = useDispatch();

  const { theme, setTheme } = useContext(AppContext);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleThemeChange = (selected: Theme) => {
    setTheme(selected);
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/user/signout");
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="backdrop-brightness-5 z-50 w-72 min-w-[8rem] overflow-visible rounded-md border bg-popover/75 p-2 text-popover-foreground shadow-md ring-1 ring-border/10 backdrop-blur-lg">
          <div className="flex items-center gap-x-3 px-2 py-2 text-sm font-medium">
            <div className="relative block h-10 w-10 shrink-0 rounded-lg text-base">
              <img
                src="https://cdn.gameboost.com/users/19918/avatar/conversions/AAcHTtdFRpMwux-WHt9RoMHs81i8OXPo9eQNI82d1caCUqQLRjU=s96-c-thumb.webp"
                alt="Profile Avatar"
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-col truncate">
              <p className="text-sm text-foreground">{currentUser?.username}</p>
              <p className="truncate text-xs font-medium text-muted-foreground">
                ID: {currentUser?._id}
              </p>
            </div>
          </div>
          <Separator />
          <AvatarItem label="Dashboard" link="" icon={BsGrid1X2Fill} />
          <Separator />
          {listOfServices
            .filter((service) => service.label !== "Dashboard")
            .map(({ label, link, icon }) => (
              <AvatarItem key={label} label={label} link={link} icon={icon} />
            ))}
          <Separator />
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger
              className={clsx(
                "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors",
                "focus:bg-accent focus:text-accent-foreground",
              )}
            >
              <FaPalette className="mr-2 w-5 text-center text-lg text-muted-foreground" />
              Change Theme
              <FaChevronRight className="ml-auto text-muted-foreground" />
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent className="z-50 w-48 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg">
                <DropdownMenu.Item
                  className={`relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground ${
                    theme === "dark" && "bg-accent"
                  }`}
                  onClick={() => handleThemeChange("dark")}
                >
                  <button className="flex items-center justify-center">
                    <i
                      className={`ring-foreground/20" mr-2.5 h-4 w-4 rounded-full bg-[#181A20] ring-1`}
                    />
                    Dark Mode
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className={`relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground ${
                    theme === "light" && "bg-accent"
                  }`}
                  onClick={() => handleThemeChange("light")}
                >
                  <button className="flex items-center justify-center">
                    <i
                      className={`ring-foreground/20" mr-2.5 h-4 w-4 rounded-full bg-[#F5F7FA] ring-1`}
                    />
                    Light Mode
                  </button>
                </DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
          <Separator />
          <DropdownMenu.Item
            className={clsx(
              "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm text-danger-light-foreground outline-none transition-colors",
              "focus:bg-danger-light focus:text-danger-light-foreground",
            )}
            onClick={handleSignOut}
          >
            <a className="flex items-center justify-center">
              <FaSignOutAlt className="mr-2 w-5 text-center text-danger-light-foreground" />
              Logout
            </a>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Avatar;
