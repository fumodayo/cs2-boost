import React from "react";
import { IconType } from "react-icons";
import cn from "~/libs/utils";

interface FinancialKpiCardProps {
  title: string;
  value: string;
  icon: IconType;
  colorClass: string;
  description: string;
}

const FinancialKpiCard: React.FC<FinancialKpiCardProps> = ({
  title,
  value,
  icon: Icon,
  colorClass,
  description,
}) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className={cn("h-5 w-5 text-muted-foreground", colorClass)} />
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default FinancialKpiCard;
