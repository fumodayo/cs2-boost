import { useContext } from "react";
import { FaGraduationCap } from "react-icons/fa6";
import { GiSamuraiHelmet } from "react-icons/gi";
import { IoRocketSharp } from "react-icons/io5";
import cn from "~/libs/utils";
import { AppContext } from "~/components/context/AppContext";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/Button";

const services = [
  {
    icon: IoRocketSharp,
    key: "boosting",
    image: "boosting",
  },
  {
    icon: GiSamuraiHelmet,
    key: "accounts",
    image: "accounts",
  },
  {
    icon: FaGraduationCap,
    key: "coaching",
    image: "coaching",
  },
];

const OurServices = () => {
  const { t } = useTranslation("landing");
  const { theme } = useContext(AppContext);

  return (
    <div
      className={cn(
        "relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4",
        "sm:px-6 xl:px-8",
      )}
    >
      <h2 className="font-display z-10 text-4xl font-bold text-foreground">
        {t("our_services.heading")}
      </h2>
      <p
        className={cn(
          "secondary z-10 mt-2 max-w-md text-center text-sm font-medium text-foreground/90",
          "sm:text-base",
        )}
      >
        {t("our_services.subheading")}
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
        {services.map(({ icon: Icon, image, key }) => (
          <div
            key={key}
            className={cn(
              "col-span-1 flex w-full flex-col rounded-xl border border-border bg-card shadow-lg",
              "dark:border-[#1a2037] dark:bg-[#141825]/60",
            )}
          >
            <div className="p-6 pb-0">
              <div className="flex items-center gap-4 text-foreground">
                <Icon size={24} />
                <h3 className="tracking-light font-display text-2xl font-bold">
                  {t(`our_services.${key}.title`)}
                </h3>
              </div>
              <p
                className={cn(
                  "mt-2 line-clamp-2 text-sm font-medium tracking-tight text-foreground/90",
                  "sm:text-base",
                )}
              >
                {t(`our_services.${key}.subtitle`)}
              </p>
            </div>
            <img
              className="my-auto h-auto w-full"
              src={`/assets/services/${image}${theme === "light" ? "_w" : ""}.png`}
              loading="lazy"
              alt={t(`our_services.${key}.title`)}
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
                {t(`our_services.${key}.label`)} →
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurServices;