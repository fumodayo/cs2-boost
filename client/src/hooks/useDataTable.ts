import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";
import { useDebounce } from "./useDebounce";
import { useToggleColumns } from "./useToggleColumns";
import { useSocketContext } from "./useSocketContext";
import { IDataListHeaders } from "~/constants/headers";

interface DataTableConfig<T> {
  swrKey: string;
  fetcher: (params: URLSearchParams) => Promise<T>;
  initialFilters: Record<string, string | string[]>;
  columnConfig: {
    key: string;
    headers: IDataListHeaders[];
  };
  socketEvent?: string;
}

export const useDataTable = <T>({
  swrKey,
  fetcher,
  initialFilters,
  columnConfig,
  socketEvent,
}: DataTableConfig<T>) => {
  const { socket } = useSocketContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const isInitialMount = useRef(true);

  const [filters, setFilters] = useState(() => {
    const newFilters: Record<string, string | string[]> = {};
    for (const key in initialFilters) {
      const valueFromUrl = searchParams.getAll(key);
      if (Array.isArray(initialFilters[key])) {
        newFilters[key] = valueFromUrl.length > 0 ? valueFromUrl : [];
      } else {
        newFilters[key] = valueFromUrl[0] || "";
      }
    }
    return newFilters;
  });

  const debouncedSearch = useDebounce((filters.search as string) || "", 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if ("search" in filters) {
      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      } else {
        params.delete("search");
      }
    }

    for (const key in filters) {
      if (key === "search") continue;

      params.delete(key);
      const value = filters[key];
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else if (value) {
        params.set(key, value as string);
      }
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const oldParams = new URLSearchParams(searchParams);
      oldParams.delete("page");
      const newParams = new URLSearchParams(params);
      newParams.delete("page");

      if (oldParams.toString() !== newParams.toString()) {
        params.set("page", "1");
      }
    }

    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, debouncedSearch, setSearchParams]);

  const setFilter = (key: string, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const { data, error, isLoading, mutate } = useSWR(
    `${swrKey}?${searchParams.toString()}`,
    () => fetcher(searchParams),
    { keepPreviousData: true },
  );

  useEffect(() => {
    if (!socket || !socketEvent) return;
    const handleEvent = () => mutate();
    socket.on(socketEvent, handleEvent);
    return () => {
      socket.off(socketEvent, handleEvent);
    };
  }, [socket, mutate, socketEvent]);

  const { selectedColumns, visibleHeaders, toggleColumn } = useToggleColumns(
    columnConfig.key,
    columnConfig.headers,
  );

  const handleReset = () => {
    setFilters(initialFilters);
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isAnyFilterActive = Object.entries(filters).some(([_, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    return !!value;
  });

  return {
    data,
    error,
    isLoading,
    mutate,
    filters,
    setFilter,
    handleReset,
    isAnyFilterActive,
    selectedColumns,
    visibleHeaders,
    toggleColumn,
  };
};
