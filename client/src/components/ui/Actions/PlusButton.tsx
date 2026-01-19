import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/@radix-ui/Popover";
import { Button } from "~/components/ui/Button";
import { GoPlus } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { useMemo, useState } from "react";
import { matchSorter } from "match-sorter";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import * as Checkbox from "@radix-ui/react-checkbox";
import { IStatusProps } from "~/constants/order";

interface IPlusButtonProps {
  name: string;
  lists: IStatusProps[];
  selectValues: string[];
  setSelectValues: (value: string[]) => void;
}

const PlusButton: React.FC<IPlusButtonProps> = ({
  name,
  lists = [],
  selectValues,
  setSelectValues,
}) => {
  const { t } = useTranslation("datatable");
  const [searchValue, setSearchValue] = useState("");

  const safeSelectValues = useMemo(
    () => (Array.isArray(selectValues) ? selectValues : []),
    [selectValues],
  );

  const handleCheckedChange = (value: string, isChecked: boolean) => {
    const newValues = isChecked
      ? [...safeSelectValues, value]
      : safeSelectValues.filter((v) => v !== value);
    setSelectValues(newValues);
  };

  const filteredOptions = useMemo(() => {
    if (!searchValue.trim()) return lists;
    return matchSorter(lists, searchValue, {
      keys: ["translationKey", "value"],
    });
  }, [searchValue, lists]);

  const selectedLabels = useMemo(
    () =>
      lists
        .filter((item) => safeSelectValues.includes(item.value))
        .map((item) => t(`filters.labels.${item.translationKey}`)),
    [lists, safeSelectValues, t],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-8 gap-1.5 rounded-md border-input px-3 text-xs font-medium"
        >
          <GoPlus size={14} />
          {t(`filters.labels.${name}`)}

          {selectedLabels.length > 0 && (
            <>
              <div className="mx-1 h-4 w-px bg-border" />
              <div className="flex items-center gap-1">
                {selectedLabels.length >= 3 ? (
                  <div className="inline-flex items-center rounded-sm border border-transparent bg-secondary px-1 py-0.5 text-xs font-normal text-secondary-foreground transition-colors">
                    {safeSelectValues.length + " " + "seleted"}
                  </div>
                ) : (
                  selectedLabels.map((label) => (
                    <div
                      key={label}
                      className="rounded-sm bg-muted px-1.5 py-0.5 font-normal text-muted-foreground"
                    >
                      {label}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-52 p-0">
        <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">
          {/* Search Input */}
          <div className="flex items-center border-b border-border px-2">
            <IoSearch className="shrink-0 text-muted-foreground" />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t(`filters.labels.${name}`)}
              className="h-9 w-full rounded-lg border-none bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-0"
            />
          </div>

          {/* Select List */}
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(({ translationKey, value }) => (
                <Checkbox.Root
                  key={uuidv4()}
                  checked={safeSelectValues.includes(value)}
                  onCheckedChange={(isChecked) =>
                    handleCheckedChange(value, isChecked as boolean)
                  }
                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-start text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center">
                    <Checkbox.Indicator className="flex items-center justify-center">
                      <FaCheck className="text-success" />
                    </Checkbox.Indicator>
                  </span>
                  <span className="ml-2">
                    {t(`filters.labels.${translationKey}`)}
                  </span>
                </Checkbox.Root>
              ))
            ) : (
              <p className="p-4 text-center text-sm text-muted-foreground">
                No results found.
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PlusButton;