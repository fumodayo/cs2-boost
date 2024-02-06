import clsx from "clsx";
import i18next from "i18next";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../context/AppContext";

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

  const handleChangeCurrency = (value: string) => {
    setCurrency(value); // usd or vnd
  };

  return (
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
            onClick={() => handleChangeCurrency(item.value)}
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
  );
};

export default MenuLanguage;
