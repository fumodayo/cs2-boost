import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const cards = [
  { value: "counter-strike-2", label: "Counter Strike 2", available: true },
  { value: "lol-wild-rift", label: "Lol: Wild Rift", available: false },
  { value: "overwatch-2", label: "Overwatch 2", available: false },
  { value: "rocket-league", label: "Rocket League", available: false },
  { value: "teamfight-tactics", label: "Teamfight Tactics", available: false },
  { value: "valorant", label: "Valorant", available: false },
  { value: "world-of-warcraft", label: "World of Warcraft", available: false },
  { value: "league-of-legends", label: "League of Legends", available: false },
  { value: "destiny-2", label: "Destiny 2", available: false },
  { value: "apex-legends", label: "Apex Legends", available: false },
];

const Hero = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const [hoverItem, setHoverItem] = useState("league-of-legends");

  return (
    <>
      {/* BANNER */}
      <div className="absolute -z-10 w-full">
        <div className="relative h-[60%] overflow-hidden">
          {hoverItem && (
            <div className="image">
              <img
                src={`/src/assets/${hoverItem}/banner.png`}
                className={clsx(
                  "h-full w-full bg-center bg-no-repeat object-cover opacity-20 saturate-0",
                  "dark:hidden",
                )}
                alt="banner-light"
              />
              <img
                src={`/src/assets/${hoverItem}/banner.png`}
                className={clsx(
                  "hidden h-full w-full bg-center bg-no-repeat object-cover opacity-20",
                  "dark:block",
                )}
                alt="banner-dark"
              />
            </div>
          )}
          <div
            className={clsx(
              "absolute inset-0 -m-5 bg-gradient-to-t from-background/95 from-50%",
              "dark:hidden",
            )}
          />
          <div
            className={clsx(
              "absolute inset-0 -m-5 hidden bg-gradient-to-t from-background via-background/95 to-background/95 backdrop-blur-sm",
              "dark:block",
            )}
          />
        </div>
      </div>

      {/* CONTENT IN BANNER */}
      <div
        className={clsx(
          "mx-auto max-w-7xl overflow-x-clip px-4 py-20",
          "lg:py-26 sm:px-6 sm:pb-32 md:px-1.5",
        )}
      >
        {/* TITLE */}
        <div className={clsx("mb-6", "lg:flex")}>
          <div
            className={clsx(
              "mx-auto flex max-w-5xl flex-col items-center justify-center text-center lg:flex-shrink-0",
              "lg:pt-8",
            )}
          >
            <h1
              className={clsx(
                "mt-6 max-w-2xl text-center text-3xl font-bold tracking-wide text-foreground",
                "sm:text-6xl",
              )}
            >
              {t("The")}
              <span
                className={clsx(
                  "max-w-max bg-gradient-to-tl from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent",
                  "dark:from-blue-600 dark:via-blue-500 dark:to-blue-600",
                )}
              >
                {t("All-In-One")}
              </span>
              <span className="block">{t("Platform for Gamers")}</span>
            </h1>
            <p
              className={clsx(
                "mt-4 text-center text-sm font-medium text-foreground",
                "sm:text-lg lg:text-xl",
              )}
            >
              <span>{t("Premium Elo Boosting")}</span>
              <span> ⸱ </span>
              <span>{t("Expert Coaching")}</span>
              <span> ⸱ </span>
              <span>{t("High-Quality Accounts")}</span>
            </p>
          </div>
        </div>

        {/* CARDS */}
        <div
          className={clsx(
            "flex flex-wrap items-center justify-between gap-x-4 gap-y-6",
            "sm:justify-center sm:gap-x-6 sm:gap-y-8",
          )}
        >
          {cards.map(({ value, available, label }) => (
            <a
              key={label}
              onClick={() => available && navigate(value)}
              onMouseEnter={() => setHoverItem(value)}
              className="game-card-group group relative flex w-auto flex-col items-start gap-3 leading-5"
            >
              <div
                className={`game-card-image-wrapper relative overflow-clip ${
                  !available && "!opacity-10 blur-[1px]"
                }`}
              >
                <img
                  src={`/src/assets/${value}/card/bg.png`}
                  className={clsx("game-card-image", "group-hover:rounded-md")}
                />
                <img
                  src={`/src/assets/${value}/card/text.png`}
                  className={clsx(
                    "game-card-text-image",
                    "group-hover:translate3d-custom group-hover:scale-110",
                  )}
                />
              </div>
              <div className="flex max-w-full items-center truncate">
                <div className="flex-1 justify-between gap-1 truncate font-medium tracking-tight">
                  {label}
                </div>
              </div>
              {!available && (
                <div className="absolute bottom-1/2 left-0 right-0 mx-auto inline-flex w-fit items-center rounded-full bg-secondary/75 px-2 py-1 text-xs font-medium text-foreground opacity-100 ring-1 ring-inset ring-secondary">
                  {t("Coming Soon")}
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;
