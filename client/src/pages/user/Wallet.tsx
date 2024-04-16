import { MdAttachMoney } from "react-icons/md";
import PlusButton from "../../components/Buttons/PlusButton";
import DataTable from "../../components/DataTable";
import UserPage from "../../components/Layouts/UserPage";
import { useState } from "react";

const headers = [
  {
    name: "transaction id",
    value: "receipt_id",
    active: true,
  },
  {
    name: "order id",
    value: "order_id",
    active: true,
  },
  {
    name: "amount",
    value: "amount",
    active: true,
  },
  {
    name: "last updated",
    value: "updated_at",
    active: true,
  },
];

const types = [
  {
    label: "Level Farming",
    value: "level-farming",
  },
  {
    label: "Premier",
    value: "premier",
  },
  {
    label: "Wingman",
    value: "wingman",
  },
];

const Wallet = () => {
  const [searchKey, onSearchKey] = useState<string>("");
  const [typeKey, onTypeKey] = useState<string[]>([]);

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
              <MdAttachMoney className="mr-2" />
              Buy New Boost
            </a>
          </div>
        </div>

        {/* INFORMATION */}
        <DataTable headers={headers} items={[]}>
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

            {/* STATUS BUTTON */}
            <PlusButton
              selectedValues={typeKey}
              onSelectedValuesChange={onTypeKey}
              name="Type"
              options={types}
            />
          </div>
        </DataTable>
      </div>
    </UserPage>
  );
};

export default Wallet;
