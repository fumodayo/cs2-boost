import UserPage from "../../components/Layouts/UserPage";
import DataTable from "../../components/DataTable";
import { FaRocket } from "react-icons/fa6";

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

const items = [
  {
    id: "121614",
    title: "Arena 2v2, 0 1400, US",
    subtitle: "Arena 2v2",
    image: "https://cdn.gameboost.com/games/world-of-warcraft/logo/card.svg",
    username: "User name",
    avatar:
      "https://cdn.gameboost.com/users/19918/avatar/conversions/AAcHTtdFRpMwux-WHt9RoMHs81i8OXPo9eQNI82d1caCUqQLRjU=s96-c-thumb.webp",
    status: "pending",
    price: 15.2,
    updated_at: "a day ago",
    booster_id: "_",
  },
];

const Accounts = () => {
  return (
    <UserPage>
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-y-4">
          <div className="min-w-fit flex-1 flex-grow md:min-w-0">
            <div className="flex flex-wrap items-center gap-y-4">
              <div className="sm:truncate">
                <h1 className="font-display text-3xl font-semibold text-foreground sm:truncate sm:tracking-tight">
                  Accounts List
                </h1>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 sm:justify-normal md:ml-4 md:mt-0">
            <a
              className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
              href="#"
            >
              <FaRocket className="mr-2" />
              Browse Order
            </a>
          </div>
        </div>

        {/* INFORMATION */}
        <DataTable headers={headers} items={items} />
      </div>
      {/* HEADER */}
    </UserPage>
  );
};

export default Accounts;
