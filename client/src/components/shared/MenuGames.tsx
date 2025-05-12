import { Link, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { IoChevronDownOutline } from "react-icons/io5";
import cn from "~/libs/utils";
import { listOfGames } from "~/constants/games";
import { IconSwitch, IconTarget } from "~/icons";
import { Popover, PopoverContent, PopoverTrigger } from "../@radix-ui/Popover";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";

const MenuGames = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant="light"
          className="h-11 gap-2 rounded-full border border-muted-foreground/20 px-4 py-2 text-sm font-medium"
        >
          {pathname === "/" ? (
            <>
              <IconTarget />
              {t("MenuGames.title1")}
            </>
          ) : (
            <>
              <IconSwitch />
              {t("MenuGames.title2")}
            </>
          )}
          <IoChevronDownOutline className="text-muted-foreground" size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={10}
        className="columns-3 lg:columns-4"
      >
        {listOfGames.map(({ value, label, isAvailable }) => (
          <Link
            key={uuidv4()}
            className={cn(
              isAvailable
                ? "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                : "pointer-events-none opacity-50",
              "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none transition-colors",
            )}
            to={`/${value}`}
          >
            <img
              className="mr-2 h-6 w-6"
              src={`/assets/games/${value}/logo.png`}
              alt={label + "logo"}
            />
            {label}
          </Link>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default MenuGames;
