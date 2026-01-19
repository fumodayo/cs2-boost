import { FaMoon } from "react-icons/fa6";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/@radix-ui/Popover";
import { Button } from "~/components/ui/Button";
import { IoIosSunny } from "react-icons/io";
import { useContext } from "react";
import { AppContext } from "~/components/context/AppContext";
import cn from "~/libs/utils";
import { useTranslation } from "react-i18next";

const MenuTheme = () => {
  const { theme, setTheme } = useContext(AppContext);
  const { t } = useTranslation("common");

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant="transparent"
          className="h-11 w-11 rounded-full text-sm font-medium"
        >
          {theme === "light" ? <IoIosSunny size={18} /> : <FaMoon size={16} />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={10}
        alignOffset={10}
        className="w-48"
      >
        <div className="px-2 py-1.5 text-sm font-medium">
          {t("menu_theme.change_theme")}
        </div>
        <div
          onClick={() => setTheme("dark")}
          className={cn(
            theme === "dark" && "bg-accent",
            "relative flex w-full select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
          )}
        >
          <i className="mr-2.5 h-4 w-4 rounded-full bg-[#181A20] ring-1 ring-foreground/20" />
          {t("menu_theme.dark_mode")}
        </div>
        <div
          onClick={() => setTheme("light")}
          className={cn(
            theme === "light" && "bg-accent",
            "relative mt-0.5 flex w-full select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
          )}
        >
          <i className="mr-2.5 h-4 w-4 rounded-full bg-[#F5F7FA] ring-1 ring-foreground/20" />
          {t("menu_theme.light_mode")}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MenuTheme;