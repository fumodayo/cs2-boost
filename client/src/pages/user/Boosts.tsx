import UserPage from "../../components/Layouts/UserPage";
import { FaRocket } from "react-icons/fa6";
import DataTable from "../../components/DataTable";
import { useGetAllOrder } from "../../hooks/useGetAllOrder";
import { useState } from "react";
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
];

const statuses = [
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "In Progress",
    value: "in progress",
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
];

const Boosts = () => {
  const [searchKey, onSearchKey] = useState<string>("");
  const [gameKey, onGameKey] = useState<string[]>([]);
  const [statusKey, onStatusKey] = useState<string[]>([]);

  const orders = useGetAllOrder({ searchKey, gameKey, statusKey });

  return (
    <UserPage>
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-y-4">
          <div className="min-w-fit flex-1 flex-grow md:min-w-0">
            <div className="flex flex-wrap items-center gap-y-4">
              <div className="sm:truncate">
                <h1 className="font-display text-3xl font-semibold text-foreground sm:truncate sm:tracking-tight">
                  My Boosts List
                </h1>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 sm:justify-normal md:ml-4 md:mt-0">
            <a
              className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
              href="/"
            >
              <FaRocket className="mr-2" />
              Buy New Boost
            </a>
          </div>
        </div>

        {/* INFORMATION */}
        <DataTable headers={headers} items={orders}>
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
            {/* STATUS BUTTON */}
            <PlusButton
              selectedValues={statusKey}
              onSelectedValuesChange={(value: string[]) => onStatusKey(value)}
              name="Status"
              options={statuses}
            />
          </div>
        </DataTable>
      </div>
    </UserPage>
  );
};

export default Boosts;
