import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../@radix-ui/Popover";
import { Button } from "./Button";
import { useSearchParams } from "react-router-dom";
import * as Slider from "@radix-ui/react-slider";

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
  const [range, setRange] = useState<[number, number]>(defaultValue);
  const [searchParams, setSearchParams] = useSearchParams();

  const marks: {
    [key: number]: { style: React.CSSProperties; label: string };
  } = {};
  for (let i = min; i <= max; i += step) {
    marks[i] = {
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#ffffff",
      },
      label: `${i}`,
    };
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    const existingMin = params.get(`${type}-min`);
    const existingMax = params.get(`${type}-max`);

    if (existingMin === String(range[0]) && existingMax === String(range[1])) {
      return;
    }

    params.delete(`${type}-min`);
    params.delete(`${type}-max`);

    if (range[0] !== defaultValue[0] || range[1] !== defaultValue[1]) {
      params.append(`${type}-min`, String(range[0]));
      params.append(`${type}-max`, String(range[1]));
    }

    setSearchParams(params, { replace: true });
  }, [range, searchParams, setSearchParams, type, defaultValue]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    const minParam = params.get(`${type}-min`);
    const maxParam = params.get(`${type}-max`);

    if (minParam && maxParam) {
      const newRange: [number, number] = [Number(minParam), Number(maxParam)];
      if (newRange[0] !== range[0] || newRange[1] !== range[1]) {
        setRange(newRange);
      }
    } else {
      if (range[0] !== defaultValue[0] || range[1] !== defaultValue[1]) {
        setRange(defaultValue);
      }
    }
  }, [searchParams, type, defaultValue, range]);

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant="transparent"
          className="h-8 rounded-md border border-dashed border-input px-3 text-xs font-medium shadow-sm"
        >
          {label} ⭐ {range[0]} - {range[1]}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={8}
        align="start"
        className="z-50 w-64 rounded-xl border bg-popover p-6 text-popover-foreground shadow-lg"
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Set {label} Range</h4>
            <p className="text-sm text-muted-foreground">
              Adjust the slider to filter partners.
            </p>
          </div>
          <Slider.Root
            className="relative flex h-5 w-full touch-none select-none items-center"
            value={range}
            onValueChange={(newValue) => setRange(newValue as [number, number])}
            min={min}
            max={max}
            step={step}
            minStepsBetweenThumbs={0}
          >
            <Slider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
              <Slider.Range className="absolute h-full rounded-full bg-primary" />
            </Slider.Track>
            <Slider.Thumb
              aria-label="Min value"
              className="block h-5 w-5 cursor-pointer rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <Slider.Thumb
              aria-label="Max value"
              className="block h-5 w-5 cursor-pointer rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </Slider.Root>
          <div className="flex justify-between text-sm font-semibold text-foreground">
            <span>{range[0]}</span>
            <span>{range[1]}</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RangeFilter;
