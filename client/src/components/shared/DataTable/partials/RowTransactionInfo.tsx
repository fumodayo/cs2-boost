import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { ITransaction } from "~/types";
import RowTable from "./RowTable";
import UserTooltip from "./UserTooltip";
import { isUserObject } from "~/utils/typeGuards";

const RowTransactionInfo: React.FC<
  Pick<ITransaction, "user" | "description">
> = ({ user, description }) => {

  if (isUserObject(user)) {
    return (
      <RowTable>
        <div className="flex items-center gap-3">
          <UserTooltip user={user}>
            <div className="cursor-pointer">
              <img
                src={user.profile_picture}
                alt={user.username}
                className="h-10 w-10 rounded-full object-cover"
              />
            </div>
          </UserTooltip>
          <div>
            <div className="text-sm font-medium text-foreground">
              {user.full_name || user.username}
            </div>
            <div
              className="max-w-xs truncate text-xs text-muted-foreground"
              title={description}
            >
              {description}
            </div>
          </div>
        </div>
      </RowTable>
    );
  }

  return (
    <RowTable>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <FaUserCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">
            System / Other
          </div>
          <div
            className="max-w-xs truncate text-xs text-muted-foreground"
            title={description}
          >
            {description}
          </div>
        </div>
      </div>
    </RowTable>
  );
};

export default RowTransactionInfo;
