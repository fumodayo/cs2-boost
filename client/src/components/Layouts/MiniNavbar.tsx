import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import Logo from "../Common/Logo";
import Avatar from "../Common/Avatar";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import * as Dialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";

import { IoGrid } from "react-icons/io5";
import { HiMiniRocketLaunch } from "react-icons/hi2";
import { GiSamuraiHelmet } from "react-icons/gi";
import { BiSolidCog } from "react-icons/bi";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaMoneyBillTrendUp, FaWallet } from "react-icons/fa6";

const sidebarItemsForClient = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        value: "dashboard",
        icon: IoGrid,
        active: false,
      },
    ],
  },
  {
    title: "ORDERS",
    items: [
      {
        label: "My Boosts List",
        value: "boosts",
        icon: HiMiniRocketLaunch,
        active: false,
      },
    ],
  },
  {
    title: "BILLING",
    items: [
      {
        label: "Wallet",
        value: "wallet",
        icon: FaWallet,
        active: false,
      },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      {
        label: "Settings",
        value: "settings",
        icon: BiSolidCog,
        active: false,
      },
    ],
  },
];

const sidebarItemsForBooster = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        value: "dashboard",
        icon: IoGrid,
        active: false,
      },
    ],
  },
  {
    title: "ORDERS",
    items: [
      {
        label: "My Boosts List",
        value: "boosts",
        icon: HiMiniRocketLaunch,
        active: false,
      },
      {
        label: "Pending Boosts List",
        value: "pending-boosts",
        icon: MdOutlinePendingActions,
        active: false,
      },
      {
        label: "Progress Boosts List",
        value: "progress-boosts",
        icon: GiSamuraiHelmet,
        active: false,
      },
    ],
  },
  {
    title: "BILLING",
    items: [
      {
        label: "Wallet",
        value: "wallet",
        icon: FaWallet,
        active: false,
      },
      {
        label: "Income",
        value: "income",
        icon: FaMoneyBillTrendUp,
        active: false,
      },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      {
        label: "Settings",
        value: "settings",
        icon: BiSolidCog,
        active: false,
      },
    ],
  },
];

const MiniNavbar = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const listOfServices = currentUser?.role?.includes("booster")
    ? sidebarItemsForBooster
    : sidebarItemsForClient;

  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  const slug = segments.length > 1 ? segments.pop() : null;

  return (
    <div className="flex w-full items-center gap-x-2 border-b border-border bg-card-alt px-4 py-4 sm:px-6 xl:hidden">
      <Dialog.Root>
        <Dialog.Trigger>
          <button
            type="button"
            className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary px-2 py-1.5 text-xs font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
          >
            <FaBarsStaggered />
            <span className="sr-only">Open Sidebar</span>
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm">
            <Dialog.Content className="fixed left-0 top-0 z-30 mx-auto h-[100dvh] w-full overflow-auto rounded-none bg-card-alt text-left shadow-xl outline-none transition-all focus:outline-none sm:max-w-sm sm:rounded-l-xl md:left-3 md:top-3 md:h-[calc(100svh-1.5rem)] md:rounded-xl">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-border bg-card-surface px-4 py-4">
                  <Logo />
                  <Dialog.Close>
                    <button
                      type="button"
                      className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-transparent px-4 py-2 text-sm font-medium text-secondary-light-foreground outline-none transition-colors hover:bg-secondary-light focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
                    >
                      <span className="sr-only">Close</span>
                      <FaXmark />
                    </button>
                  </Dialog.Close>
                </div>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto px-2 py-4 sm:px-4">
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
                                    onClick={() =>
                                      navigate(`/dashboard/${item.value}`)
                                    }
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
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
      <Logo />
      <Avatar>
        <button className="h-10 rounded-full ring-1 ring-accent focus:outline-none focus:ring-2 focus:ring-primary">
          <div className="relative block h-10 w-10 shrink-0 rounded-full text-base">
            <img
              src={currentUser?.profile_picture}
              alt={currentUser?.username}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <span className="sr-only">Open user menu for user</span>
        </button>
      </Avatar>
    </div>
  );
};

export default MiniNavbar;
