import { useMemo, useState } from "react";
import ChooseServer from "../components/ChooseServer";
import DefaultPage from "../components/Layouts/DefaultPage";
import Checkout from "../components/Checkout";
import ChooseRank from "../components/WingMan/ChooseRank";
import Info from "../components/Info";
import { totalTimeOfWingman } from "../utils/totalTimeOfWingman";
import { totalCostOfWingman } from "../utils/totalCostOfWingman";
import Board from "../components/Common/Board";
import { useTranslation } from "react-i18next";

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
        subtitle: "Only players with prime can play competitive",
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

const coefficientRankEarn = {
  "Rating/ Server": [
    { label: "Silver I", note: "Rank" },
    { label: "Silver II" },
    { label: "Silver III" },
    { label: "Silver IV" },
    { label: "Silver Elite" },
    { label: "Silver Elite Master" },
    { label: "Gold Nova I" },
    { label: "Gold Nova II" },
    { label: "Gold Nova III" },
    { label: "Gold Nova Master" },
    { label: "Master Guardian I" },
    { label: "Master Guardian II" },
    { label: "Master Guardian Elite" },
    { label: "Distinguished Master Guardian" },
    { label: "Legendary Eagle" },
    { label: "Legendary Eagle Master" },
    { label: "Supreme Master First Class" },
    { label: "The Global Elite" },
  ],
  "Africa (AF)": [
    { label: 1, note: "Coefficient calculated by region" },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1.5 },
    { label: 1.5 },
    { label: 1.5 },
    { label: 2 },
    { label: 2 },
    { label: 2 },
    { label: 2 },
    { label: 4 },
  ],
  "Asia (AS)": [
    { label: 1, note: "Coefficient calculated by region" },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1.5 },
    { label: 1.5 },
    { label: 1.5 },
    { label: 1.5 },
    { label: 2 },
    { label: 2 },
    { label: 2 },
    { label: 4 },
    { label: 4 },
    { label: 4 },
    { label: 4 },
    { label: 8 },
  ],
  "Australia (AU)": [
    { label: 1, note: "Coefficient calculated by region" },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1.5 },
    { label: 1.5 },
    { label: 1.5 },
    { label: 2 },
    { label: 2 },
    { label: 2 },
    { label: 2 },
    { label: 4 },
  ],
  "China (CN)": [
    { label: 1, note: "Coefficient calculated by region" },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1.5 },
    { label: 1.5 },
    { label: 1.5 },
    { label: 1.5 },
    { label: 2 },
    { label: 2 },
    { label: 2 },
    { label: 4 },
    { label: 4 },
    { label: 4 },
    { label: 4 },
    { label: 8 },
  ],
  "Europe (EU)": [
    { label: 1, note: "Coefficient calculated by region" },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1.5 },
    { label: 1.5 },
    { label: 1.5 },
    { label: 2 },
    { label: 2 },
    { label: 2 },
    { label: 2 },
    { label: 4 },
  ],
  "North America (NA)": [
    { label: 1, note: "Coefficient calculated by region" },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1.5 },
    { label: 1.5 },
    { label: 1.5 },
    { label: 2 },
    { label: 2 },
    { label: 2 },
    { label: 2 },
    { label: 4 },
  ],
  "South America (SA)": [
    { label: 1, note: "Coefficient calculated by region" },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1 },
    { label: 1.5 },
    { label: 1.5 },
    { label: 1.5 },
    { label: 1.5 },
    { label: 2 },
    { label: 2 },
    { label: 2 },
    { label: 4 },
    { label: 4 },
    { label: 4 },
    { label: 4 },
    { label: 8 },
  ],
};

const Wingman = () => {
  const { t } = useTranslation();
  const [server, setServer] = useState<string>("");
  const [currentRank, setCurrentRank] = useState("silver_1");
  const [desiredRank, setDesiredRank] = useState("silver_2");

  const onChooseServer = (value: string) => {
    setServer(value);
  };

  const totalTimeOfBoostWingman = useMemo(() => {
    const totalTime = totalTimeOfWingman(currentRank, desiredRank);
    return Math.floor(totalTime / 60);
  }, [currentRank, desiredRank]);

  const totalCostOfBoostWingman = useMemo(() => {
    const total = totalCostOfWingman(currentRank, desiredRank, server);
    return total;
  }, [currentRank, desiredRank, server]);

  return (
    <DefaultPage>
      <main className="mt-8 grid grid-cols-1 items-start gap-5 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8">
        {/* BOOKING */}
        <div className="space-y-4 lg:col-span-2 lg:space-y-6 xl:col-span-3">
          <div className="flex flex-col gap-y-4">
            {/* CHOOSE SERVER */}
            <ChooseServer server={server} onChooseServer={onChooseServer} />
            {server && (
              <>
                {/* CURRENT RANK */}
                <ChooseRank
                  title="Current Rank"
                  subtitle="Select your current tier and division"
                  rank={currentRank}
                  setRank={setCurrentRank}
                />

                {/* DESIRED RANK */}
                <ChooseRank
                  title="Desired Rank"
                  subtitle="Select your desired tier and division"
                  rank={desiredRank}
                  setRank={setDesiredRank}
                />
              </>
            )}

            {/* INFO */}
            <Info
              title="All the important details about our Wingman Boost"
              serviceInfo={serviceInfo}
            />
          </div>
        </div>

        {/* CHECKOUT */}
        <Checkout
          beginText="My Rank"
          lastText="Desired Rank"
          server={server}
          title="wingman"
          mode="wingman"
          currentRanking={currentRank}
          desiredRanking={desiredRank}
          totalTime={totalTimeOfBoostWingman}
          cost={totalCostOfBoostWingman}
          extraOptions={extraOptions}
        />
      </main>
      <div className="mt-6 flex w-full flex-col items-center justify-center space-y-2 rounded-lg bg-card py-10 shadow-md">
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
        <Board services={coefficientRankEarn} />
      </div>
    </DefaultPage>
  );
};

export default Wingman;
