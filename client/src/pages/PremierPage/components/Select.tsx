import { useTranslation } from "react-i18next";
import { RangePoint } from "~/components/ui";

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
  const { t } = useTranslation(["common"]);

  return (
    <RangePoint
      min={1000}
      max={30000}
      step={100}
      title={t("range_point.premier_title")}
      startText={t("labels.my_rating")}
      lastText={t("labels.desired_rating")}
      subtitle={t("range_point.note")}
      defaultRange={range}
      onChange={setRange}
      marks={marks}
    />
  );
};

export default Select;