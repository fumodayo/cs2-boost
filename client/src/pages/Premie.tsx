import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap_white.css";

import { totalTimeOfPremie } from "../utils/totalTimeOfPremie";
import { totalCostOfPremie } from "../utils/totalCostOfPremie";
import DefaultPage from "../components/Layouts/DefaultPage";
import Checkout from "../components/Checkout";
import ChooseServer from "../components/ChooseServer";
import Info from "../components/Info";
import Board from "../components/Common/Board";
import SEO from "../components/SEO";
import Range from "../components/Range";

const MarkOfRating = ({ point, rank }: { point: string; rank: string }) => (
  <div className="py-2">
    <span className="text-xs text-foreground md:text-base">{point}</span>
    <img
      src={`/assets/counter-strike-2/premier/${rank}.png`}
      alt={point}
      className="mt-2 h-full w-10 md:w-20"
    />
  </div>
);

const markOfRanks = {
  5000: <MarkOfRating point="5000" rank="cyan" />,
  10000: <MarkOfRating point="10000" rank="blue" />,
  15000: <MarkOfRating point="15000" rank="purple" />,
  20000: <MarkOfRating point="20000" rank="pink" />,
  25000: <MarkOfRating point="25000" rank="red" />,
};

type ExtraOption = {
  name: string;
  option: string;
  extra: number;
};

const extraOptions: ExtraOption[] = [
  {
    name: "Play with Booster (Duo)",
    option: "play with booster",
    extra: 15,
  },
  {
    name: "Live Stream",
    option: "live stream",
    extra: 15,
  },
  {
    name: "Priority Order",
    option: "priority order",
    extra: 10,
  },
];

const serviceInfo = [
  {
    tab: "Requirements",
    isDisclosure: false,
    panel: [
      {
        id: 1,
        title: "Have prime",
        subtitle: "Only players with prime can play premier",
      },
      {
        id: 2,
        title: "Complete the first 10 matches",
        subtitle: "We need your starting rank to conveniently boost",
      },
    ],
  },
  {
    tab: "Extra Options",
    isDisclosure: false,
    panel: [
      {
        id: 1,
        title: "Play with Booster (Duo)",
        subtitle: "Your booster will team up with you in duo mode",
      },
      {
        id: 2,
        title: "Live Stream",
        subtitle: "Watch your booster's gameplay in real-time",
      },
      {
        id: 3,
        title: "Priority Order",
        subtitle: "Get your order prioritized for faster completion",
      },
    ],
  },
  {
    tab: "FAQ",
    isDisclosure: true,
    panel: [
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
    ],
  },
];

const coefficientPremierEarn = {
  "Rating/ Server": [
    { label: "1000->4999", note: "Rating score" },
    { label: "5,000->9,999" },
    { label: "10,000->14,999" },
    { label: "15,000->19,999" },
    { label: "20,000->24,999" },
    { label: "25,000->29,999" },
    { label: "30,000+" },
  ],
  "Africa (AF)": [
    { label: 1, note: "Coefficient calculated by region" },
    { label: 1 },
    { label: 2 },
    { label: 4 },
    { label: 8 },
    { label: 16 },
    { label: 32 },
  ],
  "Asia (AS)": [
    { label: 1, note: "Coefficient calculated by region" },
    { label: 2 },
    { label: 4 },
    { label: 8 },
    { label: 16 },
    { label: 32 },
    { label: 64 },
  ],
  "Australia (AU)": [
    { label: 1, note: "Coefficient calculated by region" },
    { label: 1.2 },
    { label: 2.4 },
    { label: 4.8 },
    { label: 9.6 },
    { label: 19.2 },
    { label: 38.4 },
  ],
  "China (CN)": [
    { label: 1, note: "Coefficient calculated by region" },
    { label: 1.5 },
    { label: 3 },
    { label: 6 },
    { label: 12 },
    { label: 24 },
    { label: 48 },
  ],
  "Europe (EU)": [
    { label: 1, note: "Coefficient calculated by region" },
    { label: 1.2 },
    { label: 2.4 },
    { label: 4.8 },
    { label: 9.6 },
    { label: 19.2 },
    { label: 38.4 },
  ],
  "North America (NA)": [
    { label: 1, note: "Coefficient calculated by region" },
    { label: 1.2 },
    { label: 2.4 },
    { label: 4.8 },
    { label: 9.6 },
    { label: 19.2 },
    { label: 38.4 },
  ],
  "South America (SA)": [
    { label: 1, note: "Coefficient calculated by region" },
    { label: 1.2 },
    { label: 2.4 },
    { label: 4.8 },
    { label: 9.6 },
    { label: 19.2 },
    { label: 38.4 },
  ],
  "Earn Point": [
    { label: 500, note: "Premier points earned per win (estimated)" },
    { label: 500 },
    { label: 400 },
    { label: 300 },
    { label: 200 },
    { label: 100 },
    { label: 50 },
  ],
};

