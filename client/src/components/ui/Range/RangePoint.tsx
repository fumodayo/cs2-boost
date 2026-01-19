import { useState } from "react";
import Range from "~/components/@radix-ui/Range";

type Mark = {
  [key: string]: React.ReactNode;
};

interface IRangePointProps {
  title: string;
  subtitle?: string;
  startText: string;
  lastText: string;
  defaultRange: number[];
  min: number;
  max: number;
  step: number;
  marks: Mark;
  onChange: (value: number[]) => void;
}

const RangePoint = ({
  title,
  subtitle,
  startText,
  lastText,
  defaultRange,
  min,
  max,
  step,
  marks,
  onChange,
}: IRangePointProps) => {
  const [range, setRange] = useState(defaultRange);

  const handleChange = (value: number | number[]) => {
    setRange(value as number[]);
    onChange(value as number[]);
  };

  return (
    <div className="relative mb-6 mt-5 w-full overflow-hidden rounded-lg bg-card px-4 py-6 sm:px-12 sm:py-8">
      <div className="flex flex-col sm:flex-row">
        <div className="z-10 flex-grow">
          <h2 className="mb-2 text-base font-bold text-foreground sm:-ml-4 sm:text-lg">
            {title}
          </h2>
          <p className="-mt-1 mb-4 text-xs text-muted-foreground sm:-ml-4 sm:-mt-2 sm:text-sm">
            {subtitle}
          </p>
          <div className="mb-6 flex max-w-[250px] flex-col justify-start gap-1 text-xs text-muted-foreground sm:-ml-4 sm:mb-8 sm:text-base">
            <div className="flex justify-between">
              <span className="font-bold">{startText}:</span>
              <span className="w-16 rounded-md bg-accent px-2 text-right">
                {range[0]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">{lastText}:</span>
              <span className="w-16 rounded-md bg-accent px-2 text-right">
                {range[1]}
              </span>
            </div>
          </div>
          <div className="flex">
            <div className="mb-12 w-full pr-2 sm:mb-16 sm:pl-[14px] sm:pr-5">
              <Range
                min={min}
                max={max}
                step={step}
                defaultValue={defaultRange}
                marks={marks}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RangePoint;