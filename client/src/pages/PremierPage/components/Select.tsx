import { RangePoint } from "~/components/shared";

const MarkOfPoint = ({ point, rank }: { point: string; rank: string }) => (
  <div className="py-2">
    <span className="text-xs text-foreground md:text-base">{point}</span>
    <img
      src={`/assets/games/counter-strike-2/premier/${rank}.png`}
      alt={rank}
      className="mt-2 h-full w-10 md:w-20"
    />
  </div>
);

const marks = {
  5000: <MarkOfPoint point="5000" rank="cyan" />,
  10000: <MarkOfPoint point="10000" rank="blue" />,
  15000: <MarkOfPoint point="15000" rank="purple" />,
  20000: <MarkOfPoint point="20000" rank="pink" />,
  25000: <MarkOfPoint point="25000" rank="red" />,
};

interface ISelectProps {
  range: number[];
  setRange: (value: number[]) => void;
}

const Select = ({ range, setRange }: ISelectProps) => {
  return (
    <RangePoint
      min={1000}
      max={30000}
      step={100}
      title="Select your current Rating and desired Rating"
      subtitle="ratings above 20000 are only available as piloted service"
      startText="My Rating"
      lastText="Desired Rating"
      defaultRange={range}
      onChange={setRange}
      marks={marks}
    />
  );
};

export default Select;
