import React from "react";
import { IPagination } from "~/types";
import Spinner from "../Spinner";
import ErrorDisplay from "../ErrorDisplay";
import { Pagination } from "./partials";

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
  const dataFromAPI = data || [];

  return (
    <>
      {filterBar}

      {isLoading && dataFromAPI.length === 0 && (
        <div className="flex h-96 items-center justify-center">
          <Spinner />
        </div>
      )}

      {error && (
        <ErrorDisplay message="Failed to load data. Please try again." />
      )}

      {!error && children(dataFromAPI)}

      {pagination && pagination.totalPages > 0 && (
        <Pagination pagination={pagination} />
      )}
    </>
  );
};

export default DataTableLayout;
