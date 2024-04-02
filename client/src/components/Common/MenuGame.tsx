import clsx from "clsx";
import { useTranslation } from "react-i18next";
import * as Popover from "@radix-ui/react-popover";

import { IoChevronDownOutline } from "react-icons/io5";
import { listOfGame } from "../../constants";

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
          <img
            src="/src/assets/illustrations/target.svg"
            className="h-5 w-5 fill-muted-foreground opacity-50"
            alt="target"
          />
          <div className="mx-1 capitalize">{t("Select Game")}</div>
          <IoChevronDownOutline />
        </button>
      </Popover.Trigger>
      <Popover.Content
        side="bottom"
        align="start"
        className="backdrop-brightness-5 z-50 w-64 min-w-[8rem] overflow-hidden rounded-md border bg-popover/75 p-2 text-popover-foreground shadow-md ring-1 ring-border backdrop-blur-lg"
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
              src={`/src/assets/${image}/logo.svg`}
            />
            {label}
          </a>
        ))}
      </Popover.Content>
    </Popover.Root>
  );
};

export default MenuGame;
