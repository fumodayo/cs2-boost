import UserPage from "../../components/Layouts/UserPage";
import DataTable from "../../components/DataTable";
import { useEffect, useState } from "react";
import { usePendingOrder } from "../../hooks/usePendingOrder";
import PlusButton from "../../components/Buttons/PlusButton";
import { listOfGame } from "../../constants";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import Navigation from "../../components/Navigation";
import clsx from "clsx";
import SEO from "../../components/SEO";

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
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = useLocation();
  const currentParams = queryString.parse(location.search);

  const parseArray = (status: string[]) => {
    if (Array.isArray(status)) {
      return status.filter((item) => typeof item === "string");
    }
    if (typeof status === "string") {
      return [status];
    }
    return [];
  };

  const [searchKey, setSearchKey] = useState<string>(() => {
    return (currentParams.searchKey as string) || "";
  });
  const [gameKey, setGameKey] = useState<string[]>(() => {
    return parseArray(currentParams.statusKey as string[]);
  });

  const handleSearch = (value: string) => {
    const queryParams = { ...currentParams, searchKey: value };
    navigate({
      pathname: pathname,
      search: queryString.stringify(queryParams),
    });
  };

  useEffect(() => {
    const params = queryString.parse(location.search);
    setGameKey(parseArray(params.gameKey as string[]));
    setSearchKey(params.searchKey as string);
  }, [location.search]);

  const { orders, countingPage, page, pages } = usePendingOrder() ?? {
    orders: [],
  };

  const resetFilters = () => {
    navigate({ search: "" });
    setSearchKey("");
  };

  return (
    <>
      <SEO
        title="Pending Boosts List"
        description="Pending Boosts List"
        href="/dashboard/pending-boosts"
      />

      <UserPage>
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-y-4">
            <div className={clsx("min-w-fit flex-1 flex-grow", "md:min-w-0")}>
              <div className="flex flex-wrap items-center gap-y-4">
                <div className="sm:truncate">
                  <h1
                    className={clsx(
                      "font-display text-3xl font-semibold text-foreground",
                      "sm:truncate sm:tracking-tight",
                    )}
                  >
                    Pending Boosts List
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* INFORMATION */}
          <div className="mt-8 space-y-4">
            <DataTable headers={headers} items={orders ?? []}>
              <div className="flex flex-1 flex-wrap items-center gap-2">
                {/* SEARCH */}
                <div className="w-fit">
                  <input
                    value={searchKey}
                    onChange={(e) => handleSearch(e.target.value)}
                    className={clsx(
                      "flex h-8 w-[150px] rounded-md border border-input bg-card-alt px-3 py-1 text-sm shadow-sm transition-colors",
                      "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      "lg:w-[250px]",
                    )}
                    placeholder="Search..."
                    type="text"
                  />
                </div>
                {/* GAME BUTTON */}
                <PlusButton
                  selectedValues={gameKey}
                  onSelectedValuesChange={(value: string[]) =>
                    setGameKey(value)
                  }
                  name="Game"
                  options={listOfGame}
                />
                {location.search && (
                  <button
                    onClick={resetFilters}
                    type="button"
                    className={clsx(
                      "relative inline-flex h-8 items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-transparent px-2 py-1.5 text-xs font-medium text-secondary-light-foreground outline-none transition-colors ",
                      "hover:bg-secondary-light focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                      "lg:px-3",
                    )}
                  >
                    Reset
                    <IoMdClose className="ml-2" />
                  </button>
                )}
              </div>
            </DataTable>
            <Navigation countingPage={countingPage} page={page} pages={pages} />
          </div>
        </div>
      </UserPage>
    </>
  );
};

export default PendingBoosts;
