import { IconType } from "react-icons";

interface StatCardProps {
  title: string;
  value: string;
  icon: IconType;
  color?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "text-foreground",
}: StatCardProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-x-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${color}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
