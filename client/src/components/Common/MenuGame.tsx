import clsx from "clsx";
import { useTranslation } from "react-i18next";
import * as Popover from "@radix-ui/react-popover";

import { IoChevronDownOutline } from "react-icons/io5";
import { listOfGame } from "../../constants";
import Target from "../Icons/Target";

const MenuGame = () => {
  const { t } = useTranslation();

  return (
    <Popover.Root>
      <Popover.Trigger>
        <button
          type="button"
          className={clsx(
            "relative flex h-11 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full border border-muted-foreground/20 bg-secondary-light px-4 py-2 text-sm font-medium text-secondary-light-foreground outline-none transition-colors",
            "hover:bg-secondary-light-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          <Target />
          <div className="mx-1 capitalize">{t("Select Game")}</div>
          <IoChevronDownOutline />
        </button>
      </Popover.Trigger>
      <Popover.Content
        side="bottom"
        align="start"
        sideOffset={10}
        className="backdrop-brightness-5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover/75 p-2 text-popover-foreground shadow-md ring-1 ring-border/10 backdrop-blur-lg"
      >
        {listOfGame.map(({ href, image, label, available }) => (
          <a
            key={label}
            className={clsx(
              "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none transition-colors",
              available
                ? "cursor-pointer hover:bg-accent focus:bg-accent focus:text-accent-foreground"
                : "pointer-events-none opacity-30",
            )}
            href={`/${href}`}
          >
            <img
              className="mr-2 h-6 w-6"
              src={`/assets/${image}/logo.svg`}
            />
            {label}
          </a>
        ))}
      </Popover.Content>
    </Popover.Root>
  );
};

export default MenuGame;
