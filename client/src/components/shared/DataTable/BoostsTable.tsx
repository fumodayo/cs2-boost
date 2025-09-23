import React from "react";
import { useTranslation } from "react-i18next";
import { IDataListHeaders } from "~/constants/headers";
import { IOrder } from "~/types";
import { formatDistanceDate, formatMoney } from "~/utils";
import DataTable from "./DataTable";
import {
  RowAction,
  RowBoost,
  RowOrderStatus,
  RowTable,
  RowUser,
  UserTooltip,
} from "./partials";
import { isUserObject } from "~/utils/typeGuards";

interface BoostsTableProps {
  boosts: IOrder[];
  headers: IDataListHeaders[];
  toggleColumn: (value: string) => void;
  isAdmin?: boolean;
}

const BoostsTable: React.FC<BoostsTableProps> = ({
  boosts,
  headers,
  toggleColumn,
  isAdmin,
}) => {
  const { i18n } = useTranslation();

  return (
    <DataTable
      headers={headers}
      toggleColumn={toggleColumn}
      itemCount={boosts.length}
    >
      {boosts.map((boost) => (
        <tr
          key={boost._id}
          className="border-b border-border transition-colors hover:bg-muted/50"
        >
          {headers.find((col) => col.value === "order") && (
            <RowBoost isAdmin={isAdmin} boost={boost} />
          )}

          {headers.find((col) => col.value === "boost_id") && (
            <RowTable className="text-muted-foreground">
              #{boost.boost_id}
            </RowTable>
          )}

          {headers.find((col) => col.value === "status") && (
            <RowOrderStatus {...boost} />
          )}

          {headers.find((col) => col.value === "price") && (
            <RowTable className="font-semibold text-foreground">
              {formatMoney(boost.price, "vnd")}
            </RowTable>
          )}

          {isAdmin && headers.find((col) => col.value === "customer") && (
            <td className="p-4 align-middle">
              {isUserObject(boost.user) ? (
                <UserTooltip user={boost.user}>
                  <div className="cursor-pointer">
                    <RowUser user={boost.user} />
                  </div>
                </UserTooltip>
              ) : (
                <span className="text-xs text-muted-foreground">N/A</span>
              )}
            </td>
          )}

          {headers.find((col) => col.value === "assign_partner") && (
            <td className="p-4 align-middle">
              {isUserObject(boost.assign_partner) &&
              boost.assign_partner !== null ? (
                <UserTooltip user={boost.assign_partner}>
                  <div className="cursor-pointer">
                    <RowUser user={boost.assign_partner} />
                  </div>
                </UserTooltip>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Unassigned
                </span>
              )}
            </td>
          )}

          {isAdmin && headers.find((col) => col.value === "partner") && (
            <td className="p-4 align-middle">
              {isUserObject(boost.partner) ? (
                <UserTooltip user={boost.partner}>
                  <div className="cursor-pointer">
                    <RowUser user={boost.partner} />
                  </div>
                </UserTooltip>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Unassigned
                </span>
              )}
            </td>
          )}

          {headers.find((col) => col.value === "updatedAt") && (
            <RowTable className="text-muted-foreground">
              {formatDistanceDate(boost.updatedAt, i18n.language)}
            </RowTable>
          )}

          {headers.find((col) => col.value === "actions") && (
            <td className="p-4 text-right align-middle">
              <RowAction {...boost} />
            </td>
          )}
        </tr>
      ))}
    </DataTable>
  );
};

export default BoostsTable;
