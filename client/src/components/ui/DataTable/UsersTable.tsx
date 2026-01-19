import React from "react";
import { FaBan, FaCheckCircle } from "react-icons/fa";
import { IDataListHeaders } from "~/constants/headers";
import { IUser } from "~/types";
import DataTable from "./DataTable";
import { Badge } from "~/components/ui/Display";
import { RowUserActions, UserTooltip } from "./partials";
import { ROLE } from "~/types/constants";
import { FaCrown, FaStar, FaUser } from "react-icons/fa6";
import cn from "~/libs/utils";

const roleConfig = {
  [ROLE.CLIENT]: {
    icon: FaUser,
    className:
      "text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-700/50 dark:bg-blue-900/20",
  },
  [ROLE.PARTNER]: {
    icon: FaStar,
    className:
      "text-purple-600 border-purple-200 bg-purple-50 dark:text-purple-400 dark:border-purple-700/50 dark:bg-purple-900/20",
  },
  [ROLE.ADMIN]: {
    icon: FaCrown,
    className:
      "text-amber-600 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-700/50 dark:bg-amber-900/20",
  },
  default: {
    icon: FaUser,
    className:
      "text-gray-600 border-gray-200 bg-gray-50 dark:text-gray-400 dark:border-gray-700/50 dark:bg-gray-900/20",
  },
};

interface UsersTableProps {
  users: IUser[];
  headers: IDataListHeaders[];
  toggleColumn: (value: string) => void;
  onBanUser: (userId: string, reason: string) => Promise<void>;
  onUnbanUser: (userId: string) => Promise<void>;
  isProcessingAction: boolean;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  headers,
  toggleColumn,
  onBanUser,
  onUnbanUser,
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
      itemCount={users.length}
    >
      {users.map((user) => (
        <tr
          key={user._id}
          className="border-b border-border text-sm transition-colors hover:bg-muted/50"
        >
          {headers.find((col) => col.value === "username") && (
            <RowTable>
              <UserTooltip user={user}>
                <div className="flex cursor-pointer items-center">
                  <img
                    src={user.profile_picture}
                    alt={user.username}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-foreground">
                      {user.username}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.email_address}
                    </div>
                  </div>
                </div>
              </UserTooltip>
            </RowTable>
          )}

          {headers.find((col) => col.value === "role") && (
            <RowTable>
              <div className="flex items-center gap-1.5">
                {user.role.map((r) => {
                  const config =
                    roleConfig[r as keyof typeof roleConfig] ||
                    roleConfig.default;
                  const Icon = config.icon;
                  return (
                    <Badge
                      key={r}
                      variant="outline"
                      className={cn(
                        "flex items-center gap-1.5 capitalize",
                        config.className,
                      )}
                    >
                      <Icon className="h-3 w-3" />
                      <span>{r.toLowerCase()}</span>
                    </Badge>
                  );
                })}
              </div>
            </RowTable>
          )}

          {headers.find((col) => col.value === "status") && (
            <RowTable>
              <div className="flex flex-col items-start gap-y-1.5">
                {user.is_banned ? (
                  <Badge
                    className="border-red-200 bg-red-50 text-red-600 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-400"
                    variant="outline"
                  >
                    <FaBan className="mr-1.5" /> Banned
                  </Badge>
                ) : (
                  <Badge
                    className="border-green-200 bg-green-50 text-green-600 dark:border-green-700/50 dark:bg-green-900/20 dark:text-green-400"
                    variant="outline"
                  >
                    <FaCheckCircle className="mr-1.5" /> Active
                  </Badge>
                )}
              </div>
            </RowTable>
          )}

          {headers.find((col) => col.value === "createdAt") && (
            <RowTable className="text-muted-foreground">
              {new Date(user.createdAt).toLocaleDateString("vi-VN")}
            </RowTable>
          )}

          {headers.find((col) => col.value === "actions") && (
            <RowTable className="text-right">
              <RowUserActions
                user={user}
                onBanUser={onBanUser}
                onUnbanUser={onUnbanUser}
                isProcessing={isProcessingAction}
              />
            </RowTable>
          )}
        </tr>
      ))}
    </DataTable>
  );
};

export default UsersTable;