import cn from "~/libs/utils";
import { Questions } from "~/components/ui";
import { useTranslation } from "react-i18next";

const AskList = () => {
  const { t } = useTranslation("landing");

  return (
    <div
      className={cn(
        "relative z-20 mx-auto flex w-full max-w-7xl flex-col px-4",
        "sm:px-6 xl:px-8",
      )}
    >
      <div className="grid grid-cols-5">
        <div
          className={cn(
            "col-span-5 flex flex-col items-center justify-center text-center",
            "md:items-start md:text-start lg:col-span-2",
          )}
        >
          <h2
            className={cn(
              "font-display max-w-md text-4xl font-bold tracking-tight text-foreground",
              "md:max-w-xs",
            )}
          >
            {t("ask_list.heading")}
          </h2>
          <p
            className={cn(
              "mt-4 max-w-md font-medium text-foreground/90",
              "md:max-w-xs",
            )}
          >
            {t("ask_list.subheading")}
          </p>
        </div>
        <div
          className={cn(
            "relative col-span-5 mt-12 flex flex-col",
            "lg:col-span-3 lg:mt-0",
          )}
        >
          <img
            className={cn(
              "absolute -bottom-8 left-[24rem] z-0 hidden scale-[1.2]",
              "dark:block",
            )}
            src="/assets/backgrounds/bear.png"
            loading="lazy"
            alt="bg"
          />
          <Questions />
        </div>
      </div>
    </div>
  );
};

export default AskList;