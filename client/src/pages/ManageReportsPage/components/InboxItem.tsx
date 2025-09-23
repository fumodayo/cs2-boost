import React from "react";
import { Badge } from "~/components/shared";
import cn from "~/libs/utils";
import { formatDistanceToNow } from "date-fns";
import { IReport } from "~/types";
import { REPORT_STATUS } from "~/types/constants";
import { isUserObject } from "~/utils/typeGuards";
import { useTranslation } from "react-i18next";

interface InboxItemProps {
  report: IReport;
  isActive: boolean;
  onClick: () => void;
}

type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning";

const statusVariantMap: Record<IReport["status"], BadgeVariant> = {
  [REPORT_STATUS.PENDING]: "destructive",
  [REPORT_STATUS.IN_PROGRESS]: "default",
  [REPORT_STATUS.RESOLVED]: "success",
  [REPORT_STATUS.REJECT]: "outline",
};

const InboxItem: React.FC<InboxItemProps> = ({ report, isActive, onClick }) => {
  const { t } = useTranslation();
  if (!isUserObject(report.sender)) {
    return (
      <div className="rounded-lg p-3">
        <p className="text-sm text-muted-foreground">Loading report data...</p>
      </div>
    );
  }

  const statusKey = `ManageReportsPage.InboxItem.status${report.status.replace("_", "")}`;

  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-lg p-3 transition-colors",
        isActive ? "bg-muted" : "hover:bg-muted/50",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={report.sender.profile_picture}
            alt={report.sender.username}
          />
          <div>
            <p className="font-semibold text-foreground">
              {report.sender.username}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("ManageReportsPage.InboxItem.titleLabel")}: {report.title}
            </p>
          </div>
        </div>
        <Badge variant={statusVariantMap[report.status]}>
          {t(statusKey, report.status.replace("_", " "))}
        </Badge>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">
        <p className="line-clamp-2">
          {report.description || t("ManageReportsPage.InboxItem.noDescription")}
        </p>
        <p className="mt-1 text-right text-xs">
          {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

export default InboxItem;
