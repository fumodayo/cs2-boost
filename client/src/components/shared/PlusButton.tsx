import * as Checkbox from "@radix-ui/react-checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../@radix-ui/Popover";
import { Button } from "./Button";
import { GoPlus } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { useEffect, useMemo, useState } from "react";
import { matchSorter } from "match-sorter";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

interface IPlusButtonProps {
  name?: string;
  lists?: { label: string; value: string }[];
  selectValues: string[];
  setSelectValues: React.Dispatch<React.SetStateAction<string[]>>;
}

const PlusButton = ({
  name,
  lists = [],
  selectValues,
  setSelectValues,
}: IPlusButtonProps) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const handleCheckedChange = (value: string, isChecked: boolean) => {
    setSelectValues((prev) =>
      isChecked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.delete(`filter-${name}`);
    selectValues.forEach((status) => {
      params.append(`filter-${name}`, status);
    });
    setSearchParams(params);
  }, [selectValues, searchParams]);

  useEffect(() => {
    setSelectValues(searchParams.getAll(`filter-${name}`));
  }, []);

  const newOptions = useMemo(() => {
    if (!searchValue) return lists;
    const keys = ["label", "value"];
    const matchOptions = matchSorter(lists, searchValue, { keys });
    return matchOptions;
  }, [searchValue, lists]);

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          color="transparent"
          className="h-8 rounded-md border border-dashed border-input px-3 text-xs font-medium shadow-sm"
        >
          <GoPlus size={18} className="mr-1" />
          {t(`DataTable.PlusButton.label.${name}`, { defaultValue: name })}
          {selectValues.length > 0 && (
            <>
              <div className="mx-2 h-4 w-px shrink-0 bg-secondary" />
              <div className="hidden space-x-1 lg:flex">
                {selectValues.length >= 3 ? (
                  <div className="inline-flex items-center rounded-sm border border-transparent bg-secondary px-1 py-0.5 text-xs font-normal text-secondary-foreground transition-colors">
                    {selectValues.length +
                      " " +
                      t("DataTable.PlusButton.label.selected")}
                  </div>
                ) : (
                  <div className="space-x-1">
                    {newOptions
                      .filter(({ value }) => selectValues.includes(value))
                      .map(({ label }) => (
                        <div
                          key={uuidv4()}
                          className="inline-flex items-center rounded-sm border border-transparent bg-secondary px-1 py-0.5 text-xs font-normal text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          {t(`DataTable.PlusButton.label.${label}`, {
                            defaultValue: label,
                          })}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={10}
        className="w-[200px]"
      >
        <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">
          <div className="flex items-center border-b px-3">
            {/* SEARCH */}
            <IoSearch
              size={18}
              className="mr-0.5 shrink-0 text-muted-foreground"
            />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              type="text"
              placeholder={
                t("DataTable.PlusButton.label.Search") +
                " " +
                t(`DataTable.PlusButton.label.${name}`)
              }
              className="flex h-10 w-full rounded-lg border-transparent bg-transparent px-2 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-0 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          {/* SELECT LIST */}
          <div className="scroll-custom max-h-[300px] overflow-y-auto overflow-x-hidden">
            <div className="max-h-[250px] overflow-hidden overflow-y-scroll p-1 text-foreground">
              {newOptions.map(({ label, value }) => (
                <Checkbox.Root
                  key={uuidv4()}
                  checked={selectValues.includes(value)}
                  onCheckedChange={(isChecked) =>
                    handleCheckedChange(value, isChecked as boolean)
                  }
                  className="relative flex w-full cursor-pointer select-none rounded-sm px-2 py-1.5 text-start text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center">
                    <Checkbox.Indicator className="flex items-center justify-center">
                      <FaCheck className="text-success" />
                    </Checkbox.Indicator>
                  </span>
                  <span className="ml-2">
                    {t(`DataTable.PlusButton.label.${label}`, {
                      defaultValue: label,
                    })}
                  </span>
                </Checkbox.Root>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PlusButton;
