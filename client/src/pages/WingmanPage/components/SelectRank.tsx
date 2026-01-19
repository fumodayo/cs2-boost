import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import Tooltip from "~/components/@radix-ui/Tooltip";
import { IWingmanRankRate } from "~/types";

interface ISelectRankProps {
  title: string;
  subtitle: string;
  ranks: IWingmanRankRate[];
  selectedValue?: string;
  setSelectedValue: (value: string) => void;
}

const SelectRank = ({
  title,
  subtitle,
  ranks,
  selectedValue,
  setSelectedValue,
}: ISelectRankProps) => {
  const selectedRankImage =
    ranks.find((rank) => rank.code === selectedValue)?.image || ranks[0]?.image;

  return (
    <div className="-mx-4 border border-border bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl sm:shadow-md">
      {/* HEADER */}
      <div className="flex flex-col space-y-1.5 border-b border-border px-4 py-6 sm:rounded-t-xl sm:px-6">
        <div className="flex items-center gap-x-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border p-3 shadow-sm sm:h-20 sm:w-20">
            {selectedRankImage && (
              <img
                className="w-20"
                src={`/assets/games/counter-strike-2/wingman/${selectedRankImage}.png`}
                alt="Selected Rank"
              />
            )}
          </div>
          <div>
            <h4 className="font-display text-lg font-medium leading-6 text-foreground">
              {title}
            </h4>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
      {/* CONTENT */}
      <div className="space-y-2 px-4 py-6 sm:px-6">
        <RadioGroupPrimitive.Root
          value={selectedValue}
          onValueChange={setSelectedValue}
          className="flex flex-wrap gap-2"
        >
          {ranks.map(({ name, code, image }) => (
            <RadioGroupPrimitive.Item
              key={code}
              className={`max-w-[80px] flex-grow cursor-pointer rounded-md transition-colors duration-200 sm:max-w-none sm:flex-grow-0 ${selectedValue === code ? "bg-radio ring-1 ring-field-ring-hover/60" : "bg-radio/20 hover:bg-radio/60"} `}
              value={code}
            >
              <Tooltip content={name}>
                <div className="flex cursor-pointer items-center justify-center rounded-md bg-radio/20 px-5 py-2 text-base font-medium uppercase outline-none ring-1 ring-field-ring/30 hover:bg-radio/60 disabled:cursor-not-allowed disabled:opacity-25">
                  <img
                    className="w-16"
                    src={`/assets/games/counter-strike-2/wingman/${image}.png`}
                    alt={name}
                  />
                </div>
              </Tooltip>
            </RadioGroupPrimitive.Item>
          ))}
        </RadioGroupPrimitive.Root>
      </div>
    </div>
  );
};

export default SelectRank;