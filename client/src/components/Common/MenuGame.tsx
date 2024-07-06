import clsx from "clsx";
import { useTranslation } from "react-i18next";
import * as Popover from "@radix-ui/react-popover";

import { IoChevronDownOutline } from "react-icons/io5";
import { listOfGame } from "../../constants";
import Target from "../Icons/Target";
import { Button } from "../Buttons/Button";

const MenuGame = () => {
  const { t } = useTranslation();

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button
          color="light"
          className="h-11 gap-2 rounded-full px-4 py-2 text-sm font-medium"
        >
          <Target />
          <div className="mx-1 capitalize">{t("Select Game")}</div>
          <IoChevronDownOutline />
        </Button>
      </Popover.Trigger>
      <Popover.Content
        side="bottom"
        align="start"
        sideOffset={10}
        className="popover-content w-64 min-w-[8rem]"
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
            <img className="mr-2 h-6 w-6" src={`/assets/${image}/logo.svg`} />
            {label}
          </a>
        ))}
      </Popover.Content>
    </Popover.Root>
  );
};

export default MenuGame;
