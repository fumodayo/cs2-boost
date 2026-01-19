import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";
import { useDebounce } from "./useDebounce";
import { useToggleColumns } from "./useToggleColumns";
import { useSocketContext } from "./useSocketContext";
import { IDataListHeaders } from "~/constants/headers";
type FilterValue = string | string[];
type FiltersState<T extends Record<string, FilterValue>> = T;
interface DataTableConfig<TData, TFilters extends Record<string, FilterValue>> {
  swrKey: string;
  fetcher: (params: URLSearchParams) => Promise<TData>;
  initialFilters: TFilters;
  columnConfig: {
    key: string;
    headers: IDataListHeaders[];
  };
  socketEvent?: string;
}
export const useDataTable = <
  TData,
  TFilters extends Record<string, FilterValue> = Record<string, FilterValue>,
>({
  swrKey,
  fetcher,
  initialFilters,
  columnConfig,
  socketEvent,
}: DataTableConfig<TData, TFilters>) => {
  const { socket } = useSocketContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const isInitialMount = useRef(true);
  const [filters, setFilters] = useState<FiltersState<TFilters>>(() => {
    const newFilters = {} as TFilters;
    for (const key in initialFilters) {
      const valueFromUrl = searchParams.getAll(key);
      if (Array.isArray(initialFilters[key])) {
        (newFilters as Record<string, FilterValue>)[key] =
          valueFromUrl.length > 0 ? valueFromUrl : [];
      } else {
        (newFilters as Record<string, FilterValue>)[key] =
          valueFromUrl[0] || "";
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
  }, [filters, debouncedSearch, setSearchParams]);
  const setFilter = (key: string, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const { data, error, isLoading, mutate } = useSWR(
    `${swrKey}${swrKey.includes("?") ? "&" : "?"}${searchParams.toString()}`,
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