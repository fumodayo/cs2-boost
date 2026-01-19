import React from "react";
import { IUser } from "~/types";

const RowTable = ({ children }: { children: React.ReactNode }) => (
  <td className="px-2.5 py-2.5 text-left align-middle first:pl-4 last:pr-4">
    {children}
  </td>
);

interface RowUserProps {
  user: IUser | string | null | undefined;
  fallbackText?: string;
}

const RowUser: React.FC<RowUserProps> = ({
  user,
  fallbackText = "Unassigned",
}) => {
  if (!user || typeof user === "string") {
    return (
      <RowTable>
        <span className="text-xs text-muted-foreground">{fallbackText}</span>
      </RowTable>
    );
  }

  return (
    <RowTable>
      <div className="flex items-center">
        <img
          className="h-10 w-10 rounded-full border border-border object-cover"
          src={user.profile_picture}
          alt={user.username}
          crossOrigin="anonymous"
        />
        <div className="ml-2 truncate">
          <div className="truncate text-sm font-medium text-foreground">
            {user.username}
          </div>
          {user.email_address && (
            <div className="truncate text-xs text-muted-foreground">
              {user.email_address}
            </div>
          )}
        </div>
      </div>
    </RowTable>
  );
};

export default RowUser;