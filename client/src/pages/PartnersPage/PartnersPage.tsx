import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";
import { FiSliders, FiUsers, FiWifi } from "react-icons/fi";
import {
  ErrorDisplay,
  Footer,
  Header,
  Helmet,
} from "~/components/shared";
import { RangeFilter, ResetButton, Search } from "~/components/shared";
import { Card } from "./components";
import { useDebounce } from "~/hooks/useDebounce";
import { useSocketContext } from "~/hooks/useSocketContext";
import { Button } from "~/components/shared/Button";
import { IUser } from "~/types";
import { useTranslation } from "react-i18next";
import { userService } from "~/services/user.service";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { Pagination } from "~/components/shared/DataTable/partials";

const PartnersPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const { onlinePartners } = useSocketContext();

  const [localSearchTerm, setLocalSearchTerm] = useState(
    searchParams.get("q") || "",
  );
  const debouncedSearchTerm = useDebounce(localSearchTerm, 500);

  const [filterOnline, setFilterOnline] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearchTerm) {
      params.set("q", debouncedSearchTerm);
    } else {
      params.delete("q");
    }
    params.delete("page");
    setSearchParams(params, { replace: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, setSearchParams]);

  const apiParams = useMemo(() => {
    const params = Object.fromEntries(searchParams);
    if (currentUser?._id) {
      params.partner_id = currentUser._id;
    }
    return params;
  }, [searchParams, currentUser]);

  const swrKey = useMemo(() => {
    const queryString = new URLSearchParams(
      apiParams as Record<string, string>,
    ).toString();
    return `/user/get-partners?${queryString}`;
  }, [apiParams]);

  const {
    data: partnersData,
    error,
    isLoading,
    mutate,
  } = useSWR(swrKey, () => userService.getPartners(apiParams), {
    keepPreviousData: true,
  });

  const partnersFromAPI = partnersData?.data;
  const paginationFromAPI = partnersData?.pagination;

  const filteredPartners = useMemo(() => {
    if (!partnersFromAPI) return [];
    if (!filterOnline) return partnersFromAPI;

    return partnersFromAPI.filter((partner: IUser) =>
      onlinePartners.includes(partner._id as string),
    );
  }, [partnersFromAPI, filterOnline, onlinePartners]);

  const handleReset = () => {
    setSearchParams({}, { replace: true });
    setLocalSearchTerm("");
    setFilterOnline(false);
  };

  return (
    <>
      <Helmet title="Partners · CS2Boost" />
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* CỘT FILTER (ASIDE) */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6 rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <FiSliders className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  {t("PartnersPage.filtersTitle")}
                </h2>
              </div>

              <Search
                type="none"
                value={localSearchTerm}
                onChangeValue={setLocalSearchTerm}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterOnline ? "primary" : "outline"}
                  onClick={() => setFilterOnline((prev) => !prev)}
                  className="w-full gap-2 py-2"
                >
                  <FiWifi size={14} /> {t("PartnersPage.onlinePartnersBtn")}
                </Button>

                <RangeFilter
                  min={0}
                  max={5}
                  step={0.5}
                  defaultValue={[0, 5]}
                  label={t("PartnersPage.ratingFilter")}
                  type="star"
                />
                <RangeFilter
                  min={0}
                  max={100}
                  step={5}
                  defaultValue={[0, 100]}
                  label={t("PartnersPage.completionFilter")}
                  type="rate"
                />

                {(searchParams.size > 0 || filterOnline) && (
                  <div>
                    <ResetButton onReset={handleReset} />
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* CỘT KẾT QUẢ (SECTION) */}
          <section className="lg:col-span-3">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FiUsers className="h-6 w-6 text-muted-foreground" />
                <h1 className="text-3xl font-bold text-foreground">
                  {t("PartnersPage.title")}
                </h1>
              </div>
              <span className="font-semibold text-muted-foreground">
                {t("PartnersPage.resultsFound", {
                  count: filteredPartners.length,
                })}
              </span>
            </div>

            {isLoading && !partnersFromAPI && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 animate-pulse rounded-xl bg-card"
                  ></div>
                ))}
              </div>
            )}

            {error && (
              <ErrorDisplay
                message="Could not fetch partners. Please try again."
                onRetry={mutate}
              />
            )}

            {!isLoading &&
              !error &&
              (filteredPartners.length > 0 ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredPartners.map((partner: IUser) => (
                      <Card key={partner._id} {...partner} />
                    ))}
                  </div>
                  {paginationFromAPI && paginationFromAPI.totalPages > 0 && (
                    <Pagination pagination={paginationFromAPI} />
                  )}
                </div>
              ) : (
                <div className="flex h-96 flex-col items-center justify-center rounded-lg bg-card text-muted-foreground">
                  <FiUsers className="h-16 w-16" />
                  <p className="mt-4 text-lg font-semibold">
                    {t("PartnersPage.emptyState.title")}
                  </p>
                  <p className="mt-1 text-sm">
                    {t("PartnersPage.emptyState.subtitle")}
                  </p>
                </div>
              ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PartnersPage;
