import { PopoverTrigger } from "@radix-ui/react-popover";
import { Popover, PopoverContent } from "../@radix-ui/Popover";
import { Button } from "./Button";
import cn from "~/libs/utils";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { ICurrencyProps } from "~/types";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const language = [
  {
    label: "English",
    flag: "gb",
    value: "en",
  },
  {
    label: "Vietnamese",
    flag: "vn",
    value: "vi",
  },
];

const money = [
  {
    label: "US Dollar",
    flag: "us",
    value: "usd",
  },
  {
    label: "VND",
    flag: "vn",
    value: "vnd",
  },
];

const MenuLanguage = ({
  variant = "light",
}: {
  variant?: "light" | "none" | "primary" | "secondary" | "transparent";
}) => {
  const { currency, setCurrency } = useContext(AppContext);

  const { t, i18n } = useTranslation();

  const handleChangeLanguage = (value: string) => {
    i18next.changeLanguage(value); // en or vi
    document.documentElement.setAttribute("lang", value);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant={variant}
          className="h-11 rounded-full px-4 py-2 text-sm font-medium"
        >
          <span
            className={cn(
              `fi fi-${i18n.language === "en" ? "gb" : "vn"} fis -ml-2 mr-2`,
            )}
          />
          {i18n.language === "en"
            ? t("Globals.English")
            : t("Globals.Vietnamese")}
          <span className="px-1.5 text-muted-foreground">/</span>
          {currency === "vnd" ? t("Globals.VND") : t("Globals.USD")}
          <span className="sr-only">Change language and currency</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={10}
        className="w-[24rem]"
      >
        <div className="divide-y-1 flex flex-col gap-x-2 divide-border lg:flex-row lg:divide-y-0">
          <div className="flex-1 space-y-1">
            <div className="px-2 py-1.5 text-sm font-medium">
              {t("MenuLanguage.title1")}
            </div>
            {language.map(({ label, flag, value }) => (
              <div
                key={label}
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-md px-2 py-2 text-sm text-accent-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                  i18n.language === value ? "bg-accent" : "",
                )}
                onClick={() => handleChangeLanguage(value)}
              >
                <span className={cn(`fi fi-${flag} fis flag-select mr-2`)} />
                {t(`Globals.${label}`)}
              </div>
            ))}
          </div>
          <div className="flex-1 space-y-1">
            <div className="px-2 py-1.5 text-sm font-medium">
              {t("MenuLanguage.title2")}
            </div>
            {money.map(({ label, flag, value }) => (
              <button
                key={label}
                type="button"
                className={cn(
                  value === currency && "bg-accent",
                  "relative flex w-full cursor-default select-none items-center rounded-md px-2 py-2 text-sm text-accent-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                )}
                onClick={() => setCurrency(value as ICurrencyProps)}
              >
                <span className={cn(`fi fi-${flag} fis flag-select mr-2`)} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MenuLanguage;
