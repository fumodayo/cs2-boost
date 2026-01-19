import { useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/@radix-ui/Popover";
import { Button } from "~/components/ui/Button";
import { useSearchParams } from "react-router-dom";
import * as Slider from "@radix-ui/react-slider";
import { useTranslation } from "react-i18next";

interface RangeFilterProps {
  min: number;
  max: number;
  step?: number;
  defaultValue: [number, number];
  label?: string;
  type: string;
}

const RangeFilter: React.FC<RangeFilterProps> = ({
  min,
  max,
  step = 1,
  defaultValue,
  label = "Filter",
  type,
}) => {
  const { t } = useTranslation("partners_page");
  const [searchParams, setSearchParams] = useSearchParams();

  const rangeValue = useMemo(() => {
    const minParam = searchParams.get(`${type}-min`);
    const maxParam = searchParams.get(`${type}-max`);

    if (minParam && maxParam) {
      return [Number(minParam), Number(maxParam)] as [number, number];
    }

    return defaultValue;
  }, [searchParams, type, defaultValue]);

  const handleValueChange = (newValue: [number, number]) => {
    setSearchParams(
      (prevParams) => {
        const newParams = new URLSearchParams(prevParams);

        const isDefault =
          newValue[0] === defaultValue[0] && newValue[1] === defaultValue[1];

        if (!isDefault) {
          newParams.set(`${type}-min`, String(newValue[0]));
          newParams.set(`${type}-max`, String(newValue[1]));
        } else {
          newParams.delete(`${type}-min`);
          newParams.delete(`${type}-max`);
        }

        return newParams;
      },
      { replace: true },
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="transparent"
          className="h-8 rounded-md border border-dashed border-input px-3 text-xs font-medium shadow-sm"
        >
          {label} ⭐ {rangeValue[0]} - {rangeValue[1]}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={8}
        align="start"
        className="z-50 w-64 rounded-xl border bg-popover p-6 text-popover-foreground shadow-lg"
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              {" "}
              {t("range_filter.title", { label })}
            </h4>
            <p className="text-sm text-muted-foreground">
              {t("range_filter.subtitle")}
            </p>
          </div>
          <Slider.Root
            className="relative flex h-5 w-full touch-none select-none items-center"
            value={rangeValue}
            onValueChange={(newValue) =>
              handleValueChange(newValue as [number, number])
            }
            min={min}
            max={max}
            step={step}
            minStepsBetweenThumbs={0}
          >
            <Slider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
              <Slider.Range className="absolute h-full rounded-full bg-primary" />
            </Slider.Track>
            <Slider.Thumb
              aria-label={t("range_filter.aria_min_value")}
              className="block h-5 w-5 cursor-pointer rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <Slider.Thumb
              aria-label={t("range_filter.aria_max_value")}
              className="block h-5 w-5 cursor-pointer rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </Slider.Root>
          <div className="flex justify-between text-sm font-semibold text-foreground">
            <span>{rangeValue[0]}</span>
            <span>{rangeValue[1]}</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RangeFilter;