import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/@radix-ui/Popover";
import { Button } from "~/components/ui/Button";
import cn from "~/libs/utils";
import { useContext } from "react";
import { AppContext } from "~/components/context/AppContext";
import { ICurrency } from "~/types";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { supportedLanguages } from "~/constants/locale";
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
  const { t, i18n } = useTranslation("common");
  const handleChangeLanguage = (value: string) => {
    i18next.changeLanguage(value); 
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
              `fi fi-${supportedLanguages.find((lang) => lang.value === i18n.language)?.flag} fis -ml-2 mr-2`,
            )}
          />
          {t(`languages.${i18n.language}`)}
          <span className="px-1.5 text-muted-foreground">/</span>
          {t(`currencies.${currency}`)}
          <span className="sr-only">{t("menu_language.sr_only")}</span>
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
              {t("menu_language.change_language")}
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
                {t(`languages.${value}`)}
              </div>
            ))}
          </div>
          <div className="flex-1 space-y-1">
            <div className="px-2 py-1.5 text-sm font-medium">
              {t("menu_language.change_currency")}
            </div>
            {money.map(({ label, flag, value }) => (
              <div
                key={label}
                className={cn(
                  value === currency && "bg-accent",
                  "relative flex w-full cursor-default select-none items-center rounded-md px-2 py-2 text-sm text-accent-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                )}
                onClick={() => setCurrency(value as ICurrency)}
              >
                <span className={cn(`fi fi-${flag} fis flag-select mr-2`)} />
                {t(`currencies.${value}`)}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default MenuLanguage;