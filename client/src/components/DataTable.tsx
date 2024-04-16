import { IconType } from "react-icons";
import {
  FaArrowDownWideShort,
  FaArrowUpWideShort,
  FaChevronDown,
  FaCheck,
  FaRegEyeSlash,
  FaCircleCheck,
} from "react-icons/fa6";
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi";
import { PiArrowsDownUp, PiSlidersHorizontal } from "react-icons/pi";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Select from "@radix-ui/react-select";
import { formatDistance } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { formatMoney } from "../utils/formatMoney";
import { Order } from "../types";
import Separator from "./Separator";
import { IoClose } from "react-icons/io5";

type ServiceButtonProps = {
  value: string;
  icon: IconType;
  onClick: () => void;
};

type ToggleColumnProps = {
  name: string;
  value: string;
  active: boolean;
};

type HeaderProps = {
  title: string;
  value: string;
  onHideColumn: (value: string) => void;
};

type NavigationButtonProps = {
  icon: IconType;
  value: string | number;
};

type NumberButtonProps = {
  value: number;
  active?: boolean;
};

interface DataTableProps {
  headers: { name: string; value: string; active: boolean }[];
  items: Order[];
  children: React.ReactNode;
  name?: string;
}

const ServiceButton: React.FC<ServiceButtonProps> = ({
  value,
  icon: Icon,
  onClick,
}) => {
  return (
    <DropdownMenu.Item
      onClick={onClick}
      className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm capitalize outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
    >
      {Icon && <Icon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />}
      {value}
    </DropdownMenu.Item>
  );
};

const Header: React.FC<HeaderProps> = ({ title, value, onHideColumn }) => {
  return (
    <th
      className={`h-10 bg-card-surface px-2.5 text-left align-middle font-medium text-muted-foreground first:rounded-tl-md first:pl-4 last:rounded-tr-md [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]`}
    >
      <div className="flex items-center justify-start space-x-2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="data-[state=open]:group-state-open data-[state=open]:group-state-open group group -ml-3 inline-flex h-8 flex-shrink-0 items-center justify-center gap-x-2 rounded-md px-3 text-xs font-medium uppercase tracking-wide transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50  data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
              <span>{title}</span>
              <PiArrowsDownUp className="fa-regular text-base opacity-0 group-hover:opacity-100" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="backdrop-brightness-5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover/75 p-2 text-popover-foreground shadow-md ring-1 ring-border/10 backdrop-blur-lg">
              <ServiceButton
                value="asc"
                onClick={() => {}}
                icon={FaArrowUpWideShort}
              />
              <ServiceButton
                value="desc"
                onClick={() => {}}
                icon={FaArrowDownWideShort}
              />
              <Separator />
              <ServiceButton
                onClick={() => onHideColumn(value)}
                value="hide"
                icon={FaRegEyeSlash}
              />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </th>
  );
};

const navigationLeft: NavigationButtonProps[] = [
  {
    icon: HiOutlineChevronDoubleLeft,
    value: "first",
  },
  {
    icon: HiChevronLeft,
    value: "back",
  },
];

const navigationRight: NavigationButtonProps[] = [
  {
    icon: HiChevronRight,
    value: "next",
  },
  {
    icon: HiOutlineChevronDoubleRight,
    value: "end",
  },
];

const ArrowButton: React.FC<NavigationButtonProps> = ({
  icon: Icon,
  value,
}) => {
  return (
    <button className="inline-flex h-10 w-10 flex-grow items-center justify-center rounded-md border border-input bg-transparent p-0 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:flex-grow-0">
      {Icon && <Icon />}
    </button>
  );
};

const NumberButton: React.FC<NumberButtonProps> = ({ value, active }) => {
  return (
    <button
      className={
        active
          ? "inline-flex h-10 flex-grow items-center justify-center rounded-md bg-primary p-0 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:w-10 sm:flex-grow-0"
          : "inline-flex h-10 flex-grow items-center justify-center rounded-md border border-input bg-transparent p-0  text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50  sm:w-10  sm:flex-grow-0"
      }
    >
      {value}
    </button>
  );
};

