import { useEffect, useState } from "react";
import { SliderProps } from "rc-slider";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap_white.css";
import { Popover, PopoverContent, PopoverTrigger } from "../@radix-ui/Popover";
import { Button } from "./Button";
import Slider from "rc-slider";
import { useSearchParams } from "react-router-dom";

interface RangeFilterButtonProps extends Omit<SliderProps, "onChange"> {
  min: number;
  max: number;
  step?: number;
  defaultValue: [number, number];
  label?: string;
  type: string;
}

const RangeFilterButton: React.FC<RangeFilterButtonProps> = ({
  min,
  max,
  step = 1,
  defaultValue,
  label = "Filter",
  type,
  ...restProps
}) => {
  const [range, setRange] = useState<[number, number]>(defaultValue);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSliderChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setRange([value[0], value[1]]);
    }
  };

  const marks: {
    [key: number]: { style: React.CSSProperties; label: string };
  } = {};
  for (let i = min; i <= max; i += step) {
    marks[i] = {
      style: {
        fontSize: "14px", // Điều chỉnh kích thước chữ
        fontWeight: "bold", // In đậm chữ
        color: "#ffffff", // Màu chữ
      },
      label: `${i}`,
    };
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    // Kiểm tra nếu range đã có trên URL
    const existingMin = params.get(`${type}-min`);
    const existingMax = params.get(`${type}-max`);

    // Nếu giá trị mới giống giá trị cũ thì không cập nhật
    if (existingMin === String(range[0]) && existingMax === String(range[1])) {
      return;
    }

    // Xóa params cũ trước khi thêm mới
    params.delete(`${type}-min`);
    params.delete(`${type}-max`);

    // Nếu giá trị mặc định không thay đổi, không thêm params
    if (range[0] !== defaultValue[0] || range[1] !== defaultValue[1]) {
      params.append(`${type}-min`, String(range[0]));
      params.append(`${type}-max`, String(range[1]));
    }

    setSearchParams(params);
  }, [range]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    const minParam = params.get(`${type}-min`);
    const maxParam = params.get(`${type}-max`);

    if (minParam && maxParam) {
      setRange([Number(minParam), Number(maxParam)]);
    } else {
      // Nếu không có params, reset về defaultValue
      setRange(defaultValue);
    }
  }, [searchParams]);

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          color="transparent"
          className="h-8 rounded-md border border-dashed border-input px-3 text-xs font-medium shadow-sm"
        >
          {label} ⭐ {range[0]} - {range[1]}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={10}
        className="w-[350px] rounded-md bg-popover p-4 text-popover-foreground"
      >
        <div className="flex flex-col space-y-2 px-2 pb-6">
          <h1 className="text-sm">{label}</h1>
          <hr className="w-full border-foreground opacity-10" />
          <Slider
            range
            min={min}
            max={max}
            value={range}
            step={step}
            defaultValue={defaultValue}
            onChange={handleSliderChange}
            marks={marks}
            {...restProps}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RangeFilterButton;
