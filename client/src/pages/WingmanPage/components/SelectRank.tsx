import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import Tooltip from "~/components/@radix-ui/Tooltip";
import { listOfRanks } from "~/constants/games";

interface ISelectRankProps {
  title: string;
  subtitle: string;
  selectedValue?: string;
  setSelectedValue: (value: string) => void;
}

const SelectRank = ({
  title,
  subtitle,
  selectedValue,
  setSelectedValue,
}: ISelectRankProps) => {
  return (
    <div className="-mx-4 border border-border bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl sm:shadow-md">
      {/* HEADER */}
      <div className="flex flex-col space-y-1.5 border-b border-border px-4 py-6 sm:rounded-t-xl sm:px-6">
        <div className="flex items-center gap-x-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border p-3 text-white shadow-sm sm:h-20 sm:w-20">
            <img
              className="w-20"
              src="/assets/games/counter-strike-2/wingman/SILVER_1__WINGAME.png"
              alt="logo"
            />
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
          {listOfRanks.map(({ name, value, image }) => (
            <RadioGroupPrimitive.Item
              key={value}
              className={`max-w-[80px] flex-grow cursor-pointer rounded-md transition-colors duration-200 sm:max-w-none sm:flex-grow-0 ${selectedValue === value ? "bg-radio ring-1 ring-field-ring-hover/60" : "bg-radio/20 hover:bg-radio/60"} `}
              value={value}
            >
              <Tooltip content={name}>
                <div className="flex cursor-pointer items-center justify-center rounded-md bg-radio/20 px-5 py-2 text-base font-medium uppercase outline-none ring-1 ring-field-ring/30 hover:bg-radio/60 disabled:cursor-not-allowed disabled:opacity-25">
                  <img
                    className="w-16"
                    src={`/assets/games/counter-strike-2/wingman/${image}.png`}
                    alt="rank"
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
