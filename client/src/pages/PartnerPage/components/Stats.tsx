interface IStatsItemProps {
  title?: string;
  subtitle?: string;
}

const Stats = ({ title, subtitle }: IStatsItemProps) => {
  return (
    <div>
      <div className="font-semibold">{title}</div>
      <div className="font-semibold text-danger">{subtitle}</div>
    </div>
  );
};

export default Stats;
