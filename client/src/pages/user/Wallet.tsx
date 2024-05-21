import PlusButton from "../../components/Buttons/PlusButton";
import DataTable from "../../components/DataTable";
import UserPage from "../../components/Layouts/UserPage";
import { useEffect, useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Navigation from "../../components/Navigation";
import clsx from "clsx";
import { FaRocket } from "react-icons/fa";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAllWallet } from "../../hooks/useGetAllWallet";

const headers = [
  {
    name: "transaction id",
    value: "_id",
    active: true,
  },
  {
    name: "order id",
    value: "boost_id",
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
  const navigate = useNavigate();
  const location = useLocation();

  const parseParamsToState = useMemo(
    () => (params: string) => {
      const parsedParams = queryString.parse(params);
      return {
        searchKey: parsedParams.searchKey
          ? parsedParams.searchKey.toString()
          : "",
        statusKey: parsedParams.statusKey
          ? parsedParams.statusKey.toString().split(",")
          : [],
      };
    },
    [],
  );

  const [searchKey, setSearchKey] = useState<string>("");
  const [typeKey, setTypeKey] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string>("");

  // số lượng items trong 1 page
  const [perPage, setPerPage] = useState<number | null>(null);
  // current page number
  const [currentPage, setCurrentPage] = useState<number | null>(null);

  useEffect(() => {
    const params = queryString.stringify({
      searchKey: searchKey || undefined,
      typeKey: typeKey.length > 0 ? typeKey.join(",") : undefined,
      sortKey: sortKey.length > 0 ? sortKey : undefined,
      page: currentPage || undefined,
      pageSize: perPage || undefined,
    });

    const hasValues = typeKey.length > 0 || searchKey || currentPage || perPage;
    const path = hasValues ? `?${params}` : "/dashboard/wallet";
    navigate(path);
  }, [searchKey, navigate, typeKey, currentPage, perPage, sortKey]);

  useEffect(() => {
    const parsedState = parseParamsToState(location.search);
    setSearchKey(parsedState.searchKey);
  }, [location.search, parseParamsToState]);

  const { invoices, countingPage, page, pages } = useGetAllWallet() ?? {
    invoices: [],
  };

  const resetFilters = () => {
    setSearchKey("");
    setTypeKey([]);
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
                  My Boosts List
                </h1>
              </div>
            </div>
          </div>
          <div
            className={clsx(
              "flex items-center justify-end gap-2",
              "sm:justify-normal md:ml-4 md:mt-0",
            )}
          >
            <a
              className={clsx(
                "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors",
                "hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
              )}
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
            items={invoices ?? []}
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

              {/* TYPES BUTTON */}
              <PlusButton
                selectedValues={typeKey}
                onSelectedValuesChange={(value: string[]) => setTypeKey(value)}
                name="Status"
                options={types}
              />
              {(searchKey || typeKey.length > 0 || sortKey.length > 0) && (
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

export default Wallet;