const DataTable: React.FC<DataTableProps> = ({
  headers,
  items,
  children,
  name,
}) => {
  const { i18n } = useTranslation();
  const selectRowsPerPage = ["15", "20", "30", "40", "50"];

  const [columnVisibility, setColumnVisibility] =
    useState<ToggleColumnProps[]>(headers);

  const handleToggleColumn = (value: string) => {
    const updateColumns = columnVisibility.map((column) =>
      column.value === value ? { ...column, active: !column.active } : column,
    );
    setColumnVisibility(updateColumns);
  };

  const visibleHeaders = headers.filter(({ value }) =>
    columnVisibility.find((column) => column.value === value && column.active),
  );

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        {/* SELECT */}
        {children}
        {/* TOGGLE */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="ml-auto  hidden  h-8 items-center justify-center rounded-md border border-input bg-transparent px-3 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 lg:flex">
              <PiSlidersHorizontal className="mr-2" />
              View
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="backdrop-brightness-5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-[150px] min-w-[8rem] overflow-hidden rounded-md border bg-popover/75 p-2 text-popover-foreground shadow-md ring-1 ring-border/10 backdrop-blur-lg">
              <div className="px-2 py-1.5 text-sm font-medium">
                Toggle columns
              </div>
              <Separator />
              {columnVisibility.map(({ value, active }) => (
                <DropdownMenu.Item
                  onClick={() => handleToggleColumn(value)}
                  className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm capitalize outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  {active && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <FaCheck />
                    </span>
                  )}
                  {value}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      {/* DATATABLE */}
      <div className="-mx-4 border sm:-mx-6 lg:-mx-0 lg:rounded-md">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="overflow-clip [&_tr]:border-b">
              <tr className="border-b text-muted-foreground transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {visibleHeaders.map(({ name, value }) => (
                  <Header
                    title={name}
                    value={value}
                    onHideColumn={handleToggleColumn}
                  />
                ))}
              </tr>
            </thead>
            <tbody className="bg-card-alt [&_tr:last-child]:border-0">
              {items.length === 0 ? (
                <tr className="border-b text-muted-foreground transition-colors hover:bg-muted/50">
                  <td
                    colSpan={12}
                    className="align-center h-24 px-2.5 py-2.5 text-center"
                    style={{ gridColumn: "1/span 12" }}
                  >
                    No results.
                  </td>
                </tr>
              ) : (
                items.map(
                  ({
                    boost_id,
                    title,
                    type,
                    user,
                    status,
                    updatedAt,
                    price,
                    currency,
                    booster,
                  }) => (
                    <tr className="border-b text-muted-foreground transition-colors hover:bg-muted/50">
                      {/* TITLE */}
                      {columnVisibility.find(
                        (column) => column.value === "title" && column.active,
                      ) && (
                        <td className="cursor-pointer px-2.5 py-2.5 text-left align-middle first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                          <a href={`/dashboard/boosts/${boost_id}`}>
                            <div className="flex items-center">
                              <div className="relative block h-8 w-8 shrink-0 rounded-lg text-sm">
                                <img
                                  src={
                                    "https://cdn.gameboost.com/games/world-of-warcraft/logo/card.svg"
                                  }
                                  alt={title}
                                  className="h-full w-full rounded-lg object-cover"
                                />
                              </div>
                              <div className="ml-2.5 truncate">
                                <div className="text-sm font-medium text-foreground">
                                  {title}
                                </div>
                                <div className="truncate text-xs text-muted-foreground">
                                  {type}
                                </div>
                              </div>
                            </div>
                          </a>
                        </td>
                      )}

                      {/* BOOST ID */}
                      {columnVisibility.find(
                        (column) => column.value === "id" && column.active,
                      ) && (
                        <td className="px-2.5 py-2.5 text-left align-middle first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                          #{boost_id}
                        </td>
                      )}

                      {/* CLIENT */}
                      {columnVisibility.find(
                        (column) => column.value === "client" && column.active,
                      ) && (
                        <td className="px-2.5 py-2.5 text-left align-middle first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                          {user && (
                            <div className="flex items-center">
                              <div className="relative block h-6 w-6 shrink-0 rounded-full text-xs">
                                <img
                                  src={user.profile_picture}
                                  alt={user.username}
                                  className="h-full w-full rounded-full object-cover"
                                />
                                <span className="absolute bottom-0 right-0 block h-1.5 w-1.5 rounded-full bg-green-400 ring-2 ring-card" />
                              </div>
                              <div className="ml-2.5 truncate">
                                <div className="text-sm font-medium text-foreground">
                                  <span className="text-xs">
                                    {user.username}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      )}

                      {/* BOOSTER */}
                      {columnVisibility.find(
                        (column) =>
                          column.value === "boosters" && column.active,
                      ) && (
                        <td className="px-2.5 py-2.5 text-left align-middle first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                          {booster ? (
                            <div className="flex items-center">
                              <div className="relative block h-6 w-6 shrink-0 rounded-full text-xs">
                                <img
                                  src={booster.profile_picture}
                                  alt={booster.username}
                                  className="h-full w-full rounded-full object-cover"
                                />
                                <span className="absolute bottom-0 right-0 block h-1.5 w-1.5 rounded-full bg-green-400 ring-2 ring-card" />
                              </div>
                              <div className="ml-2.5 truncate">
                                <div className="text-sm font-medium text-foreground">
                                  <span className="text-xs">
                                    {booster.username}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>_</div>
                          )}
                        </td>
                      )}

                      {/* STATUS */}
                      {columnVisibility.find(
                        (column) => column.value === "status" && column.active,
                      ) && (
                        <td className="px-2.5 py-2.5 text-left align-middle first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                          <span className="inline-flex items-center rounded-md bg-secondary-light px-2 py-1 text-xs font-medium capitalize text-muted-foreground ring-1 ring-inset ring-secondary-ring">
                            {status}
                          </span>
                        </td>
                      )}

                      {/* PRICE */}
                      {columnVisibility.find(
                        (column) => column.value === "price" && column.active,
                      ) && (
                        <td className="px-2.5 py-2.5 text-left align-middle first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                          <span className="text-foreground">
                            {formatMoney(currency, price)}
                          </span>
                        </td>
                      )}

                      {/* LAST UPDATED */}
                      {columnVisibility.find(
                        (column) =>
                          column.value === "updated_at" && column.active,
                      ) &&
                        updatedAt && (
                          <td className="px-2.5 py-2.5 text-left align-middle first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                            <div className="cursor-default">
                              {formatDistance(updatedAt, new Date(), {
                                locale: i18n.language === "vn" ? vi : enUS,
                              })}
                            </div>
                          </td>
                        )}

                      {/* ACTIONS */}
                      {columnVisibility.find(
                        (column) => column.value === "actions" && column.active,
                      ) && (
                        <td className="flex gap-x-2 px-2.5 py-2.5 text-left align-middle first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                          {name === "pending" && (
                            <button
                              type="button"
                              className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
                              // onClick={() => handleEditAction(rowData)}
                            >
                              <FaCheck className="mr-1" />
                              Accept
                            </button>
                          )}
                          {name === "progress" && (
                            <>
                              <button
                                type="button"
                                className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-success px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors hover:bg-success-hover focus:outline focus:outline-offset-2 focus:outline-success focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
                                // onClick={() => handleEditAction(rowData)}
                              >
                                <FaCircleCheck className="mr-1" />
                                Completed
                              </button>
                              <button
                                type="button"
                                className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary px-2 py-1 text-sm font-medium text-danger shadow-sm outline-none ring-1 ring-danger-ring transition-colors hover:bg-danger-hover hover:text-primary-foreground focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:py-2"
                                // onClick={() => handleEditAction(rowData)}
                              >
                                <IoClose className="mr-1 text-xl" />
                                Cancel
                              </button>
                            </>
                          )}
                        </td>
                      )}
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex items-center justify-center px-2 sm:justify-end">
        <div className="flex flex-1 items-center justify-between gap-x-6 sm:flex-auto lg:gap-x-8">
          <div className="hidden items-center space-x-2 sm:flex">
            <p className="text-sm font-medium">Rows per page</p>
            <Select.Root>
              <Select.Trigger>
                <button className="flex h-8 w-[70px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                  <Select.Value placeholder="15" />
                  <Select.Icon>
                    <FaChevronDown className="h-4 w-4 opacity-50" />
                  </Select.Icon>
                </button>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                  <Select.Viewport>
                    <Select.Group>
                      {selectRowsPerPage.map((value) => (
                        <Select.Item
                          className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
                          value={value}
                        >
                          <Select.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                            <FaCheck />
                          </Select.ItemIndicator>
                          <Select.ItemText className="w-1/3">
                            {value}
                          </Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
          <div className="hidden items-center justify-center text-sm font-medium sm:flex">
            9 rows – Page 1 to 1
          </div>
          <nav className="w-full sm:w-auto">
            <div className="flex w-full items-center gap-1">
              {navigationLeft.map(({ icon, value }) => (
                <ArrowButton icon={icon} value={value} />
              ))}
              <NumberButton value={1} />
              <NumberButton value={2} active />
              <NumberButton value={3} />
              {navigationRight.map(({ icon, value }) => (
                <ArrowButton icon={icon} value={value} />
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
