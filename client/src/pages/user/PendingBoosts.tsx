import UserPage from "../../components/Layouts/UserPage";
import DataTable from "../../components/DataTable";
import { useEffect, useMemo, useState } from "react";
import { usePendingOrder } from "../../hooks/usePendingOrder";
import PlusButton from "../../components/Buttons/PlusButton";
import { listOfGame } from "../../constants";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import Navigation from "../../components/Navigation";
import clsx from "clsx";

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

  const parseParamsToState = useMemo(
    () => (params: string) => {
      const parsedParams = queryString.parse(params);
      return {
        searchKey: parsedParams.searchKey
          ? parsedParams.searchKey.toString()
          : "",
        gameKey: parsedParams.gameKey
          ? parsedParams.gameKey.toString().split(",")
          : [],
      };
    },
    [],
  );

  const [searchKey, setSearchKey] = useState<string>("");
  const [gameKey, setGameKey] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string>("");
  // số lượng items trong 1 page
  const [perPage, setPerPage] = useState<number | null>(null);
  // current page number
  const [currentPage, setCurrentPage] = useState<number | null>(null);

  useEffect(() => {
    const params = queryString.stringify({
      searchKey: searchKey || undefined,
      gameKey: gameKey.length > 0 ? gameKey.join(",") : undefined,
      sortKey: sortKey.length > 0 ? sortKey : undefined,
      page: currentPage || undefined,
      pageSize: perPage || undefined,
    });

    const hasValues =
      gameKey.length > 0 ||
      searchKey ||
      sortKey.length > 0 ||
      currentPage ||
      perPage;
    const path = hasValues ? `?${params}` : "/dashboard/pending-boosts";
    navigate(path);
  }, [searchKey, gameKey, navigate, sortKey, currentPage, perPage]);

  useEffect(() => {
    const parsedState = parseParamsToState(location.search);
    setSearchKey(parsedState.searchKey);
    setGameKey(parsedState.gameKey);
  }, [location.search, parseParamsToState]);

  const { orders, countingPage, page, pages } = usePendingOrder() ?? {
    orders: [],
  };

  const resetFilters = () => {
    setSearchKey("");
    setGameKey([]);
    setSortKey("");
  };

  return (
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
          <DataTable
            headers={headers}
            items={orders ?? []}
            onSortKey={setSortKey}
          >
            <div className="flex flex-1 flex-wrap items-center gap-2">
              {/* SEARCH */}
              <div className="w-fit">
                <input
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
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
                onSelectedValuesChange={(value: string[]) => setGameKey(value)}
                name="Game"
                options={listOfGame}
              />
              {(searchKey || gameKey.length > 0 || sortKey.length > 0) && (
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
          <Navigation
            onPerPage={(value) => setPerPage(value)}
            onCurrentPage={(value) => setCurrentPage(value)}
            countingPage={countingPage}
            page={page}
            pages={pages}
          />
        </div>
      </div>
    </UserPage>
  );
};

export default PendingBoosts;
