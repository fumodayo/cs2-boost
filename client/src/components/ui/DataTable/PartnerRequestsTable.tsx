import React from "react";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { FaClock, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { IDataListHeaders } from "~/constants/headers";
import { IPartnerRequest } from "~/types";
import DataTable from "./DataTable";
import { Badge } from "~/components/ui/Display";
import { Button } from "../Button";
import cn from "~/libs/utils";
import formatDate from "~/utils/formatDate";

const statusConfig = {
  pending: {
    icon: FaClock,
    label: "Pending",
    className:
      "text-yellow-600 border-yellow-200 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-700/50 dark:bg-yellow-900/20",
  },
  approved: {
    icon: FaCircleCheck,
    label: "Approved",
    className:
      "text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-700/50 dark:bg-green-900/20",
  },
  rejected: {
    icon: FaCircleXmark,
    label: "Rejected",
    className:
      "text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-700/50 dark:bg-red-900/20",
  },
};

const getRowWarningClass = (warningLevel?: "danger" | "warning") => {
  if (warningLevel === "danger") {
    return "bg-red-50 dark:bg-red-900/20 border-l-4 border-l-red-500";
  }
  if (warningLevel === "warning") {
    return "bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-l-yellow-500";
  }
  return "";
};

interface PartnerRequestsTableProps {
  requests: IPartnerRequest[];
  headers: IDataListHeaders[];
  toggleColumn: (value: string) => void;
  onViewDetails: (request: IPartnerRequest) => void;
  onApprove: (request: IPartnerRequest) => void;
  onReject: (request: IPartnerRequest) => void;
  isProcessingAction: boolean;
}

const PartnerRequestsTable: React.FC<PartnerRequestsTableProps> = ({
  requests,
  headers,
  toggleColumn,
  onViewDetails,
  onApprove,
  onReject,
  isProcessingAction,
}) => {
  const RowTable = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <td className={`p-4 align-middle ${className}`}>{children}</td>;

  return (
    <DataTable
      headers={headers}
      toggleColumn={toggleColumn}
      itemCount={requests.length}
    >
      {requests.map((request) => (
        <tr
          key={request._id}
          className={cn(
            "border-b border-border text-sm transition-colors hover:bg-muted/50",
            getRowWarningClass(request.warningLevel),
          )}
        >
          {headers.find((col) => col.value === "user") && (
            <RowTable>
              <div className="flex items-center">
                <img
                  src={request.user?.profile_picture}
                  alt={request.user?.username}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <div className="font-medium text-foreground">
                    {request.user?.username}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {request.user?.email_address}
                  </div>
                </div>
              </div>
            </RowTable>
          )}

          {headers.find((col) => col.value === "full_name") && (
            <RowTable>
              <span className="font-medium text-foreground">
                {request.full_name}
              </span>
            </RowTable>
          )}

          {headers.find((col) => col.value === "cccd_number") && (
            <RowTable>
              <span className="font-mono text-sm text-muted-foreground">
                {request.cccd_number}
              </span>
            </RowTable>
          )}

          {headers.find((col) => col.value === "status") && (
            <RowTable>
              {(() => {
                const config =
                  statusConfig[request.status as keyof typeof statusConfig];
                const Icon = config.icon;
                return (
                  <Badge
                    variant="outline"
                    className={cn(
                      "flex w-fit items-center gap-1.5",
                      config.className,
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{config.label}</span>
                  </Badge>
                );
              })()}
            </RowTable>
          )}

          {headers.find((col) => col.value === "createdAt") && (
            <RowTable className="text-muted-foreground">
              {formatDate(request.createdAt)}
            </RowTable>
          )}

          {headers.find((col) => col.value === "actions") && (
            <RowTable className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(request)}
                >
                  <FaEye className="mr-1.5 h-3 w-3" />
                  View
                </Button>
                {request.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onApprove(request)}
                      disabled={isProcessingAction}
                    >
                      <FaCheck className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onReject(request)}
                      disabled={isProcessingAction}
                    >
                      <FaTimes className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            </RowTable>
          )}
        </tr>
      ))}
    </DataTable>
  );
};

export default PartnerRequestsTable;