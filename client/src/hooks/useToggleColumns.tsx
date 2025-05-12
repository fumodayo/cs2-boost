import { useEffect, useState } from "react";
import { IDataListHeaders } from "~/constants/headers";
import { getLocalStorage, setLocalStorage } from "~/utils/localStorage";

export const useToggleColumns = (
  storageKey: string,
  initialHeaders: IDataListHeaders[],
) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    getLocalStorage(
      storageKey,
      initialHeaders.map((header) => header.value),
    ),
  );

  useEffect(() => {
    setLocalStorage(storageKey, selectedColumns);
  }, [storageKey, selectedColumns]);

  const toggleColumn = (value: string) => {
    setSelectedColumns((prev) =>
      prev.includes(value)
        ? prev.filter((col) => col !== value)
        : [...prev, value],
    );
  };

  const visibleHeaders = initialHeaders.filter((header) =>
    selectedColumns.includes(header.value),
  );

  return { selectedColumns, toggleColumn, visibleHeaders };
};
