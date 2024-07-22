import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import Logo from "../Common/Logo";
import Avatar from "../Common/Avatar";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import * as Dialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";

import Notifications from "../Common/Notifications";
import { Button, CloseButton } from "../Buttons/Button";
import {
  sidebarItemsForAdmin,
  sidebarItemsForBooster,
  sidebarItemsForClient,
} from "../../constants";

const MiniNavbar = () => {
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

  return (
    <div className="flex w-full items-center gap-x-2 border-b border-border bg-card-alt px-4 py-4 sm:px-6 xl:hidden">
      <Dialog.Root>
        <Dialog.Trigger>
          <Button
            color="secondary"
            className="h-9 w-9 rounded-md px-2 py-1.5 text-xs font-medium shadow-sm"
          >
            <FaBarsStaggered />
            <span className="sr-only">Open Sidebar</span>
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="data-[state=open]:animate-overlay-show data-[state=closed]:animate-overlay-close fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
            <Dialog.Content className="data-[state=closed]:animate-slideover-close-left data-[state=open]:animate-slideover-show-left fixed left-0 top-0 z-40 mx-auto h-[100dvh] w-full overflow-auto rounded-none bg-card-alt text-left shadow-xl outline-none transition-all focus:outline-none sm:max-w-sm sm:rounded-l-xl md:left-3 md:top-3 md:h-[calc(100svh-1.5rem)] md:rounded-xl">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-border bg-card-surface px-4 py-4">
                  <Logo />
                  <Dialog.Close>
                    <CloseButton>
                      <FaXmark className="text-xl" />
                    </CloseButton>
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
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
      <Logo />
      <Notifications />
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
