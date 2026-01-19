import { useTranslation } from "react-i18next";
import { RangePoint } from "~/components/ui";

const MarkOfPoint = ({ point }: { point: string }) => (
  <div className="py-2">
    <span className="text-lg text-foreground">{point}</span>
  </div>
);

const marks = {
  0: <MarkOfPoint point="0" />,
  5000: <MarkOfPoint point="5000" />,
  10000: <MarkOfPoint point="10000" />,
  12000: <MarkOfPoint point="12000" />,
};

interface ISelectProps {
  range: number[];
  setRange: (value: number[]) => void;
}

const Select = ({ range, setRange }: ISelectProps) => {
  const { t } = useTranslation(["common"]);

  return (
    <RangePoint
      min={0}
      max={12000}
      step={100}
      title={t("range_point.level_farming_title")}
      startText={t("labels.my_exp")}
      lastText={t("labels.desired_exp")}
      defaultRange={range}
      onChange={setRange}
      marks={marks}
    />
  );
};

export default Select;