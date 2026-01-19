import React from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { LuArrowUpDown } from "react-icons/lu";
import {
  FaArrowUpWideShort,
  FaArrowDownWideShort,
  FaRegEyeSlash,
} from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../@radix-ui/Dropdown";
import { IDataListHeaders } from "~/constants/headers";
import { Button } from "../Button";
import { Separator } from "@radix-ui/react-dropdown-menu";

const sortOptions = [
  { translationKey: "asc", icon: FaArrowUpWideShort, value: "asc" },
  { translationKey: "desc", icon: FaArrowDownWideShort, value: "desc" },
  { translationKey: "hide", icon: FaRegEyeSlash, value: "hide" },
];

interface DataTableProps {
  headers: IDataListHeaders[];
  toggleColumn: (value: string) => void;
  itemCount: number;
  children: React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({
  headers,
  toggleColumn,
  itemCount,
  children,
}) => {
  const { t } = useTranslation("datatable");
  const [sortParams, setSortParams] = useSearchParams();

  const handleSort = (value: string, sortValue: string) => {
    const params = new URLSearchParams(sortParams);

    if (sortValue === "hide") {
      toggleColumn(value);
      return;
    }

    const currentSort = params.get("sort");
    const newSort = (sortValue === "asc" ? "" : "-") + value;

    if (currentSort === newSort) {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }

    setSortParams(params);
  };

  return (
    <div className="-mx-4 border border-border sm:-mx-6 lg:-mx-0 lg:rounded-md">
      <div className="w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="overflow-clip [&_tr]:border-b">
            <tr className="border-b border-border text-muted-foreground transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              {headers.map(({ translationKey, value: sortValue, isSort }) => (
                <th
                  key={uuidv4()}
                  className="h-10 bg-card-surface px-2.5 text-left align-middle font-medium text-muted-foreground first:rounded-tl-md first:pl-4 last:rounded-tr-md [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                >
                  <div className="flex items-center justify-start text-xs uppercase tracking-wide">
                    {isSort ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button
                            variant="transparent"
                            className="data-[state=open]:group-state-open data-[state=open]:group-state-open group h-8 flex-shrink-0 gap-x-2 rounded-md px-3 text-xs font-medium uppercase"
                          >
                            {t(`headers.${translationKey}`)}
                            <LuArrowUpDown
                              size={12}
                              className="fa-regular opacity-0 group-hover:opacity-100"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {sortOptions
                            .slice(0, 2)
                            .map(({ icon: Icon, value }) => (
                              <DropdownMenuItem
                                key={uuidv4()}
                                onSelect={() =>
                                  handleSort(sortValue, value)
                                }
                                className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                              >
                                <Icon
                                  size={20}
                                  className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                                />
                                {t(`sort.${value}`)}
                              </DropdownMenuItem>
                            ))}
                          <Separator className="-mx-1 my-1.5 h-px bg-accent/50" />
                          {sortOptions
                            .slice(2, 3)
                            .map(({ icon: Icon, value }) => (
                              <DropdownMenuItem
                                key={uuidv4()}
                                onSelect={() => handleSort(sortValue, value)}
                                className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                              >
                                <Icon
                                  size={20}
                                  className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                                />
                                {t(`sort.${value}`)}
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <>{t(`headers.${translationKey}`)}</>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-card-alt [&_tr:last-child]:border-0">
            {itemCount > 0 ? (
              children
            ) : (
              <tr className="border-b border-border transition-colors hover:bg-muted/50">
                <td colSpan={headers.length} className="h-24 p-4 text-center">
                  {t("labels.no_results")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;