import React from "react";
import { IPagination } from "~/types";
import { Spinner } from "~/components/ui/Feedback";
import { ErrorDisplay } from "~/components/ui/Feedback";
import { Pagination } from "./partials";
import { useTranslation } from "react-i18next";

interface DataTableLayoutProps<T> {
  filterBar: React.ReactNode;
  isLoading: boolean;
  error: string;
  data: T[] | undefined;
  pagination: IPagination | undefined;
  children: (data: T[]) => React.ReactNode;
}

const DataTableLayout = <T,>({
  filterBar,
  isLoading,
  error,
  data,
  pagination,
  children,
}: DataTableLayoutProps<T>) => {
  const { t } = useTranslation("datatable");
  const dataFromAPI = data || [];

  return (
    <>
      {filterBar}

      {isLoading && dataFromAPI.length === 0 && (
        <div className="flex h-96 items-center justify-center">
          <Spinner />
        </div>
      )}

      {error && <ErrorDisplay message={t("errors.load_data_failed")} />}

      {!error && !isLoading && children(dataFromAPI)}

      {pagination && pagination.totalPages > 0 && (
        <div className="mt-6 flex justify-end border-t border-border pt-4">
          <Pagination pagination={pagination} />
        </div>
      )}
    </>
  );
};

export default DataTableLayout;