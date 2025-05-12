import { useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { BsStars } from "react-icons/bs";
import cn from "~/libs/utils";
import { listOfGames } from "~/constants/games";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  const [hoverGameCard, setHoverGameCard] = useState("honkai-star-rail");

  return (
    <>
      {/* BANNER */}
      <div className="absolute -z-10 w-full">
        <div className="relative h-[60%] overflow-hidden">
          <div>
            <img
              className={cn(
                "block h-full w-full bg-center bg-no-repeat object-cover opacity-20 saturate-0",
                "dark:hidden",
              )}
              src={`/assets/games/${hoverGameCard}/banner.png`}
              alt="Banner"
            />
            <img
              className={cn(
                "hidden h-full w-full bg-center bg-no-repeat object-cover",
                "dark:block",
              )}
              src={`/assets/games/${hoverGameCard}/banner.png`}
              alt="Banner"
            />
          </div>
          <div
            className={cn(
              "absolute inset-0 -m-5 block bg-gradient-to-t from-background/95 from-50%",
              "dark:hidden",
            )}
          />
          <div
            className={cn(
              "absolute inset-0 -m-5 hidden bg-gradient-to-t from-background from-50% via-background/95 to-background/95 backdrop-blur-sm",
              "dark:block dark:from-[#0F111B] dark:via-[#0F111B]/95 dark:to-[#0F111B]/95",
            )}
          />
        </div>
      </div>
      <img
        className="pointer-events-none absolute -top-8 z-10 h-screen"
        style={{ mixBlendMode: "soft-light" }}
        src="/assets/illustrations/stars.png"
        alt="Hero Section Stars"
      />
      <img
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 opacity-95 lg:h-[976px] lg:w-[1336px]"
        style={{ mixBlendMode: "soft-light" }}
        src="/assets/illustrations/bg-light.png"
        alt="Hero Section Background"
      />

      {/* CONTENT */}
      <div
        className={cn(
          "mx-auto max-w-7xl overflow-x-clip px-4 py-20",
          "sm:px-6 sm:pb-32 lg:py-28 xl:px-8",
        )}
      >
        {/* TITLE */}
        <div className={cn("mb-6", "lg:flex")}>
          <div
            className={cn(
              "mx-auto flex max-w-5xl flex-col items-center justify-center text-center",
              "lg:flex-shrink-0 lg:pt-8",
            )}
          >
            <h1
              className={cn(
                "font-display mt-6 max-w-2xl text-center text-3xl font-bold tracking-wide text-foreground",
                "sm:text-6xl",
              )}
            >
              {t("Hero.The")}
              <span
                className={cn(
                  "max-w-max bg-gradient-to-br from-[#a3dfff] via-[#6cb9ff] to-[#0185ff] bg-clip-text text-transparent",
                  "light:from-blue-600 light:via-blue-500 light:to-blue-600",
                )}
              >
                {" "}
                {t("Hero.All-In-One")}
              </span>
              <span> {t("Hero.Platform for Gamers")} </span>
            </h1>
            <p
              className={cn(
                "mt-4 text-center text-sm font-medium text-foreground/90",
                "sm:text-lg lg:text-xl",
              )}
            >
              <span>{t("Hero.description.part1")}</span>
              <span> ⸱ </span>
              <span>{t("Hero.description.part2")}</span>
              <span> ⸱ </span>
              <span>{t("Hero.description.part3")}</span>
            </p>
          </div>
        </div>

        {/* CARDS */}
        <div
          className={cn(
            "grid grid-cols-[repeat(auto-fill,_minmax(6.75rem,_1fr))] gap-x-3 gap-y-4",
            "sm:gap-y-6 md:grid-cols-4 lg:grid-cols-7",
          )}
        >
          {listOfGames.map(({ value, label, isAvailable, isNew }) => (
            <Link
              key={label}
              onMouseEnter={() => setHoverGameCard(value)}
              className="game-card-group group relative flex w-auto flex-col items-start gap-3 leading-5"
              to={`/${value}`}
            >
              {isAvailable ? (
                <>
                  <div className="game-card-image-wrapper relative overflow-clip">
                    {isNew && (
                      <div className="absolute right-1 top-1 z-10 flex transform rounded-md bg-danger px-2 py-1 text-center text-xs font-semibold text-danger-foreground ring-1 ring-danger-ring">
                        <BsStars /> {t("Hero.card.New")}
                      </div>
                    )}
                    <img
                      key={uuidv4()}
                      className="game-card-image group-hover:rounded-md"
                      src={`/assets/games/${value}/card.png`}
                      alt={label}
                    />
                  </div>
                  <div className="flex max-w-[95%] items-center truncate">
                    <p className="flex-1 justify-between gap-1 truncate font-medium tracking-tight text-foreground">
                      {label}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="game-card-image-wrapper relative overflow-clip opacity-20 blur-[1px]">
                    <img
                      key={uuidv4()}
                      className="game-card-image group-hover:rounded-md"
                      src={`/assets/games/${value}/card.png`}
                      alt={label}
                    />
                  </div>
                  <div className="flex max-w-[95%] items-center truncate">
                    <p className="flex-1 justify-between gap-1 truncate font-medium tracking-tight text-foreground">
                      {label}
                    </p>
                  </div>
                  <div className="absolute bottom-1/2 left-0 right-0 z-10 mx-auto inline-flex w-fit items-center rounded-full bg-secondary/75 px-2 py-1 text-xs font-medium text-foreground opacity-100 ring-1 ring-inset ring-secondary">
                    {t("Hero.card.Coming Soon")}
                  </div>
                </>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;