const Premie = () => {
  const { t } = useTranslation();
  const [currentRating, setCurrentRating] = useState(1000);
  const [desiredRating, setDesiredRating] = useState(10000);

  const [server, setServer] = useState("");

  const onChangeSliderValue = (value: number[]) => {
    setCurrentRating(value[0]);
    setDesiredRating(value[1]);
  };

  const onChooseServer = (value: string) => {
    setServer(value);
  };

  const totalTimeOfBoostPremie = useMemo(() => {
    return Math.floor(totalTimeOfPremie(currentRating, desiredRating) / 60);
  }, [currentRating, desiredRating]);

  const totalCostOfBoostPremie = useMemo(() => {
    const total = totalCostOfPremie(currentRating, desiredRating, server);
    return total;
  }, [currentRating, desiredRating, server]);

  return (
    <>
      <SEO
        title="CS2 Premier Boost | High Quality CS2 Boost & Elo Boost"
        description="Buy High Quality CS2 Boosting and CS2 Accounts at the lowest price. 100% Secure. 24/7 Customer Support."
        href="/counter-strike-2/premier"
      />

      <DefaultPage>
        <main className="mt-8 grid grid-cols-1 items-start gap-5 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8">
          {/* BOOKING */}
          <div className="space-y-4 lg:col-span-2 lg:space-y-6 xl:col-span-3">
            {/* CHOOSE SERVER */}
            <ChooseServer server={server} onChooseServer={onChooseServer} />

            {/* SLIDER RATING */}
            {server && (
              <div className="relative mb-6 mt-5 w-full overflow-hidden rounded-lg bg-card px-12 py-8">
                <div className="flex flex-col sm:flex-row">
                  <div className="z-10 flex-grow">
                    <h2 className="-ml-4 mb-2 text-start text-lg font-bold text-foreground">
                      {t("Select your current Rating and desired Rating")}
                    </h2>
                    <p className="-ml-4 -mt-2 mb-4 text-sm text-muted-foreground">
                      (
                      {t(
                        "note: ratings above 20000 are only available as piloted service",
                      )}
                      )
                    </p>
                    <div className="-ml-4 mb-8 flex max-w-[250px] flex-col justify-start gap-1 text-sm text-muted-foreground md:text-base">
                      <span className="flex justify-between">
                        <span className="font-bold">{t("My Rating")}:</span>
                        <span className="w-14 rounded-md bg-accent px-2 md:w-16">
                          {currentRating}
                        </span>
                      </span>
                      <span className="flex justify-between">
                        <span className="font-bold">
                          {t("Desired Rating")}:
                        </span>
                        <span className="w-14 rounded-md bg-accent px-2 md:w-16">
                          {desiredRating}
                        </span>
                      </span>
                    </div>
                    <div className="flex">
                      <div className="mb-16 w-full pl-[14px] pr-5">
                        <Range
                          min={1000}
                          max={30000}
                          step={100}
                          defaultValue={[5000, 15000]}
                          marks={markOfRanks}
                          onChange={(value) =>
                            onChangeSliderValue(value as number[])
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* INFO */}
            <Info
              title="All the important details about our Premier Boost"
              serviceInfo={serviceInfo}
            />
          </div>

          {/* CHECKOUT */}
          <Checkout
            beginText="My Rating"
            lastText="Desired Rating"
            server={server}
            title="premier"
            mode="premier"
            currentRating={currentRating}
            desiredRating={desiredRating}
            totalTime={totalTimeOfBoostPremie}
            cost={totalCostOfBoostPremie}
            extraOptions={extraOptions}
          />
        </main>
        <div className="mt-6 hidden w-full flex-col items-center justify-center space-y-2 rounded-lg bg-card py-10 shadow-md md:flex">
          <div className="flex flex-col items-center">
            <p className="text-lg font-bold">{t("Price list")}</p>
            <p className="text-md mb-4 text-muted-foreground">
              (
              {t(
                "The estimated amount does not take into account additional costs",
              )}
              )
            </p>
          </div>
          <Board services={coefficientPremierEarn} />
        </div>
      </DefaultPage>
    </>
  );
};

export default Premie;
