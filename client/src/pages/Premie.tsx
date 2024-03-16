import { useContext, useMemo, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap_white.css";
import DefaultPage from "../components/Layouts/DefaultPage";
import Checkout from "../components/Checkout";
import { totalTimeOfPremie } from "../utils/totalTimeOfPremie";
import { totalCostOfPremie } from "../utils/totalCostOfPremie";
import ChooseServer from "../components/ChooseServer";
import Info from "../components/Info";
import Board from "../components/Common/Board";
import { AppContext } from "../context/AppContext";
import Tooltip from "rc-tooltip";
import { useTranslation } from "react-i18next";

const markOfRanks = {
  1000: (
    <div className="py-2">
      <span className="text-base text-foreground">1000</span>
      <img
        src="/src/assets/counter-strike-2/premier/blue.png"
        alt="rank"
        className="mt-2 h-full w-20"
      />
    </div>
  ),
  5000: (
    <div className="py-2">
      <span className="text-base text-foreground">5000</span>
      <img
        src="/src/assets/counter-strike-2/premier/cyan.png"
        alt="rank"
        className="mt-2 h-full w-20"
      />
    </div>
  ),
  10000: (
    <div className="py-2">
      <span className="text-base text-foreground">10000</span>
      <img
        src="/src/assets/counter-strike-2/premier/blue.png"
        alt="rank"
        className="mt-2 h-full w-20"
      />
    </div>
  ),
  15000: (
    <div className="py-2">
      <span className="text-base text-foreground">15000</span>
      <img
        src="/src/assets/counter-strike-2/premier/purple.png"
        alt="rank"
        className="mt-2 h-full w-20"
      />
    </div>
  ),
  20000: (
    <div className="py-2">
      <span className="text-base text-foreground">20000</span>
      <img
        src="/src/assets/counter-strike-2/premier/pink.png"
        alt="rank"
        className="mt-2 h-full w-20"
      />
    </div>
  ),
  25000: (
    <div className="py-2">
      <span className="text-base text-foreground">25000</span>
      <img
        src="/src/assets/counter-strike-2/premier/red.png"
        alt="rank"
        className="mt-2 h-full w-20"
      />
    </div>
  ),
  30000: (
    <div className="py-2">
      <span className="text-base text-foreground">30000</span>
      <img
        src="/src/assets/counter-strike-2/premier/gold.png"
        alt="rank"
        className="mt-2 h-full w-20"
      />
    </div>
  ),
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
  const { theme } = useContext(AppContext);
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
                  <div className="-ml-4 mb-8 flex max-w-[250px] flex-col justify-start gap-1 text-muted-foreground">
                    <span className="flex justify-between">
                      <span className="font-bold">{t("My Rating")}:</span>
                      <span className="w-14 rounded-md bg-accent px-2">
                        {currentRating}
                      </span>
                    </span>
                    <span className="flex justify-between">
                      <span className="font-bold">{t("Desired Rating")}:</span>
                      <span className="w-14 rounded-md bg-accent px-2">
                        {desiredRating}
                      </span>
                    </span>
                  </div>
                  <div className="flex">
                    <div className="mb-16 w-full pl-[14px] pr-5">
                      <Slider
                        className="mt-4"
                        handleRender={(node, handleProps) => {
                          return (
                            <Tooltip
                              visible={true}
                              showArrow={false}
                              overlayInnerStyle={{
                                minHeight: "auto",
                                borderRadius: "20px",
                                border: "none",
                                outline: "none",
                                background: "none",
                                fontSize: "14px",
                                fontWeight: "bold",
                                color: theme === "light" ? "#000" : "#fff",
                              }}
                              overlay={handleProps.value}
                              placement="top"
                            >
                              {node}
                            </Tooltip>
                          );
                        }}
                        range
                        trackStyle={{
                          backgroundColor: "#3071f0",
                          height: 15,
                        }}
                        railStyle={{
                          height: 15,
                          borderRadius: "1rem",
                          borderWidth: "1px",
                          backgroundColor:
                            theme === "light" ? "white" : "#13151b",
                          borderColor:
                            theme === "light" ? "#d8d8d8" : "#393939",
                          boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 4px 0px inset",
                          right: "10px",
                        }}
                        handleStyle={{
                          borderColor: "white",
                          background: "#d8d8d8",
                          opacity: 1,
                          borderWidth: "8px",
                          height: "30px",
                          width: "30px",
                          marginTop: "-9px",
                          backgroundColor: "#d8d8d8",
                          outline: "1px solid #f2f2f2",
                          boxShadow:
                            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.19)",
                        }}
                        min={1000}
                        max={30000}
                        step={100}
                        allowCross={false}
                        defaultValue={[1000, 10000]}
                        onChange={(value) =>
                          onChangeSliderValue(value as number[])
                        }
                        marks={markOfRanks}
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
          mode="premier"
          currentRating={currentRating}
          desiredRating={desiredRating}
          totalTime={totalTimeOfBoostPremie}
          cost={totalCostOfBoostPremie}
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
        <Board services={coefficientPremierEarn} />
      </div>
    </DefaultPage>
  );
};

export default Premie;
