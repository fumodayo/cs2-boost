import PlusButton from "../../components/Buttons/PlusButton";
import DataTable from "../../components/DataTable";
import UserPage from "../../components/Layouts/UserPage";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Navigation from "../../components/Navigation";
import clsx from "clsx";
import { FaRocket } from "react-icons/fa";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAllWallet } from "../../hooks/useGetAllWallet";
import SEO from "../../components/SEO";

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
    return currentParams.searchKey as string;
  });

  const [typeKey, setTypeKey] = useState<string[]>(() => {
    return parseArray(currentParams.typeKey as string[]);
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
    setTypeKey(parseArray(params.typeKey as string[]));
    setSearchKey(params.searchKey as string);
  }, [location.search]);

  const { invoices, countingPage, page, pages } = useGetAllWallet() ?? {
    invoices: [],
  };

  const resetFilters = () => {
    navigate({ search: "" });
    setSearchKey("");
  };

  return (
    <>
      <SEO
        title="My Wallet"
        description="Wallet List"
        href="/dashboard/wallet"
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
            <DataTable headers={headers} items={invoices ?? []}>
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

                {/* TYPES BUTTON */}
                <PlusButton
                  selectedValues={typeKey}
                  onSelectedValuesChange={(value: string[]) =>
                    setTypeKey(value)
                  }
                  name="Types"
                  options={types}
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

export default Wallet;
