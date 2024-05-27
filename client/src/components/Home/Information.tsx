import { useContext } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { IoRocketSharp } from "react-icons/io5";
import { GiSamuraiHelmet } from "react-icons/gi";
import { FaGraduationCap } from "react-icons/fa6";

import { AppContext } from "../../context/AppContext";

const services = [
  {
    icon: IoRocketSharp,
    title: "boosting",
    subtitle:
      "Ranking up and progressing has never been easier and more stress-free",
    label: "Rank Up Now",
  },
  {
    icon: GiSamuraiHelmet,
    title: "accounts",
    subtitle:
      "Step up your game with our vast catalog of affordable, top-quality accounts",
    label: "Browse Accounts",
  },
  {
    icon: FaGraduationCap,
    title: "coaching",
    subtitle: "Expert coaching by former C9 analysts, LCS players, and more",
    label: "Get Coaching",
  },
];

const Information = () => {
  const { t } = useTranslation();
  const { theme } = useContext(AppContext);

  return (
    <div
      className={clsx(
        "relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4",
        "sm:px-6 xl:px-8",
      )}
    >
      <h2 className="z-10 text-4xl font-bold text-foreground">
        {t("Our Services")}
      </h2>
      <p
        className={clsx(
          "secondary z-10 mt-2 max-w-md text-center text-sm font-medium text-foreground",
          "sm:text-base",
        )}
      >
        {t(
          "Whether you're seeking top-tier boosting, expert coaching, or high-quality accounts, we've got you covered",
        )}
      </p>
      <img
        loading="lazy"
        src="/assets/backgrounds/services-bg.png"
        alt="blue gradient"
        className={clsx("absolute -top-36 hidden", "dark:block")}
      />
      <div
        className={clsx(
          "z-10 mt-20 grid w-full grid-cols-1 gap-8",
          "md:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {services.map((service) => (
          <div
            key={service.label}
            className={clsx(
              "col-span-1 flex w-full flex-col rounded-xl border border-border bg-card shadow-lg",
              "dark:border-[#1a2037]/60 dark:bg-[#141825]/60",
            )}
          >
            <div className="p-6 pb-0">
              <div className="flex items-center gap-4 text-2xl text-foreground">
                <service.icon />
                <h3 className="text-2xl font-bold capitalize tracking-tight">
                  {t(service.title)}
                </h3>
              </div>
              <div
                className={clsx(
                  "mt-2 line-clamp-2 text-sm font-medium tracking-tight text-foreground",
                  "sm:text-base",
                )}
              >
                {t(service.subtitle)}.
              </div>
            </div>
            <img
              src={`/assets/services/${service.title}${
                theme === "light" ? "_w" : ""
              }.png`}
              alt={service.title}
              loading="lazy"
              className="my-auto h-auto w-full"
            />
            <div
              className={clsx("h-[40px] border-t border-border", "dark:hidden")}
            />
            <div className="-mt-2.5 flex items-center justify-center px-6 pb-6">
              <button
                className={clsx(
                  "blue-glow relative inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-[#0B6CFB] px-5 py-3 text-sm font-medium text-white outline-none ring-inset transition-colors",
                  "sm:py-2.5",
                  "dark:ring-1 dark:ring-[#1a13a1]/50",
                  "hover:brightness-110 focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                )}
              >
                {t(service.label)} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Information;
