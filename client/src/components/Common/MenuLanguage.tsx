import { useContext } from "react";
import * as Popover from "@radix-ui/react-popover";
import clsx from "clsx";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

import { AppContext } from "../../context/AppContext";
import { Currency } from "../../types";
import { Button } from "../Buttons/Button";

const language = [
  {
    label: "English",
    flag: "gb",
    value: "en",
  },
  {
    label: "Vietnamese",
    flag: "vn",
    value: "vn",
  },
];

const money = [
  {
    label: "VND",
    flag: "vn",
    value: "vnd",
  },
  {
    label: "US Dollar",
    flag: "us",
    value: "usd",
  },
];

const MenuLanguage = () => {
  /** Change language: */
  const { t, i18n } = useTranslation();

  const handleChangeLanguage = (value: string) => {
    i18next.changeLanguage(value); // en or vn
  };

  /** Change currency: */
  const { currency, setCurrency } = useContext(AppContext);

  const handleChangeCurrency = (value: Currency) => {
    setCurrency(value); // usd or vnd
  };

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button
          color="light"
          className="h-10 rounded-full px-4 py-2 text-sm font-medium"
        >
          <span
            className={`fi fis fi-${
              i18n.language === "en" ? "gb" : "vn"
            } -ml-2 mr-2 h-6 w-6 rounded-full`}
          />
          {i18n.language === "en" ? t("English") : t("Vietnamese")}
          <span className="mx-2">/</span>
          {currency === "vnd" ? t("VND") : t("US Dollar")}
        </Button>
      </Popover.Trigger>
      <Popover.Content
        side="bottom"
        align="end"
        sideOffset={10}
        alignOffset={10}
        className="popover-content w-[24rem] min-w-[8rem]"
      >
        <div
          className={clsx(
            "divide-y-1 flex flex-col gap-x-2 divide-border",
            "lg:flex-row lg:divide-y-0",
          )}
        >
          <div className="flex-1 space-y-1">
            <div className="px-2 py-1.5 text-sm font-medium capitalize">
              {t("Change Language")}
            </div>
            {language.map((item) => (
              <a
                onClick={() => handleChangeLanguage(item.value)}
                key={item.label}
                className={clsx(
                  "relative flex w-full cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none transition-colors",
                  "hover:bg-accent hover:text-secondary-light-foreground focus:bg-accent",
                  i18n.language === item.value ? "bg-accent" : "",
                )}
              >
                <span className={`fi fis fi-${item.flag} mr-2 rounded-xl`} />
                {t(item.label)}
              </a>
            ))}
          </div>
          <div className="flex-1 space-y-1">
            <div className="px-2 py-1.5 text-sm font-medium capitalize">
              {t("Change Currency")}
            </div>
            {money.map((item) => (
              <a
                onClick={() => handleChangeCurrency(item.value as Currency)}
                key={item.label}
                className={clsx(
                  "relative flex w-full cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none transition-colors",
                  "hover:bg-accent hover:text-secondary-light-foreground focus:bg-accent",
                  currency === item.value ? "bg-accent" : "",
                )}
              >
                <span className={`fi fis fi-${item.flag} mr-2 rounded-xl`} />
                {t(item.label)}
              </a>
            ))}
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

export default MenuLanguage;
