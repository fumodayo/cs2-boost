import clsx from "clsx";
import { useMemo, useState } from "react";
import { matchSorter } from "match-sorter";

import * as Popover from "@radix-ui/react-popover";
import * as Checkbox from "@radix-ui/react-checkbox";

import { FaPlus, FaCheck } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { ListOfGame } from "../../constants";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { Button } from "./Button";

interface PlusButtonProps {
  name: string;
  options: ListOfGame[];
  selectedValues: string[];
  onSelectedValuesChange: (value: string[]) => void;
}

const PlusButton: React.FC<PlusButtonProps> = ({
  name,
  options,
  selectedValues,
  onSelectedValuesChange,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentParams = queryString.parse(location.search);
  const [searchValue, setSearchValue] = useState<string>("");

  const matches = useMemo(() => {
    if (!searchValue) return options;
    const keys = ["label", "value"];
    const filteredLanguages = matchSorter(options, searchValue, { keys });
    return filteredLanguages;
  }, [searchValue, options]);

  const handleCheckboxChange = (languageValue: string) => {
    const updatedValues = selectedValues.includes(languageValue)
      ? selectedValues.filter((val) => val !== languageValue)
      : [...selectedValues, languageValue];
    onSelectedValuesChange(updatedValues);
    if (name === "Game") {
      const queryParams = { ...currentParams, gameKey: updatedValues };
      navigate({
        pathname: pathname,
        search: queryString.stringify(queryParams),
      });
    }
    if (name === "Status") {
      const queryParams = { ...currentParams, statusKey: updatedValues };
      navigate({
        pathname: pathname,
        search: queryString.stringify(queryParams),
      });
    }
    if (name === "Types") {
      const queryParams = { ...currentParams, typeKey: updatedValues };
      navigate({
        pathname: pathname,
        search: queryString.stringify(queryParams),
      });
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button
          color="transparent"
          className="h-8 rounded-md border border-dashed border-input px-3 text-xs font-medium shadow-sm"
        >
          <FaPlus className="mr-2" />
          {name}
          {selectedValues.length > 0 && (
            <>
              <div className="mx-2 h-4 w-px shrink-0 bg-secondary" />
              <div className={clsx("hidden space-x-1", "lg:flex")}>
                {selectedValues.length >= 3 ? (
                  <div className="inline-flex items-center rounded-sm border border-transparent bg-secondary px-1 py-0.5 text-xs font-normal text-secondary-foreground transition-colors">
                    {selectedValues.length} selected
                  </div>
                ) : (
                  selectedValues.map((selectedValue) => {
                    const matchingOption = options.find(
                      (option) => option.value === selectedValue,
                    );
                    return (
                      <div
                        key={selectedValue}
                        className={clsx(
                          "inline-flex items-center rounded-sm border border-transparent bg-secondary px-1 py-0.5 text-xs font-normal text-secondary-foreground transition-colors",
                          "hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        )}
                      >
                        {matchingOption ? matchingOption.label : selectedValue}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={10}
          className="popover-content w-[200px]"
        >
          <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">
            {/* SEARCH */}
            <div className="flex items-center border-b border-border px-3">
              <IoSearch className="mr-0.5 shrink-0 text-muted-foreground" />
              <input
                className={clsx(
                  "flex h-10 w-full rounded-lg border-transparent bg-transparent py-3 text-sm outline-none",
                  "placeholder:text-muted-foreground focus:border-0 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
                )}
                type="text"
                placeholder={name}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="scroll-custom max-h-[300px] overflow-y-auto overflow-x-hidden">
              <div className="max-h-[250px] overflow-hidden overflow-y-scroll p-1 text-foreground">
                {matches.map(({ label, value: languageValue, image }) => (
                  <Checkbox.Root
                    className={clsx(
                      "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                      "hover:bg-accent hover:text-accent-foreground",
                    )}
                    id={languageValue}
                    onCheckedChange={() => handleCheckboxChange(languageValue)}
                    checked={selectedValues.includes(languageValue)}
                  >
                    <Checkbox.Indicator>
                      {selectedValues.includes(languageValue) && (
                        <FaCheck className=" text-success" />
                      )}
                    </Checkbox.Indicator>
                    {image && (
                      <img
                        src={`/assets/${image}/logo.svg`}
                        className="ml-1 h-4 w-4 flex-shrink-0"
                      />
                    )}
                    <label className="ml-1" htmlFor={languageValue}>
                      {label}
                    </label>
                  </Checkbox.Root>
                ))}
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default PlusButton;
