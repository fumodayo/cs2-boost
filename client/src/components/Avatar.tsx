import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { IconType } from "react-icons";
import { BsGrid1X2Fill } from "react-icons/bs";
import { BsRocketTakeoffFill } from "react-icons/bs";
import { GiSamuraiHelmet } from "react-icons/gi";
import { HiCog6Tooth } from "react-icons/hi2";
import { FaPalette, FaChevronRight, FaSignOutAlt } from "react-icons/fa";
import Separator from "./Separator";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const services = [
  {
    label: "My Boosts",
    link: "#",
    icon: BsRocketTakeoffFill,
  },
  {
    label: "My Accounts",
    link: "#",
    icon: GiSamuraiHelmet,
  },
  {
    label: "Settings",
    link: "#",
    icon: HiCog6Tooth,
  },
];

interface AvatarItemProps {
  label?: string;
  link?: string;
  icon?: IconType;
}

const AvatarItem: React.FC<AvatarItemProps> = ({ label, link, icon: Icon }) => {
  return (
    <DropdownMenu.Item className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
      <a className="flex items-center justify-center" href={link}>
        {Icon && (
          <Icon className="mr-2 w-5 text-center text-base text-muted-foreground" />
        )}
        {label}
      </a>
    </DropdownMenu.Item>
  );
};

const Avatar = () => {
  const { theme, setTheme } = useContext(AppContext);

  const handleThemeChange = (selected: string) => {
    setTheme(selected);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="h-10 rounded-full ring-1 ring-accent focus:outline-none focus:ring-2 focus:ring-primary">
          <div className="relative block h-10 w-10 shrink-0 rounded-full text-base">
            <img
              src="/src/assets/avatar.png"
              alt="user"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <span className="sr-only">Open user menu for user</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="backdrop-brightness-5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 min-w-[8rem] overflow-visible rounded-md border bg-popover/75 p-2 text-popover-foreground shadow-md ring-1 ring-border/10 backdrop-blur-lg">
          <div className="flex items-center gap-x-3 px-2 py-2 text-sm font-medium">
            <div className="relative block h-10 w-10 shrink-0 rounded-lg text-base">
              <img
                src="https://cdn.gameboost.com/users/19918/avatar/conversions/AAcHTtdFRpMwux-WHt9RoMHs81i8OXPo9eQNI82d1caCUqQLRjU=s96-c-thumb.webp"
                alt="Profile Avatar"
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-col truncate">
              <p className="text-sm text-foreground">User Name</p>
              <p className="truncate text-xs font-medium text-muted-foreground">
                ID: 59162
              </p>
            </div>
          </div>
          <Separator />
          <AvatarItem label="Dashboard" link="#" icon={BsGrid1X2Fill} />
          <Separator />
          {services.map((item) => (
            <AvatarItem label={item.label} link={item.link} icon={item.icon} />
          ))}
          <Separator />
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[state=open]:bg-accent data-[disabled]:opacity-50">
              <FaPalette className="mr-2 w-5 text-center text-lg text-muted-foreground" />
              Change Theme
              <FaChevronRight className="ml-auto text-muted-foreground" />
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-48 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg">
                <DropdownMenu.Item
                  className={`relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${
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
                  className={`relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${
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
          <DropdownMenu.Item className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm text-danger-light-foreground outline-none transition-colors focus:bg-danger-light focus:text-danger-light-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <a className="flex items-center justify-center" href="#">
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
