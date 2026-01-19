import React from "react";
import { SiTicktick } from "react-icons/si";
import { IReceipt } from "~/types";
import { Badge } from "~/components/ui/Display";
import cn from "~/libs/utils";
import RowTable from "./RowTable";

const statusConfig: Record<
  string,
  { className: string; icon: React.ElementType }
> = {
  COMPLETED: {
    className:
      "text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-700/50 dark:bg-green-900/20",
    icon: SiTicktick,
  },
  default: {
    className:
      "text-gray-600 border-gray-200 bg-gray-50 dark:text-gray-400 dark:border-gray-700/50 dark:bg-gray-900/20",
    icon: SiTicktick,
  },
};

const RowReceiptStatus: React.FC<Pick<IReceipt, "status">> = ({ status }) => {
  const config = statusConfig[status.toUpperCase()] || statusConfig.default;
  const Icon = config.icon;

  return (
    <RowTable>
      <Badge
        variant="outline"
        className={cn(
          "inline-flex items-center gap-2 rounded-md capitalize",
          config.className,
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        <span>{status.toLowerCase()}</span>
      </Badge>
    </RowTable>
  );
};

export default RowReceiptStatus;