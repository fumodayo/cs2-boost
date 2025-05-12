import { useTranslation } from "react-i18next";
import { IconType } from "react-icons";
import { BsRocketTakeoff } from "react-icons/bs";
import { FaCalendarDay, FaRankingStar } from "react-icons/fa6";
import { IoPeople } from "react-icons/io5";
import cn from "~/libs/utils";
import { v4 as uuidv4 } from "uuid";

interface ICardProps {
  icon: IconType;
  title: string;
  subtitle: string;
  label: string;
  isActive: boolean;
}

const cards: ICardProps[] = [
  {
    icon: IoPeople,
    title: "97.000+",
    subtitle: "Gamers we Empowered",
    label:
      "Proudly serving a thriving community of passionate gamers worldwide",
    isActive: false,
  },
  {
    icon: BsRocketTakeoff,
    title: "180.000+",
    subtitle: "Orders Completed",
    label: "Boosting, Coaching, Accounts and we're just getting started",
    isActive: true,
  },
  {
    icon: FaCalendarDay,
    title: "2018",
    subtitle: "Operating Since",
    label: "That's all it took us to revolutionize the game services industry",
    isActive: false,
  },
  {
    icon: FaRankingStar,
    title: "800+",
    subtitle: "Partners",
    label: "The very best gamers stand ready to fulfill your orders",
    isActive: false,
  },
];

const Card = ({ icon: Icon, title, subtitle, label, isActive }: ICardProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      {isActive ? (
        <div
          className={cn(
            "relative flex h-[280px] flex-col justify-center overflow-hidden rounded-xl border border-[#3686fc] bg-[#0B6BFB] p-6 shadow-md transition-transform duration-300",
            "md:h-[340px]",
          )}
          style={{ boxShadow: "0px 15px 84px 0px rgba(11, 108, 251, 0.13)" }}
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full bg-black/10 p-2 text-primary-foreground",
              "dark:bg-white/10",
            )}
          >
            {Icon && <Icon />}
          </div>
          <h3
            className={cn(
              "font-display mt-3 text-5xl tracking-tight text-primary-foreground",
              "md:text-4xl",
            )}
          >
            {title}
          </h3>
          <p className="z-10 text-primary-foreground">
            {t(`QuantityClient.card.subtitle.${subtitle}`)}
          </p>
          <p className="z-10 mt-auto text-sm text-primary-foreground">
            {t(`QuantityClient.card.label.${label}`)}
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
          className={cn(
            "relative flex h-[280px] flex-col justify-center overflow-hidden rounded-xl bg-card p-6 shadow-md transition-transform duration-300",
            "dark:bg-[#141825]/75",
            "md:h-[340px]",
          )}
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full bg-accent p-2 text-muted-foreground",
              "dark:bg-[#1C2233]",
            )}
          >
            <Icon size={20} />
          </div>
          <h3
            className={cn(
              "font-display mt-3 text-5xl font-bold tracking-tight text-foreground",
              "md:text-4xl",
            )}
          >
            {title}
          </h3>
          <p className="z-10 text-foreground/90">
            {t(`QuantityClient.card.subtitle.${subtitle}`)}
          </p>
          <p className="secondary z-10 mt-auto text-sm text-foreground/90">
            {t(`QuantityClient.card.label.${label}`)}
          </p>
          <img
            className="absolute bottom-0 right-0 h-auto w-full overflow-hidden rounded-xl"
            loading="lazy"
            src="/assets/backgrounds/active_numbers.svg"
            alt="icon"
          />
        </div>
      )}
    </div>
  );
};

const QuantityClient = () => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "relative z-20 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4",
        "sm:px-6 xl:px-8",
      )}
    >
      <div className={cn("flex w-full flex-col gap-2", "md:flex-row md:gap-0")}>
        <h2
          className={cn(
            "font-display mx-auto text-center text-4xl font-bold text-foreground",
            "md:mx-0 md:max-w-xs md:text-start",
          )}
        >
          {t("QuantityClient.heading")}
        </h2>
        <p
          className={cn(
            "secondary mx-auto mt-4 max-w-md text-center font-medium text-foreground/90",
            "md:ml-auto md:mr-0 md:mt-0 md:text-start",
          )}
        >
          {t("QuantityClient.subheading")}
          <span className="mt-1 block font-medium text-foreground">
            {t("QuantityClient.quotes")}
          </span>
        </p>
      </div>
      <div
        className={cn(
          "mt-20 grid w-full grid-cols-1 gap-5",
          "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        )}
      >
        {cards.map((props) => (
          <Card key={uuidv4()} {...props} />
        ))}
      </div>
    </div>
  );
};

export default QuantityClient;
