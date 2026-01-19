import { IconType } from "react-icons";

interface IStatsItemProps {
  icon: IconType;
  title: string;
  value: string | number;
  iconColor?: string;
}

const Stats = ({
  icon: Icon,
  title,
  value,
  iconColor = "text-primary",
}: IStatsItemProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg bg-card-alt p-3">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg bg-background ${iconColor}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-sm text-muted-foreground">{title}</span>
      </div>
      <span className="text-lg font-bold text-foreground">{value}</span>
    </div>
  );
};

export default Stats;