import { useContext } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { IconType } from "react-icons";
import { IoPeople } from "react-icons/io5";
import { BsRocketTakeoff } from "react-icons/bs";
import { FaCalendarDay } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";

import { AppContext } from "../../context/AppContext";

const quantities = [
  {
    icon: IoPeople,
    title: "97.000+",
    subtitle: "Gamers we Empowered",
    label:
      "Proudly serving a thriving community of passionate gamers worldwide",
    active: false,
  },
  {
    icon: BsRocketTakeoff,
    title: "180.000+",
    subtitle: "Orders Completed",
    label: "Boosting, Coaching, Accounts and we're just getting started",
    active: true,
  },
  {
    icon: FaCalendarDay,
    title: "2018",
    subtitle: "Operating Since",
    label: "That's all it took us to revolutionize the game services industry",
    active: false,
  },
  {
    icon: FaRankingStar,
    title: "800+",
    subtitle: "Pro Players",
    label: "The very best gamers stand ready to fulfill your orders",
    active: false,
  },
];

interface QuantityItemProps {
  icon?: IconType;
  title?: string;
  subtitle?: string;
  label?: string;
  active?: boolean;
}

export const QuantityItem: React.FC<QuantityItemProps> = (props) => {
  const { theme } = useContext(AppContext);
  const { t } = useTranslation();
  const { icon: Icon, title, subtitle, label, active } = props;

  return (
    <div className="w-full">
      {active ? (
        <div
          className={clsx(
            "relative flex h-[280px] flex-col justify-center overflow-hidden rounded-xl border border-[#3686fc] bg-[#0B6BFB] p-6 text-primary-foreground shadow-md transition-transform duration-300",
            "md:h-[340px]",
          )}
          style={{ boxShadow: "0px 15px 84px 0px rgba(11, 108, 251, 0.13)" }}
        >
          <div
            className={clsx(
              "flex h-12 w-12 items-center justify-center rounded-full bg-accent p-2 text-muted-foreground",
              "dark:bg-[#1C2233]",
            )}
          >
            {Icon && <Icon />}
          </div>
          <h3
            className={clsx(
              "font-display mt-3 text-5xl font-bold tracking-tight",
              "md:text-4xl",
            )}
          >
            {title}
          </h3>
          <p className="z-10 text-foreground">{subtitle && t(subtitle)}</p>
          <p className="secondary z-10 mt-auto text-sm text-foreground">
            {label && t(label)}.
          </p>

          <img
            src={`/assets/backgrounds/active_numbers.svg`}
            loading="lazy"
            className="absolute bottom-0 right-0 h-auto w-full overflow-hidden rounded-xl"
            alt={title}
          />
        </div>
      ) : (
        <div
          className={clsx(
            "relative flex h-[280px] flex-col justify-center overflow-hidden rounded-xl bg-card p-6 text-primary-foreground shadow-md transition-transform duration-300",
            "md:h-[340px]",
            "dark:bg-[#141825]/75",
          )}
          style={{ boxShadow: "0px 15px 84px 0px rgba(11, 108, 251, 0.13)" }}
        >
          <div
            className={clsx(
              "flex h-12 w-12 items-center justify-center rounded-full bg-accent p-2 text-muted-foreground",
              "dark:bg-[#1C2233]",
            )}
          >
            {Icon && <Icon />}
          </div>
          <h3
            className={clsx(
              "font-display mt-3 text-5xl font-bold tracking-tight text-foreground",
              "md:text-4xl",
            )}
          >
            {title}
          </h3>
          <p className="z-10 text-foreground">{subtitle && t(subtitle)}</p>
          <p className="secondary z-10 mt-auto text-sm text-foreground">
            {label && t(label)}
          </p>
          <img
            src={`/assets/backgrounds/inactive_numbers${
              theme === "light" ? "_w" : ""
            }.svg`}
            loading="lazy"
            className="absolute bottom-0 right-0 h-auto w-full overflow-hidden rounded-xl"
            alt={title}
          />
        </div>
      )}
    </div>
  );
};

const Quantity = () => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        "relative z-20 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4",
        "sm:px-6 xl:px-8",
      )}
    >
      <div
        className={clsx("flex w-full flex-col gap-2", "md:flex-row md:gap-0")}
      >
        <h2
          className={clsx(
            "font-display mx-auto text-center text-4xl font-bold text-foreground",
            "md:mx-0 md:max-w-sm md:text-start",
          )}
        >
          {t("CS2Boost in Numbers")}
        </h2>
        <p
          className={clsx(
            "secondary mx-auto mt-4 max-w-md text-center font-medium text-foreground",
            "md:ml-auto md:mr-0 md:mt-0 md:text-start",
          )}
        >
          {t(
            "Our team has united the most experienced people in the gaming industry, from all over the world, with one mission",
          )}
          :
          <span className="mt-1 block font-medium text-foreground">
            ‟{t("To truly change the life of every day gamers")}.”
          </span>
        </p>
      </div>
      <div
        className={clsx(
          "mt-20 grid w-full grid-cols-1 gap-5",
          "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        )}
      >
        {quantities.map((item, i) => (
          <QuantityItem key={i} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Quantity;
