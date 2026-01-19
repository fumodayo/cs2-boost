import React from "react";
import { Badge } from "~/components/ui";
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

const InboxItem: React.FC<InboxItemProps> = ({ report, isActive, onClick }) => {
  const { t } = useTranslation("manage_reports_page");

  if (!isUserObject(report.sender)) {
    return (
      <div className="animate-pulse rounded-xl border border-border bg-card/50 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-muted"></div>
            <div className="h-3 w-1/2 rounded bg-muted"></div>
          </div>
        </div>
      </div>
    );
  }

  const statusKey = `inbox_item.status_${report.status.toLowerCase().replace("_", "")}`;
  const isPending = report.status === REPORT_STATUS.PENDING;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-xl border p-3 transition-all duration-200 hover:shadow-md",
        isActive
          ? "border-primary/50 bg-primary/5 shadow-sm"
          : "border-transparent bg-transparent hover:border-border hover:bg-muted/50",
      )}
    >
      {/* Active Indicator Line */}
      {isActive && (
        <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              className="h-10 w-10 rounded-full border border-border object-cover shadow-sm"
              src={report.sender.profile_picture}
              alt={report.sender.username}
            />
            {isPending && (
              <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
              </span>
            )}
          </div>
          <div className="overflow-hidden">
            <p
              className={cn(
                "truncate text-sm font-semibold transition-colors",
                isActive
                  ? "text-primary"
                  : "text-foreground group-hover:text-primary",
              )}
            >
              {report.sender.username}
            </p>
            <p className="truncate text-xs font-medium text-muted-foreground">
              {report.title}
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <p className="text-[10px] font-medium text-muted-foreground/70">
            {formatDistanceToNow(new Date(report.createdAt), {
              addSuffix: false,
            })}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between gap-2">
          <p className="line-clamp-1 text-xs text-muted-foreground/80">
            {report.description || t("inbox_item.no_description")}
          </p>
          <Badge
            variant="outline"
            className={cn(
              "h-5 border-0 px-1.5 py-0 text-[10px] uppercase tracking-wider",
              report.status === REPORT_STATUS.RESOLVED &&
                "bg-green-500/10 text-green-500",
              report.status === REPORT_STATUS.PENDING &&
                "bg-red-500/10 text-red-500",
              report.status === REPORT_STATUS.IN_PROGRESS &&
                "bg-blue-500/10 text-blue-500",
              report.status === REPORT_STATUS.REJECT &&
                "bg-muted text-muted-foreground",
            )}
          >
            {t(statusKey, report.status)}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default InboxItem;