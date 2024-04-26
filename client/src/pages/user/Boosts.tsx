import queryString from "query-string";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { FaRocket } from "react-icons/fa6";

import { listOfGame } from "../../constants";
import { useGetAllOrder } from "../../hooks/useGetAllOrder";
import UserPage from "../../components/Layouts/UserPage";
import DataTable from "../../components/DataTable";
import PlusButton from "../../components/Buttons/PlusButton";
import Navigation from "../../components/Navigation";

const headers = [
  { name: "title", value: "title", active: true },
  { name: "boost id", value: "id", active: true },
  { name: "client", value: "client", active: true },
  { name: "boosters", value: "boosters", active: true },
  { name: "status", value: "status", active: true },
  { name: "price", value: "price", active: true },
  { name: "last updated", value: "updated_at", active: true },
];

const statuses = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in progress" },
  { label: "Completed", value: "completed" },
  { label: "Inactive", value: "inactive" },
];

const Boosts = () => {
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
        statusKey: parsedParams.statusKey
          ? parsedParams.statusKey.toString().split(",")
          : [],
      };
    },
    [],
  );

  const [searchKey, setSearchKey] = useState<string>("");
  const [gameKey, setGameKey] = useState<string[]>([]);
  const [statusKey, setStatusKey] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string>("");
  // số lượng items trong 1 page
  const [perPage, setPerPage] = useState<number | null>(null);
  // current page number
  const [currentPage, setCurrentPage] = useState<number | null>(null);

  useEffect(() => {
    const params = queryString.stringify({
      searchKey: searchKey || undefined,
      gameKey: gameKey.length > 0 ? gameKey.join(",") : undefined,
      statusKey: statusKey.length > 0 ? statusKey.join(",") : undefined,
      sortKey: sortKey.length > 0 ? sortKey : undefined,
      page: currentPage || undefined,
      pageSize: perPage || undefined,
    });

    const hasValues =
      gameKey.length > 0 ||
      searchKey ||
      statusKey.length > 0 ||
      sortKey.length > 0 ||
      currentPage ||
      perPage;
    const path = hasValues ? `?${params}` : "/dashboard/boosts";
    navigate(path);
  }, [searchKey, gameKey, statusKey, navigate, sortKey, currentPage, perPage]);

  useEffect(() => {
    const parsedState = parseParamsToState(location.search);
    setSearchKey(parsedState.searchKey);
    setGameKey(parsedState.gameKey);
    setStatusKey(parsedState.statusKey);
  }, [location.search, parseParamsToState]);

  const { orders, countingPage, page, pages } = useGetAllOrder() ?? {
    orders: [],
  };

  const resetFilters = () => {
    setSearchKey("");
    setGameKey([]);
    setStatusKey([]);
    setSortKey("");
  };

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
                  className="flex h-8 w-[150px] rounded-md border border-input bg-card-alt px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 lg:w-[250px]"
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
              {/* STATUS BUTTON */}
              <PlusButton
                selectedValues={statusKey}
                onSelectedValuesChange={(value: string[]) =>
                  setStatusKey(value)
                }
                name="Status"
                options={statuses}
              />
              {(searchKey ||
                gameKey.length > 0 ||
                statusKey.length > 0 ||
                sortKey.length > 0) && (
                <button
                  onClick={resetFilters}
                  type="button"
                  className="relative inline-flex h-8 items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-transparent px-2 py-1.5 text-xs font-medium text-secondary-light-foreground outline-none transition-colors hover:bg-secondary-light focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 lg:px-3"
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

export default Boosts;
