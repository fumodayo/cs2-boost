import UserPage from "../../components/Layouts/UserPage";
import { FaRocket } from "react-icons/fa6";
import DataTable from "../../components/DataTable";
import { useGetAllOrder } from "../../hooks/useGetAllOrder";
import { useState } from "react";

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
                  Boosts List
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

export default Boosts;
