import { RadioGroup } from "@headlessui/react";
import Tooltip from "../Tooltip";
import { useTranslation } from "react-i18next";

interface ChooseRankProps {
  title: string;
  subtitle: string;
  rank: string;
  setRank: (value: string) => void;
}

type RankOption = {
  name: string;
  value: string;
  image: string;
};

const rankOptions: RankOption[] = [
  {
    name: "Silver 1",
    value: "silver_1",
    image: "SILVER_1__WINGAME",
  },
  {
    name: "Silver 2",
    value: "silver_2",
    image: "SILVER_2__WINGAME",
  },
  {
    name: "Silver 3",
    value: "silver_3",
    image: "SILVER_3__WINGAME",
  },
  {
    name: "Silver 4",
    value: "silver_4",
    image: "SILVER_4__WINGAME",
  },
  {
    name: "Silver Elite",
    value: "silver_elite",
    image: "SILVER_ELITE__WINGAME",
  },
  {
    name: "Silver Elite Master",
    value: "silver_elite_master",
    image: "SILVER_ELITE_MASTER__WINGAME",
  },
  {
    name: "Glob Nova 1",
    value: "glob_nova_1",
    image: "GOLD_NOVA_1__WINGAME",
  },
  {
    name: "Glob Nova 2",
    value: "glob_nova_2",
    image: "GOLD_NOVA_2__WINGAME",
  },
  {
    name: "Glob Nova 3",
    value: "glob_nova_3",
    image: "GOLD_NOVA_3__WINGAME",
  },
  {
    name: "Glob Nova Master",
    value: "glob_nova_master",
    image: "GOLD_NOVA_MASTER__WINGAME",
  },
  {
    name: "Master Guardian 1",
    value: "master_guardian_1",
    image: "MASTER_GUADIAN_1__WINGAME",
  },
  {
    name: "Master Guardian 2",
    value: "master_guardian_2",
    image: "MASTER_GUARDIAN_2__WINGAME",
  },
  {
    name: "Master Guardian Elite",
    value: "master_guardian_elite",
    image: "MASTER_GUARDIAN_ELITE__WINGAME",
  },
  {
    name: "Distinguished Master Guardian",
    value: "distinguished_master_guardian",
    image: "DISTINGUISHED__MASTER__GUARDIAN__WINGAME",
  },
  {
    name: "Legendary Eagle",
    value: "legendary_eagle",
    image: "LEGENDARY__EAGLE__WINGAME",
  },
  {
    name: "Legendary Eagle Master",
    value: "legendary_eagle_master",
    image: "LEGENDARY__EAGLE__MASTER__WINGAME",
  },
  {
    name: "Supreme",
    value: "supreme",
    image: "SUPREME__WINGAME",
  },
  {
    name: "Global Elite",
    value: "global_elite",
    image: "GLOBAL_ELITE__WINGAME",
  },
];

const ChooseRank: React.FC<ChooseRankProps> = ({
  title,
  subtitle,
  rank,
  setRank,
}) => {
  const { t } = useTranslation();
  const selectedRank = rankOptions.find((item) => item.value === rank);

  return (
    <div className="-mx-4 border bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl sm:shadow-md">
      <div className="bg-rank-gradient grad-league-of-legends-master flex flex-col space-y-1.5 border-b border-border px-4 py-6 sm:rounded-t-xl sm:px-6">
        <div className="flex items-center gap-x-4">
          <div className="dark:bg-night-input-bg flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border p-3 text-white shadow-sm sm:h-20 sm:w-20">
            {selectedRank && (
              <img
                src={`/src/assets/counter-strike-2/wingman/${selectedRank.image}.png`}
                alt={selectedRank.name}
                className="w-20"
              />
            )}
          </div>
          <div>
            <h4 className="font-display text-lg font-medium leading-6 text-foreground">
              {t(title)}
            </h4>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {t(subtitle)}.
            </p>
          </div>
        </div>
      </div>

      {/* CHOOSE RANK */}
      <div className="space-y-2 px-4 py-6 sm:px-6">
        <RadioGroup
          value={rank}
          onChange={(value) => setRank(value)}
          className="flex flex-wrap gap-2"
        >
          {rankOptions.map((item) => (
            <Tooltip content={item.name}>
              <RadioGroup.Option
                className="max-w-[80px] flex-grow sm:max-w-none sm:flex-grow-0"
                value={item.value}
              >
                {({ checked }) => (
                  <div
                    data-tippy-content="Tooltip"
                    className={
                      checked
                        ? "flex cursor-pointer items-center justify-center rounded-md bg-radio px-5 py-2 text-base font-medium uppercase text-foreground outline-none ring-1 ring-field-ring-hover/60 disabled:cursor-not-allowed disabled:opacity-25"
                        : "flex cursor-pointer items-center justify-center rounded-md bg-radio/20 px-5 py-2 text-base font-medium uppercase outline-none ring-1 ring-field-ring/30 hover:bg-radio/60 disabled:cursor-not-allowed disabled:opacity-25"
                    }
                  >
                    <img
                      src={`/src/assets/counter-strike-2/wingman/${item.image}.png`}
                      alt={item.value}
                      className="w-16"
                    />
                  </div>
                )}
              </RadioGroup.Option>
            </Tooltip>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default ChooseRank;
