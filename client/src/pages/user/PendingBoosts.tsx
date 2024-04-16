import UserPage from "../../components/Layouts/UserPage";
import DataTable from "../../components/DataTable";
import { useState } from "react";
import { usePendingOrder } from "../../hooks/usePendingOrder";
import PlusButton from "../../components/Buttons/PlusButton";
import { listOfGame } from "../../constants";

const headers = [
  {
    name: "title",
    value: "title",
    active: true,
  },
  {
    name: "boost id",
    value: "id",
    active: true,
  },
  {
    name: "client",
    value: "client",
    active: true,
  },
  {
    name: "boosters",
    value: "boosters",
    active: true,
  },
  {
    name: "status",
    value: "status",
    active: true,
  },
  {
    name: "price",
    value: "price",
    active: true,
  },
  {
    name: "last updated",
    value: "updated_at",
    active: true,
  },
  {
    name: "actions",
    value: "actions",
    active: true,
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
        <DataTable name="pending" headers={headers} items={orders}>
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {/* SEARCH */}
            <div className="w-fit">
              <input
                value={searchKey}
                onChange={(e) => onSearchKey(e.target.value)}
                className="flex h-8 w-[150px] rounded-md border border-input bg-card-alt px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 lg:w-[250px]"
                placeholder="Search..."
                type="text"
              />
            </div>
            {/* GAME BUTTON */}
            <PlusButton
              selectedValues={gameKey}
              onSelectedValuesChange={(value: string[]) => onGameKey(value)}
              name="Game"
              options={listOfGame}
            />
          </div>
        </DataTable>
      </div>
    </UserPage>
  );
};

export default PendingBoosts;
