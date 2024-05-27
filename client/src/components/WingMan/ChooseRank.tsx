import clsx from "clsx";
import { RadioGroup } from "@headlessui/react";
import { useTranslation } from "react-i18next";

import Tooltip from "../Tooltip";
import { rankOptions } from "../../constants";

interface ChooseRankProps {
  title: string;
  subtitle: string;
  rank: string;
  setRank: (value: string) => void;
}

const ChooseRank: React.FC<ChooseRankProps> = ({
  title,
  subtitle,
  rank,
  setRank,
}) => {
  const { t } = useTranslation();
  const selectedRank = rankOptions.find((item) => item.value === rank);

  return (
    <div
      className={clsx(
        "-mx-4 border border-border bg-card text-card-foreground shadow-sm",
        "sm:mx-0 sm:rounded-xl sm:shadow-md",
      )}
    >
      <div
        className={clsx(
          "bg-rank-gradient grad-league-of-legends-master flex flex-col space-y-1.5 border-b border-border px-4 py-6",
          "sm:rounded-t-xl sm:px-6",
        )}
      >
        <div className="flex items-center gap-x-4">
          <div
            className={clsx(
              "dark:bg-night-input-bg",
              "flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border p-3 text-white shadow-sm",
              "sm:h-20 sm:w-20",
            )}
          >
            {selectedRank && (
              <img
                src={`/public/assets/counter-strike-2/wingman/${selectedRank.image}.png`}
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
            <Tooltip key={item.name} content={item.name}>
              <RadioGroup.Option
                className={clsx(
                  "max-w-[80px] flex-grow",
                  "sm:max-w-none sm:flex-grow-0",
                )}
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
                      src={`/public/assets/counter-strike-2/wingman/${item.image}.png`}
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
