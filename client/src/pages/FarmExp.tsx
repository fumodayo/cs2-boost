import { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap_white.css";
import Tooltip from "rc-tooltip";

import { totalExp } from "../utils/totalExp";
import Checkout from "../components/Checkout";
import DefaultPage from "../components/Layouts/DefaultPage";
import Info from "../components/Info";
import { AppContext } from "../context/AppContext";
import Board from "../components/Common/Board";

type ExtraOption = {
  name: string;
  option: string;
  extra: number;
};

const markOfExp = {
  0: (
    <div className="py-2">
      <span className="text-lg text-foreground">0</span>
    </div>
  ),
  5000: (
    <div className="py-2">
      <span className="text-lg text-foreground">5000</span>
    </div>
  ),
  10000: (
    <div className="py-2">
      <span className="text-lg text-foreground">10000</span>
    </div>
  ),
  12000: (
    <div className="py-2">
      <span className="text-lg text-foreground">12000</span>
    </div>
  ),
};

const extraOptions: ExtraOption[] = [
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
        subtitle: "Only players with prime can drop weekly",
      },
    ],
  },
  {
    tab: "Extra Options",
    isDisclosure: false,
    panel: [
      {
        id: 1,
        title: "Live Stream",
        subtitle: "Watch your booster's gameplay in real-time",
      },
      {
        id: 2,
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

const xpEarn = {
  "Game mode": [
    { label: "Arms Race" },
    { label: "Casual" },
    { label: "Competitive" },
    { label: "Deathmatch" },
    { label: "Wingman" },
  ],
  "XP multiplier": [
    { label: "1.0*score" },
    { label: "4.0*score" },
    { label: "30*rounds won" },
    { label: "0.2*score" },
    { label: "15*rounds won" },
  ],
};

const xpPenalty = {
  Approximate: [
    { label: "Less than 4,500 XP" },
    { label: "Between 4,500 XP and 7,500 XP" },
    { label: "Between 7,500 XP and 11,167 XP" },
    { label: "Greater than 11,167 XP" },
  ],
  "Bonus XP multiplier": [
    { label: "4.0 * gained XP (1x Earned XP + 3x Weekly XP Bonus" },
    { label: "2.0 * gained XP (1x Earned XP + 1x Weekly XP Bonus" },
    { label: "1.0 * gained XP (1x Earned XP, No Weekly XP Bonus" },
    { label: "0.175 * gained XP (0.175x Earned XP)" },
  ],
};

const FarmExp = () => {
  const { t } = useTranslation();
  const { theme } = useContext(AppContext);
  const [startPoint, setStartPoint] = useState(0);
  const [endPoint, setEndPoint] = useState(5000);

  const onChangeSliderValue = (value: number[]) => {
    setStartPoint(value[0]);
    setEndPoint(value[1]);
  };

  const totalTimeOfFarmExp = useMemo(() => {
    return Math.floor(totalExp(startPoint, endPoint) / 60);
  }, [startPoint, endPoint]);

  // Mỗi 1 exp = 100 VND
  const totalCostOfFarmExp = useMemo(() => {
    const total = totalExp(startPoint, endPoint) * 100;
    return total;
  }, [startPoint, endPoint]);

  console.log(startPoint);

  return (
    <DefaultPage>
      <main className="mt-8 grid grid-cols-1 items-start gap-5 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8">
        {/* BOOKING */}
        <div className="space-y-4 lg:col-span-2 lg:space-y-6 xl:col-span-3">
          {/* SLIDER RATING */}
          <div className="relative mb-6 mt-5 w-full overflow-hidden rounded-lg bg-card px-12 py-8">
            <div className="flex flex-col sm:flex-row">
              <div className="z-10 flex-grow">
                <h2 className="-ml-4 mb-2 text-start text-lg font-bold text-foreground">
                  {t("Select your current Exp and desired Exp")}
                </h2>
                <div className="-ml-4 mb-8 flex max-w-[250px] flex-col justify-start gap-1 text-muted-foreground">
                  <span className="flex justify-between">
                    <span className="font-bold">{t("My Exp")}:</span>
                    <span className="w-14 rounded-md bg-accent px-2">
                      {startPoint}
                    </span>
                  </span>
                  <span className="flex justify-between">
                    <span className="font-bold">{t("Desired Exp")}:</span>
                    <span className="w-14 rounded-md bg-accent px-2">
                      {endPoint}
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
                            zIndex={10}
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
                        borderColor: theme === "light" ? "#d8d8d8" : "#393939",
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
                      min={0}
                      max={12000}
                      step={100}
                      allowCross={false}
                      defaultValue={[0, 5000]}
                      marks={markOfExp}
                      onChange={(value) =>
                        onChangeSliderValue(value as number[])
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* INFO */}
          <Info
            title="All the important details about our Level Farming"
            serviceInfo={serviceInfo}
          />

          {/* PRICE */}
          <div className="w-full rounded-lg bg-card pb-10 pl-8 pr-8 pt-6 shadow-md">
            <div className="flex flex-col gap-4 pb-4">
              <p className="text-lg font-bold">{t("Earned XP")}</p>
              <p className="text-md mb-4 text-muted-foreground">
                {t(
                  "All important details about experience points of each mode",
                )}
              </p>
              <Board services={xpEarn} />
            </div>
          </div>

          {/* PRICE */}
          <div className="w-full rounded-lg bg-card pb-10 pl-8 pr-8 pt-6 shadow-md">
            <div className="flex flex-col gap-4 pb-4">
              <p className="text-lg font-bold">{t("XP Penalty")}</p>
              <p className="text-md mb-4 text-muted-foreground">
                {t("All important details about experience points")}
              </p>
              <Board services={xpPenalty} />
            </div>
          </div>
        </div>

        {/* CHECKOUT */}
        <Checkout
          beginText="My Exp"
          lastText="Desired Exp"
          server={"All"}
          mode="level-farming"
          title="level farming"
          currentExp={startPoint}
          desiredExp={endPoint}
          totalTime={totalTimeOfFarmExp}
          cost={totalCostOfFarmExp}
          extraOptions={extraOptions}
        />
      </main>
    </DefaultPage>
  );
};

export default FarmExp;
