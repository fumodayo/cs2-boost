import { FaMoon } from "react-icons/fa6";
import { Popover, PopoverContent, PopoverTrigger } from "../@radix-ui/Popover";
import { Button } from "./Button";
import { IoIosSunny } from "react-icons/io";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import cn from "~/libs/utils";

const MenuTheme = () => {
  const { theme, setTheme } = useContext(AppContext);

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
        <div className="px-2 py-1.5 text-sm font-medium">Change Theme</div>
        <Button
          onClick={() => setTheme("dark")}
          className={cn(
            theme === "dark" && "bg-accent",
            "relative flex w-full select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
          )}
        >
          <i className="mr-2.5 h-4 w-4 rounded-full bg-[#181A20] ring-1 ring-foreground/20" />
          Dark Mode
        </Button>
        <Button
          onClick={() => setTheme("light")}
          className={cn(
            theme === "light" && "bg-accent",
            "relative flex w-full select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
          )}
        >
          <i className="mr-2.5 h-4 w-4 rounded-full bg-[#F5F7FA] ring-1 ring-foreground/20" />
          Light Mode
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default MenuTheme;
