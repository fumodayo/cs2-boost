import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useSWR from "swr";
import {
  FiUsers,
  FiWifi,
  FiChevronRight,
  FiSearch,
  FiShield,
} from "react-icons/fi";
import { ErrorDisplay, Footer, Header, Helmet, Input } from "~/components/ui";
import { RangeFilter, ResetButton } from "~/components/ui";
import { Card } from "./components";
import { useDebounce } from "~/hooks/useDebounce";
import { useSocketContext } from "~/hooks/useSocketContext";
import { Button } from "~/components/ui/Button";
import { IUser } from "~/types";
import { useTranslation } from "react-i18next";
import { userService } from "~/services/user.service";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { Pagination } from "~/components/ui/DataTable/partials";
import { AppContext } from "~/components/context/AppContext";
import { ROLE } from "~/types/constants";
const HeroSection = () => {
  const { t } = useTranslation("partners_page");
  const navigate = useNavigate();
  const { toggleLoginModal } = useContext(AppContext);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const isPartner = currentUser?.role.includes(ROLE.PARTNER);
  const isLoggedIn = !!currentUser;
  const handleViewAllDeals = () => {
    if (!isLoggedIn) {
      toggleLoginModal();
      return;
    }
    if (isPartner) {
      navigate("/pending-boosts");
    } else {
      navigate("/settings");
    }
  };
  const handleApplyPartnership = () => {
    if (!isLoggedIn) {
      toggleLoginModal();
      return;
    }
    navigate("/settings");
  };
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/20">
            <FiShield className="h-4 w-4" />
            {t("hero.badge")}
          </div>
          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("hero.title_part1")}{" "}
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              {t("hero.title_part2")}
            </span>
          </h1>
          {/* Subtitle */}
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            {t("hero.subtitle")}
          </p>
          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              variant="primary"
              className="gap-2 rounded-full px-6 py-3"
              onClick={handleViewAllDeals}
            >
              {t("hero.view_all_deals")}
            </Button>
            {/* Only show Apply for Partnership if NOT a partner */}
            {!isPartner && (
              <Button
                variant="outline"
                className="gap-2 rounded-full px-6 py-3"
                onClick={handleApplyPartnership}
              >
                {t("hero.apply_partnership")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
const STAR_DEFAULT_VALUE: [number, number] = [0, 5];
const RATE_DEFAULT_VALUE: [number, number] = [0, 100];
const PartnersPage = () => {
  const { t } = useTranslation("partners_page");
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUser?._id,
  );
  const { onlinePartners } = useSocketContext();
  const [localSearchTerm, setLocalSearchTerm] = useState(
    searchParams.get("q") || "",
  );
  const debouncedSearchTerm = useDebounce(localSearchTerm, 500);
  const [filterOnline, setFilterOnline] = useState(false);
  const paramsString = searchParams.toString();
  const apiParams = useMemo(() => {
    const params = Object.fromEntries(new URLSearchParams(paramsString));
    if (currentUserId) {
      params.partner_id = currentUserId;
    }
    return params;
  }, [paramsString, currentUserId]);
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
  useEffect(() => {
    const currentQuery = searchParams.get("q") || "";
    if (debouncedSearchTerm !== currentQuery) {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          if (debouncedSearchTerm) {
            newParams.set("q", debouncedSearchTerm);
          } else {
            newParams.delete("q");
          }
          newParams.delete("page");
          return newParams;
        },
        { replace: true },
      );
    }
  }, [debouncedSearchTerm, searchParams, setSearchParams]);
  const partnersFromAPI = partnersData?.data;
  const paginationFromAPI = partnersData?.pagination;
  const filteredPartners = useMemo(() => {
    if (!partnersFromAPI) return [];
    if (!filterOnline) return partnersFromAPI;
    return partnersFromAPI.filter((partner: IUser) =>
      partner._id ? onlinePartners.includes(partner._id) : false,
    );
  }, [partnersFromAPI, filterOnline, onlinePartners]);
  const handleReset = () => {
    setSearchParams({}, { replace: true });
    setLocalSearchTerm("");
    setFilterOnline(false);
  };
  return (
    <>
      <Helmet title="partners_page" />
      <Header />
      {/* Hero Section */}
      <HeroSection />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb & Search Row */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("breadcrumb.home")}
            </Link>
            <FiChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-foreground">
              {t("breadcrumb.partners")}
            </span>
          </nav>
          {/* Search Bar */}
          <div className="relative w-full max-w-md">
            <FiSearch className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              placeholder={t("search_placeholder")}
              className="h-12 w-full pl-12 pr-4"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-3 rounded-xl border border-border bg-card p-5 shadow-sm">
              {/* Header */}
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {t("filters_title")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("filters_subtitle")}
                </p>
              </div>
              {/* Online Filter */}
              <Button
                variant={filterOnline ? "primary" : "outline"}
                onClick={() => setFilterOnline((prev) => !prev)}
                className="w-full gap-2 py-2"
              >
                <FiWifi size={14} />
                {t("online_partners_btn")}
              </Button>
              {/* Range Filters */}
              <RangeFilter
                min={0}
                max={5}
                step={0.5}
                defaultValue={STAR_DEFAULT_VALUE}
                label={t("rating_filter")}
                type="star"
              />
              <RangeFilter
                min={0}
                max={100}
                step={5}
                defaultValue={RATE_DEFAULT_VALUE}
                label={t("completion_filter")}
                type="rate"
              />
              {/* Reset */}
              {(searchParams.size > 0 || filterOnline) && (
                <ResetButton onReset={handleReset} />
              )}
            </div>
          </aside>
          {/* Partners Grid */}
          <section className="lg:col-span-3">
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiUsers className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {t("results_found", { count: filteredPartners.length })}
                </span>
              </div>
            </div>
            {/* Loading State */}
            {isLoading && !partnersFromAPI && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 animate-pulse rounded-xl bg-card"
                  ></div>
                ))}
              </div>
            )}
            {/* Error State */}
            {error && (
              <ErrorDisplay
                message="Could not fetch partners. Please try again."
                onRetry={mutate}
              />
            )}
            {/* Partners Grid */}
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
                <div className="flex h-96 flex-col items-center justify-center rounded-xl bg-card text-muted-foreground">
                  <FiUsers className="h-16 w-16" />
                  <p className="mt-4 text-lg font-semibold">
                    {t("empty_state.title")}
                  </p>
                  <p className="mt-1 text-sm">{t("empty_state.subtitle")}</p>
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