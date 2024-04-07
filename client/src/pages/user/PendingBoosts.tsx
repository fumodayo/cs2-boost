import UserPage from "../../components/Layouts/UserPage";
import DataTable from "../../components/DataTable";
import { useState } from "react";
import { usePendingOrder } from "../../hooks/usePendingOrder";

const headers = [
  {
    name: "title",
    value: "title",
  },
  {
    name: "boost id",
    value: "id",
  },
  {
    name: "client",
    value: "client",
  },
  {
    name: "boosters",
    value: "boosters",
  },
  {
    name: "status",
    value: "status",
  },
  {
    name: "price",
    value: "price",
  },
  {
    name: "last updated",
    value: "updated_at",
  },
];

const PendingBoosts = () => {
  const [searchKey, onSearchKey] = useState<string>("");
  const [gameKey, onGameKey] = useState<string[]>([]);
  const [statusKey, onStatusKey] = useState<string[]>([]);

  const orders = usePendingOrder({ searchKey, gameKey, statusKey });

  return (
    <UserPage>
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-y-4">
          <div className="min-w-fit flex-1 flex-grow md:min-w-0">
            <div className="flex flex-wrap items-center gap-y-4">
              <div className="sm:truncate">
                <h1 className="font-display text-3xl font-semibold text-foreground sm:truncate sm:tracking-tight">
                  Pending Boosts List
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* INFORMATION */}
        <DataTable
          headers={headers}
          items={orders}
          searchKey={searchKey}
          gameKey={gameKey}
          statusKey={statusKey}
          onSearchKey={onSearchKey}
          onGameKey={onGameKey}
          onStatusKey={onStatusKey}
        />
      </div>
    </UserPage>
  );
};

export default PendingBoosts;
