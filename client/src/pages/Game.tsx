import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import clsx from "clsx";

import { FaRightToBracket } from "react-icons/fa6";
import {
  TbCircle1Filled,
  TbCircle2Filled,
  TbCircle3Filled,
} from "react-icons/tb";

import DefaultPage from "../components/Layouts/DefaultPage";
import Discovery from "../components/Discovery";
import SEO from "../components/SEO";

const stepToBuy = [
  {
    icon: TbCircle1Filled,
    label: "Choose between Premier and Wingman services",
  },
  {
    icon: TbCircle2Filled,
    label: "Pick the Boost service that fits your goals",
  },
  {
    icon: TbCircle3Filled,
    label: "Make a secured payment & enjoy your Boost",
  },
];

const boostingServices = [
  {
    id: 1,
    title: "What is Counter Strike 2 Boost",
    subtitle:
      "If you’re seeking to elevate your gaming experience in Counter Strike 2 but lack the time or dedication to climb the ranks on your own, you can explore the option of utilizing a CS2 boosting service. This service enables you to enlist the expertise of a skilled player who will play on your behalf and help you attain your desired rank",
  },
  {
    id: 2,
    title: "CS2 Boosting is it safe",
    subtitle:
      "When striving for progress in the gaming world, the preservation of your achievements becomes paramount. To guarantee a secure and discreet CS2 boost, we exclusively enlist the services of exceptional and trustworthy boosters, each equipped with our premium private VPN. This extensively tested approach has proven its effectiveness in countless games, providing you with peace of mind and assurance of a risk-free experience when utilizing our service",
  },
  {
    id: 3,
    title: "How can I be sure my Steam account won't be stolen",
    subtitle:
      "The combination of your unique login credentials and the protection provided by Steam Guard makes it virtually impossible for anyone to steal your account. We prioritize the utmost security measures to ensure your peace of mind and safeguard your valuable gaming assets",
  },
  {
    id: 4,
    title: "How does CS2 boosting work",
    subtitle:
      "CS2 boosting involves hiring professional players who will play on your account to help you achieve your desired rank. They use their skills and expertise to win matches and enhance your in-game performance",
  },
  {
    id: 5,
    title: "How long does CS2 boosting take",
    subtitle:
      "The duration of CS2 boosting depends on various factors, including your current rank and the desired rank. Generally, our boosters work efficiently to complete the boosting process as quickly as possible while maintaining the highest quality standards. You can check the estimated completion time for your specific order in our Members Area dashboard",
  },
];

const modeOfGame = [
  {
    title: "Premier",
    subtitle:
      "Elevate your ranking to new heights with our top-tier boosting service, enhancing your position effectively and remarkably",
    image: "premier",
    link: "premier",
  },
  {
    title: "Wingman",
    subtitle:
      "Unleash hidden power, ignite performance, and soar to the pinnacle with the premier optimized experience",
    image: "wingman",
    link: "wingman",
  },
];

const GameMode = ({
  title,
  subtitle,
  image,
  link,
}: {
  title: string;
  subtitle: string;
  image: string;
  link: string;
}) => {
  const { t } = useTranslation();

  return (
    <Link
      to={`/counter-strike-2/${link}`}
      className={clsx("group w-full", "hover:cursor-pointer")}
    >
      <div className="overflow-hidden rounded-2xl">
        <img
          src={`/assets/counter-strike-2/services/${image}.png`}
          alt={title}
          className={clsx(
            "h-80 w-full transform object-cover transition-transform duration-300 ",
            "group-hover:scale-110",
          )}
        />
      </div>
      <div
        className={clsx(
          "mt-4 h-28 rounded-2xl border border-border bg-card px-4 py-2 transition duration-300 ",
          "group-hover:bg-accent sm:h-36 sm:px-8 sm:py-4 md:h-32 lg:h-24",
        )}
      >
        <div className="flex items-center gap-2">
          <div className="w-full">
            <p className={clsx("text-base font-bold", "sm:text-lg")}>
              {t(title)}
            </p>
            <div className="flex justify-between">
              <p
                className={clsx("text-xs text-muted-foreground", "sm:text-sm")}
              >
                {t(subtitle)}
              </p>
              <FaRightToBracket
                className={clsx("text-xl text-muted-foreground", "sm:text-2xl")}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Game = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title="Counter Strike 2 Boosting, Coaching & Accounts"
        description="Buy High Quality CS2 Boosting and CS2 Accounts at the lowest price. 100% Secure. 24/7 Customer Support."
        href="/counter-strike-2"
      />

      <DefaultPage>
        <div>
          <div
            className={clsx(
              "col-span-4 my-4 flex w-full gap-8",
              "lg:col-span-4 xl:col-span-5",
            )}
          >
            <div className="flex w-full justify-between gap-4">
              {modeOfGame.map(({ title, subtitle, image, link }) => (
                <GameMode
                  key={title}
                  title={title}
                  subtitle={subtitle}
                  image={image}
                  link={link}
                />
              ))}
            </div>
          </div>
          <div
            className={clsx(
              "col-span-4 my-4 flex w-full gap-8",
              "lg:col-span-4 xl:col-span-5",
            )}
          >
            <div className="mt-14 flex w-full flex-col gap-20">
              <div
                className={clsx(
                  "mb-4 flex w-full flex-col items-stretch gap-10",
                  "md:flex-row",
                )}
              >
                <img
                  src={`/assets/counter-strike-2/services/How-to-buy.png`}
                  alt="How to buy Premier or Wingman Boost"
                  className="w-full max-w-[600px] rounded-2xl object-cover"
                />
                <div className="border-night-700 w-full space-y-4 rounded-2xl border p-7">
                  <div className="pb-8">
                    <h2 className="text-xl font-bold text-foreground">
                      {t("How Does Premier and Wingman Carry Work?")}
                    </h2>
                    <p className="text-muted-foreground">
                      {t(
                        "The fastest & easiest way to get your desired gear, rating, titles & achievements",
                      )}
                    </p>
                  </div>
                  <ul className="flex flex-col gap-6 space-y-2 text-muted-foreground">
                    {stepToBuy.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <item.icon className="text-4xl" />
                        <span>{t(item.label)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div
            className={clsx("relative w-full overflow-hidden pt-8", "sm:pt-12")}
          >
            <div className="relative flex w-full flex-col">
              <div className="flex flex-col">
                <h2
                  className={clsx(
                    "font-display text-xl font-bold tracking-tight text-foreground",
                    "sm:text-2xl",
                  )}
                >
                  <span>{t("FAQs About Counter Strike 2 Boosting")}</span>
                </h2>
                <div className="relative flex flex-col pt-5">
                  {boostingServices.map(({ title, subtitle }, idx) => (
                    <Discovery key={idx} title={title} subtitle={subtitle} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DefaultPage>
    </>
  );
};

export default Game;
