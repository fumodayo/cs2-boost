import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [range, setRange] = useState(defaultRange);

  const handleChange = (value: number | number[]) => {
    setRange(value as number[]);
    onChange(value as number[]);
  };

  return (
    <div className="relative mb-6 mt-5 w-full overflow-hidden rounded-lg bg-card px-12 py-8">
      <div className="flex flex-col sm:flex-row">
        <div className="z-10 flex-grow">
          <h2 className="-ml-4 mb-2 text-start text-lg font-bold text-foreground">
            {t(`RangePoint.title.${title}`)}
          </h2>
          <p className="-ml-4 -mt-2 mb-4 text-sm text-muted-foreground">
            {subtitle && `(note: ${t(`RangePoint.subtitle.${subtitle}`)})`}
          </p>
          <div className="-ml-4 mb-8 flex max-w-[250px] flex-col justify-start gap-1 text-muted-foreground">
            <div className="flex justify-between">
              <span className="font-bold">
                {t(`Globals.label.${startText}`)}:
              </span>
              <span className="w-14 rounded-md bg-accent px-2">{range[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">
                {t(`Globals.label.${lastText}`)}:
              </span>
              <span className="w-14 rounded-md bg-accent px-2">{range[1]}</span>
            </div>
          </div>
          <div className="flex">
            <div className="mb-16 w-full pl-[14px] pr-5">
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
