import { useContext } from "react";
import { FaGraduationCap } from "react-icons/fa6";
import { GiSamuraiHelmet } from "react-icons/gi";
import { IoRocketSharp } from "react-icons/io5";
import cn from "~/libs/utils";
import { AppContext } from "~/components/context/AppContext";
import { Button } from "~/components/shared";
import { useTranslation } from "react-i18next";

const services = [
  {
    icon: IoRocketSharp,
    title: "Boosting",
    image: "boosting",
    subtitle:
      "Ranking up and progressing has never been easier and more stress-free.",
    label: "Rank Up Now",
  },
  {
    icon: GiSamuraiHelmet,
    title: "Accounts",
    image: "accounts",
    subtitle:
      "Step up your game with our vast catalog of affordable, top-quality accounts.",
    label: "Browse Accounts",
  },
  {
    icon: FaGraduationCap,
    title: "Coaching",
    image: "coaching",
    subtitle: "Expert coaching by former C9 analysts, LCS players, and more.",
    label: "Get Coaching",
  },
];

const OurServices = () => {
  const { t } = useTranslation();
  const { theme } = useContext(AppContext);

  return (
    <div
      className={cn(
        "relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4",
        "sm:px-6 xl:px-8",
      )}
    >
      <h2 className="font-display z-10 text-4xl font-bold text-foreground">
        {t("OurServices.heading")}
      </h2>
      <p
        className={cn(
          "secondary z-10 mt-2 max-w-md text-center text-sm font-medium text-foreground/90",
          "sm:text-base",
        )}
      >
        {t("OurServices.subheading")}
      </p>
      <img
        className={cn("absolute -top-36 hidden", "dark:block")}
        src="/assets/backgrounds/services-bg.png"
        alt="blue gradient"
        loading="lazy"
      />
      <div
        className={cn(
          "z-10 mt-20 grid w-full grid-cols-1 gap-8",
          "md:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {services.map(({ icon: Icon, image, title, subtitle, label }) => (
          <div
            key={label}
            className={cn(
              "col-span-1 flex w-full flex-col rounded-xl border border-border bg-card shadow-lg",
              "dark:border-[#1a2037] dark:bg-[#141825]/60",
            )}
          >
            <div className="p-6 pb-0">
              <div className="flex items-center gap-4 text-foreground">
                <Icon size={24} />
                <h3 className="tracking-light font-display text-2xl font-bold">
                  {t(`OurServices.card.title.${title}`)}
                </h3>
              </div>
              <p
                className={cn(
                  "mt-2 line-clamp-2 text-sm font-medium tracking-tight text-foreground/90",
                  "sm:text-base",
                )}
              >
                {t(`OurServices.card.subtitle.${subtitle}`)}
              </p>
            </div>
            <img
              className="my-auto h-auto w-full"
              src={`/assets/services/${image}${theme === "light" ? "_w" : ""}.png`}
              loading="lazy"
              alt={label}
            />
            {theme === "dark" && (
              <img
                className="h-auto w-full"
                src="/assets/backgrounds/rectangle.png"
                alt="rectangle background"
                loading="lazy"
              />
            )}
            <div
              className={cn("h-[40px] border-t border-border", "dark:hidden")}
            />
            <div className="-mt-2.5 flex items-center justify-center px-6 pb-6">
              <Button
                className={cn(
                  "w-full whitespace-nowrap rounded-md bg-[#0B6CFB] px-5 py-3 text-sm text-white ring-inset hover:brightness-110 focus:outline-primary active:translate-y-px",
                  "dark:ring-1 dark:ring-[#1a13a1]/50 sm:py-2.5",
                )}
                variant="primary"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                {t(`OurServices.card.label.${label}`)} →{" "}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurServices;
