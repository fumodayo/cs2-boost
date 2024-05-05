import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { IoNotifications } from "react-icons/io5";
import { RxRocket } from "react-icons/rx";

const MessageNotify = () => {
  return (
    <DropdownMenu.Item className="relative flex w-full gap-x-3 rounded px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground">
      <div className="relative block h-8 w-8 shrink-0 rounded-full text-sm">
        <img
          src="http://res.cloudinary.com/du93troxt/image/upload/v1714744607/wog6f6mmj50hbs0kkph8.jpg"
          alt="avatar"
          className="h-full w-full rounded-full object-cover"
        />
      </div>
      <div className="truncate text-muted-foreground">
        <h1 className="font-bold text-foreground">User name</h1>
        <p className="font-medium text-foreground">Ayo man, whatsup</p>
        <p>2 hour ago</p>
      </div>
    </DropdownMenu.Item>
  );
};

const NewBoostNotify = () => {
  return (
    <DropdownMenu.Item className="relative flex w-full gap-x-3 rounded-md px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground">
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm">
        <RxRocket className="text-xl" />
      </div>
      <div className="truncate text-muted-foreground">
        <p className="font-bold text-foreground">You have new boost</p>
        <p>2 hour ago</p>
      </div>
    </DropdownMenu.Item>
  );
};

const Notifications = () => {
  const [isNotify, setIsNotify] = useState(true);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary px-2 py-2 text-sm font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
        >
          <div className="relative block shrink-0 rounded-full text-sm">
            <IoNotifications />
            {isNotify && (
              <span className="absolute right-0 top-0 block h-1 w-1 rounded-full bg-danger ring-2 ring-card" />
            )}
          </div>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="bottom"
          align="start"
          sideOffset={10}
          alignOffset={-30}
          className="scroll-custom backdrop-brightness-5 z-50 max-h-[450px] w-72 min-w-[8rem] cursor-pointer overflow-auto rounded-md border border-border bg-popover/30 p-2 text-popover-foreground shadow-md ring-1 ring-border/10 backdrop-blur-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          <div className="flex flex-col gap-y-2">
            <h1 className="text-sm font-bold">Notifications</h1>
            <MessageNotify />
            <NewBoostNotify />
            <MessageNotify />
            <MessageNotify />
            <NewBoostNotify />
            <MessageNotify />
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Notifications;
