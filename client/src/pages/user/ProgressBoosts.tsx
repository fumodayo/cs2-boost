import { MdOutlinePendingActions } from "react-icons/md";
import UserPage from "../../components/Layouts/UserPage";
import { useProgressOrder } from "../../hooks/useProgressOrder";
import DataTable from "../../components/DataTable";
import { useState } from "react";
import { IoReceiptSharp } from "react-icons/io5";
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

const statuses = [
  {
    label: "In Progress",
    value: "in progress",
  },
  {
    label: "Completed",
    value: "completed",
  },
];

interface WidgetBoostProps {
  title?: string;
  value?: number;
  status: string;
  onStatusKey: (value: string[]) => void;
}

const WidgetBoost: React.FC<WidgetBoostProps> = ({
  title,
  value,
  status,
  onStatusKey,
}) => {
  return (
    <div className="-mx-4 my-4 min-w-[200px] border border-border/50 bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl">
      <div className="px-4 py-6 sm:px-6">
        <dt className="text-sm font-medium leading-6 text-muted-foreground">
          {title}
        </dt>
        <dd className="w-full flex-none">
          <span className="text-3xl font-semibold leading-10 tracking-tight text-primary">
            {value}
          </span>
          <span className="pl-1 text-sm font-medium text-muted-foreground">
            ORDER
          </span>
        </dd>
      </div>
      <div className="flex items-center border-t border-border bg-muted/50 px-4 py-3 sm:rounded-b-xl sm:px-6">
        <button
          type="submit"
          onClick={() => onStatusKey([status])}
          className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-transparent px-2 py-1.5 text-xs font-medium text-secondary-light-foreground outline-none transition-colors hover:bg-secondary-light focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
        >
          <IoReceiptSharp className="mr-2" /> View More
        </button>
      </div>
    </div>
  );
};

const ProgressBoosts = () => {
  const [searchKey, onSearchKey] = useState<string>("");
  const [gameKey, onGameKey] = useState<string[]>([]);
  const [statusKey, onStatusKey] = useState<string[]>([]);

  const progressBoosts = useProgressOrder({ searchKey, gameKey, statusKey });
  const orders = progressBoosts ? progressBoosts.orders : [];

  return (
    <UserPage>
      <div className="container">
        <div className="flex flex-wrap gap-y-4">
          <div className="min-w-fit flex-1 flex-grow md:min-w-0">
            <div className="flex flex-wrap items-center gap-y-4">
              <div className="sm:truncate">
                <h1 className="font-display text-3xl font-semibold text-foreground sm:truncate sm:tracking-tight">
                  Progress Boosts List
                </h1>
                <div className="flex flex-wrap gap-x-5">
                  <WidgetBoost
                    title="Progress Boosts"
                    value={progressBoosts?.in_progress}
                    status="in progress"
                    onStatusKey={onStatusKey}
                  />
                  <WidgetBoost
                    title="Completed Boosts"
                    value={progressBoosts?.completed}
                    status="completed"
                    onStatusKey={onStatusKey}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-start justify-start gap-2 sm:justify-normal md:ml-4 md:mt-0">
            <a
              className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
              href="/dashboard/pending-boosts"
            >
              <MdOutlinePendingActions className="mr-2 text-xl" />
              Get More Boost
            </a>
          </div>
        </div>

        {/* INFORMATION */}
        <DataTable name="progress" headers={headers} items={orders}>
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

export default ProgressBoosts;