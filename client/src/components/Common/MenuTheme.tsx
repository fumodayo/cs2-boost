import { useContext } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import * as Popover from "@radix-ui/react-popover";

import { FaMoon } from "react-icons/fa6";
import { IoIosSunny } from "react-icons/io";

import { AppContext } from "../../context/AppContext";
import { Theme } from "../../types";
import { Button } from "../Buttons/Button";

const MenuTheme = () => {
  const { t } = useTranslation();

  const { theme, setTheme } = useContext(AppContext);

  const handleThemeChange = (selected: Theme) => {
    setTheme(selected);
  };

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button
          color="light"
          className="h-10 w-10 rounded-full text-sm font-medium"
        >
          {theme === "dark" ? <FaMoon /> : <IoIosSunny className="text-2xl" />}
        </Button>
      </Popover.Trigger>
      <Popover.Content
        side="bottom"
        align="end"
        sideOffset={10}
        alignOffset={10}
        className="popover-content w-48 min-w-[8rem]"
      >
        <div className="min-w-[150px] flex-1 space-y-1">
          <div className="px-2 py-1.5 text-sm font-medium">
            {t("Change Theme")}
          </div>
          <button
            onClick={() => handleThemeChange("dark")}
            className={clsx(
              "relative flex w-full select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground",
              theme === "dark" && "bg-accent",
            )}
          >
            <i className="mr-2.5 h-4 w-4 rounded-full bg-[#181A20] ring-1 ring-foreground" />
            Dark Mode
          </button>
          <button
            onClick={() => handleThemeChange("light")}
            className={clsx(
              "relative flex w-full select-none items-center rounded-sm px-2 py-2 text-sm text-accent-foreground outline-none transition-colors focus:bg-accent focus:text-accent-foreground",
              theme === "light" && "bg-accent",
            )}
          >
            <i className="mr-2.5 h-4 w-4 rounded-full bg-[#F5F7FA] ring-1 ring-foreground"></i>
            Light Mode
          </button>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

export default MenuTheme;
