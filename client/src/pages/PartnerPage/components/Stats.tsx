interface IStatsItemProps {
  title: string;
  value: string | number;
}

const Stats = ({ title, value }: IStatsItemProps) => {
  return (
    <div className="rounded-lg bg-card-alt p-3">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
};

export default Stats;
