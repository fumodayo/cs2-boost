import clsx from "clsx";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../context/AppContext";

const MenuTheme = () => {
  const { t } = useTranslation();

  const { theme, setTheme } = useContext(AppContext);

  const handleThemeChange = (selected: string) => {
    setTheme(selected);
  };

  return (
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
  );
};

export default MenuTheme;
