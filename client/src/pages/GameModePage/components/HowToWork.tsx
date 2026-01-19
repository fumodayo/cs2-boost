import { useTranslation } from "react-i18next";
import {
  TbCircleNumber1Filled,
  TbCircleNumber2Filled,
  TbCircleNumber3Filled,
} from "react-icons/tb";
import { v4 as uuidv4 } from "uuid";

const listStepsData = [
  { key: "step1", icon: TbCircleNumber1Filled },
  { key: "step2", icon: TbCircleNumber2Filled },
  { key: "step3", icon: TbCircleNumber3Filled },
];

const HowToWork = () => {
  const { t } = useTranslation("game_mode");

  return (
    <div className="col-span-4 my-4 flex w-full gap-8 lg:col-span-4 xl:col-span-5">
      <div className="mt-14 flex w-full flex-col gap-20">
        <div className="mb-4 flex w-full flex-col items-stretch gap-10 md:flex-row">
          {/* BANNER */}
          <img
            className="w-full max-w-[600px] rounded-2xl object-cover"
            src="/assets/games/counter-strike-2/services/how-to-buy.png"
            alt="banner"
          />

          {/* CONTENT */}
          <div className="w-full space-y-4 rounded-2xl border p-7">
            {/* TITLE */}
            <div className="pb-8">
              <h2 className="text-xl font-bold text-foreground">
                {t("how_to_work.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("how_to_work.subtitle")}
              </p>
            </div>

            {/* LIST */}
            <ul className="flex flex-col gap-6 space-y-2 text-muted-foreground">
              {listStepsData.map(({ key, icon: Icon }) => (
                <li key={uuidv4()} className="flex items-center gap-2">
                  <Icon size={36} />
                  <span>{t(`how_to_work.steps.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToWork;