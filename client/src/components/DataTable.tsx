import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { PiArrowsDownUp } from "react-icons/pi";
import {
  FaArrowUpWideShort,
  FaArrowDownWideShort,
  FaRegEyeSlash,
} from "react-icons/fa6";
import { IconType } from "react-icons";
import PlusButton from "./Buttons/PlusButton";
import { PiSlidersHorizontal } from "react-icons/pi";
import Separator from "./Separator";
import { FaCheck } from "react-icons/fa6";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import * as Select from "@radix-ui/react-select";
import {
  HiOutlineChevronDoubleLeft,
  HiChevronLeft,
  HiOutlineChevronDoubleRight,
  HiChevronRight,
} from "react-icons/hi";

interface ServiceButtonProps {
  value: string;
  icon: IconType;
}

const ServiceButton: React.FC<ServiceButtonProps> = ({ value, icon: Icon }) => {
  return (
    <DropdownMenu.Item className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm capitalize outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
      {Icon && <Icon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />}
      {value}
    </DropdownMenu.Item>
  );
};

const games = [
  {
    image: "counter-strike-2",
    name: "Counter Strike 2",
    value: "counter-strike-2",
  },
  { image: "lol-wild-rift", name: "Lol: Wild Rift", value: "lol-wild-rift" },
  { image: "overwatch-2", name: "Overwatch 2", value: "overwatch-2" },
  { image: "rocket-league", name: "Rocket League", value: "rocket-league" },
  {
    image: "teamfight-tactics",
    name: "Teamfight Tactics",
    value: "teamfight-tactics",
  },
  { image: "valorant", name: "Valorant", value: "valorant" },
  {
    image: "world-of-warcraft",
    name: "World of Warcraft",
    value: "world-of-warcraft",
  },
  {
    image: "league-of-legends",
    name: "League of Legends",
    value: "league-of-legends",
  },
  { image: "destiny-2", name: "Destiny 2", value: "destiny-2" },
  { image: "apex-legends", name: "Apex Legends", value: "apex-legends" },
];

const statuses = [
  {
    name: "Pending",
    value: "pending",
  },
  {
    name: "Processing",
    value: "processing",
  },
  {
    name: "In Progress",
    value: "in-progress",
  },
  {
    name: "Completed",
    value: "completed",
  },
  {
    name: "Inactive",
    value: "inactive",
  },
];

interface ToggleColumn {
  value: string;
  active: boolean;
}

const toggleColumns = [
  {
    value: "title",
    active: true,
  },
  {
    value: "id",
    active: true,
  },
  {
    value: "client",
    active: true,
  },
  {
    value: "boosters",
    active: true,
  },
  {
    value: "status",
    active: true,
  },
  {
    value: "price",
    active: true,
  },
  {
    value: "updated_at",
    active: true,
  },
];

const Header = ({ title }: { title: string }) => {
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
              <ServiceButton value="asc" icon={FaArrowUpWideShort} />
              <ServiceButton value="desc" icon={FaArrowDownWideShort} />
              <Separator />
              <ServiceButton value="hide" icon={FaRegEyeSlash} />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </th>
  );
};

interface DataTableProps {
  headers: { name: string; value: string }[];
  items: {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    username: string;
    avatar: string;
    status: string;
    price: number;
    updated_at: string;
    booster_id: string;
  }[];
}

interface NavigationButtonProps {
  icon: IconType;
  value: string | number;
}

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

interface NumberButtonProps {
  value: number;
  active?: boolean;
}

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

const DataTable: React.FC<DataTableProps> = ({ headers, items }) => {
  const [columnVisibility, setColumnVisibility] =
    useState<ToggleColumn[]>(toggleColumns);

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
      {/* SELECT */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* SEARCH */}
          <div className="w-fit">
            <input
              className="flex h-8 w-[150px] rounded-md border border-input bg-card-alt px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 lg:w-[250px]"
              placeholder="Search..."
              type="text"
            />
          </div>
          {/* GAME BUTTON */}
          <PlusButton name="Game" options={games} />
          {/* STATUS BUTTON */}
          <PlusButton name="Status" options={statuses} />
        </div>
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
                {visibleHeaders.map(({ name }) => (
                  <Header title={name} />
                ))}
              </tr>
            </thead>
            <tbody className="bg-card-alt [&_tr:last-child]:border-0">
              {items.map(
                ({
                  id,
                  title,
                  subtitle,
                  image,
                  avatar,
                  username,
                  booster_id,
                  status,
                  updated_at,
                  price,
                }) => (
                  <tr className="border-b text-muted-foreground transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    {/* TITLE */}
                    {columnVisibility.find(
                      (column) => column.value === "title" && column.active,
                    ) && (
                      <td className="px-2.5 py-2.5 text-left align-middle first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                        <a>
                          <div className="flex items-center">
                            <div className="relative block h-8 w-8 shrink-0 rounded-lg text-sm">
                              <img
                                src={image}
                                alt={title}
                                className="h-full w-full rounded-lg object-cover"
                              />
                            </div>
                            <div className="ml-2.5 truncate">
                              <div className="text-sm font-medium text-foreground">
                                {title}
                              </div>
                              <div className="truncate text-xs text-muted-foreground">
                                {subtitle}
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
                        #{id}
                      </td>
                    )}

                    {/* CLIENT */}
                    {columnVisibility.find(
                      (column) => column.value === "client" && column.active,
                    ) && (
                      <td className="px-2.5 py-2.5 text-left align-middle first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                        <div className="flex items-center">
                          <div className="relative block h-6 w-6 shrink-0 rounded-full text-xs">
                            <img
                              src={avatar}
                              alt={username}
                              className="h-full w-full rounded-full object-cover"
                            />
                            <span className="absolute bottom-0 right-0 block h-1.5 w-1.5 rounded-full bg-green-400 ring-2 ring-card" />
                          </div>
                          <div className="ml-2.5 truncate">
                            <div className="text-sm font-medium text-foreground">
                              <span className="text-xs">{username}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* BOOSTER */}
                    {columnVisibility.find(
                      (column) => column.value === "boosters" && column.active,
                    ) && (
                      <td className="px-2.5 py-2.5 text-left align-middle first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                        {booster_id}
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
                        <span className="text-foreground">{price}</span>
                      </td>
                    )}

                    {/* LAST UPDATED */}
                    {columnVisibility.find(
                      (column) =>
                        column.value === "updated_at" && column.active,
                    ) && (
                      <td className="px-2.5 py-2.5 text-left align-middle first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                        <div className="cursor-default">{updated_at}</div>
                      </td>
                    )}
                  </tr>
                ),
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
                <Select.Content className="bg-popover/75 p-2 text-popover-foreground shadow-md ring-1 ring-border/10 backdrop-blur-lg z-40">
                  <Select.Viewport>
                    <Select.Group>
                      <Select.Item value="1">2</Select.Item>
                      <Select.Item value="1">2</Select.Item>
                      <Select.Item value="1">2</Select.Item>
                      <Select.Item value="1">2</Select.Item>
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
