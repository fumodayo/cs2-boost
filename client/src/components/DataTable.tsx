import { IconType } from "react-icons";
import {
  FaArrowDownWideShort,
  FaArrowUpWideShort,
  FaCheck,
  FaRegEyeSlash,
  FaCircleCheck,
  FaTrashCan,
  FaXmark,
} from "react-icons/fa6";
import { PiArrowsDownUp, PiSlidersHorizontal } from "react-icons/pi";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { formatDistance } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { formatMoney } from "../utils/formatMoney";
import { Order } from "../types";
import Separator from "./Separator";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import clsx from "clsx";

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
  onSortKey: (value: string) => void;
  onHideColumn: (value: string) => void;
};

interface DataTableProps {
  headers: { name: string; value: string; active: boolean }[];
  onSortKey: (value: string) => void;
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

const Header: React.FC<HeaderProps> = ({
  title,
  value,
  onHideColumn,
  onSortKey,
}) => {
  return (
    <th
      className={`h-10 bg-card-surface px-2.5 text-left align-middle font-medium text-muted-foreground first:rounded-tl-md first:pl-4 last:rounded-tr-md [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]`}
    >
      <div className="flex items-center justify-start space-x-2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="-ml-3 inline-flex h-8 flex-shrink-0 items-center justify-center gap-x-2 rounded-md px-3 text-xs font-medium uppercase tracking-wide transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              <span>{title}</span>
              <PiArrowsDownUp className="fa-regular text-base opacity-0 group-hover:opacity-100" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover/75 p-2 text-popover-foreground shadow-md ring-1 ring-border/10 backdrop-blur-lg">
              <ServiceButton
                value="asc"
                onClick={() => onSortKey(value)}
                icon={FaArrowUpWideShort}
              />
              <ServiceButton
                value="desc"
                onClick={() => onSortKey(`-${value}`)}
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

const DataTable: React.FC<DataTableProps> = ({
  headers,
  items,
  children,
  name,
  onSortKey,
}) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

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

  const handleAccept = async (boost_id: string) => {
    const res = await fetch(`/api/order/accept-order/${boost_id}`, {
      method: "POST",
    });

    const data = await res.json();
    if (data.success === false) {
      toast.error("Accept Boost failed");
      return;
    }

    toast.success("Accept Boost");
    navigate("/dashboard/progress-boosts");
  };

  const handleComplete = async (boost_id: string) => {
    const res = await fetch(`/api/order/complete-order/${boost_id}`, {
      method: "POST",
    });

    const data = await res.json();
    if (data.success === false) {
      toast.error("Completed Boost failed");
      return;
    }

    toast.success("Completed Boost");
    navigate("/dashboard/progress-boosts");
  };

  const handleCancel = async (boost_id: string) => {
    const res = await fetch(`/api/order/cancel-order/${boost_id}`, {
      method: "POST",
    });

    const data = await res.json();
    if (data.success === false) {
      toast.error("Cancel Boost failed");
      return;
    }

    toast.success("Cancel Boost failed");
    navigate("/dashboard/progress-boosts");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {/* SELECT */}
        {children}
        {/* TOGGLE */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="ml-auto hidden  h-8 items-center justify-center rounded-md border border-input bg-transparent px-3 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 lg:flex">
              <PiSlidersHorizontal className="mr-2" />
              View
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              side="bottom"
              align="end"
              className="backdrop-brightness-5 z-50 w-[150px] min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover/75 p-2 text-popover-foreground shadow-md ring-1 ring-border/10 backdrop-blur-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            >
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
      <div className="-mx-4 border border-border/50 sm:-mx-6 lg:-mx-0 lg:rounded-md">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="overflow-clip [&_tr]:border-b">
              <tr className="border-b border-border text-muted-foreground transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {visibleHeaders.map(({ name, value }) => (
                  <Header
                    title={name}
                    value={value}
                    onHideColumn={handleToggleColumn}
                    onSortKey={onSortKey}
                  />
                ))}
              </tr>
            </thead>
            <tbody className="bg-card-alt [&_tr:last-child]:border-0">
              {items.length === 0 ? (
                <tr className="border-b border-border text-muted-foreground transition-colors hover:bg-muted/50">
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
                    _id,
                    boost_id,
                    title,
                    type,
                    user,
                    status,
                    updatedAt,
                    price,
                    currency,
                    booster,
                    image,
                  }) => (
                    <tr className="border-b border-border text-muted-foreground transition-colors hover:bg-muted/50">
                      {/* TITLE */}
                      {columnVisibility.find(
                        (column) => column.value === "title" && column.active,
                      ) && (
                        <td className="cursor-pointer px-2.5 py-2.5 text-left align-middle first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                          <a href={`/dashboard/boosts/${boost_id}`}>
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
                                  {type}
                                </div>
                              </div>
                            </div>
                          </a>
                        </td>
                      )}

                      {/* TRANSITION ID */}
                      {columnVisibility.find(
                        (column) =>
                          column.name === "transaction id" && column.active,
                      ) && (
                        <td className="px-2.5 py-2.5 text-left align-middle first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                          <a href={`/dashboard/boosts/${boost_id}`}>{_id}</a>
                        </td>
                      )}

                      {/* ORDER ID */}
                      {columnVisibility.find(
                        (column) => column.name === "order id" && column.active,
                      ) && (
                        <td className="px-2.5 py-2.5 text-left align-middle first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                          <a href={`/dashboard/boosts/${boost_id}`}>
                            #{boost_id}
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
                          {status === "in active" && (
                            <button
                              type="button"
                              className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
                              onClick={() => handleAccept(boost_id as string)}
                            >
                              <FaCheck className="mr-1" />
                              Accept
                            </button>
                          )}
                          {status === "in progress" && (
                            <>
                              <button
                                type="button"
                                className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-success px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors hover:bg-success-hover focus:outline focus:outline-offset-2 focus:outline-success focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
                                onClick={() =>
                                  handleComplete(boost_id as string)
                                }
                              >
                                <FaCircleCheck className="mr-1" />
                                Completed
                              </button>
                              <Dialog.Root>
                                <Dialog.Trigger>
                                  <button
                                    type="button"
                                    className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary px-2 py-1 text-sm font-medium text-danger shadow-sm outline-none ring-1 ring-danger-ring transition-colors hover:bg-danger-hover hover:text-primary-foreground focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:py-2"
                                  >
                                    <IoClose className="mr-1 text-xl" />
                                    Cancel
                                  </button>
                                </Dialog.Trigger>
                                <Dialog.Portal>
                                  <Dialog.Overlay className="data-[state=open]:animate-overlay-show data-[state=closed]:animate-overlay-close fixed inset-0 z-40 bg-background/80" />
                                  <Dialog.Content
                                    className={clsx(
                                      "data-[state=open]:animate-modal-show data-[state=closed]:animate-modal-close scroll-sm min-h fixed top-1/2 z-40 mx-auto min-h-fit w-full -translate-y-1/2 overflow-clip rounded-xl bg-card text-left shadow-xl outline-none transition-all focus:outline-none sm:left-1/2 sm:max-w-lg sm:-translate-x-1/2",
                                    )}
                                  >
                                    {/* HEADER */}
                                    <div
                                      className={clsx(
                                        "flex items-center justify-between px-6 pb-0 pt-6",
                                        "sm:pt-5",
                                      )}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div>
                                          <div className="gradient-red flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-red-400 text-sm text-white ring-2 ring-red-500/30">
                                            <FaTrashCan />
                                          </div>
                                        </div>
                                        <Dialog.Title className="font-display text-lg font-medium leading-6 text-foreground">
                                          Cancel Boost
                                        </Dialog.Title>
                                      </div>
                                      <Dialog.Close>
                                        <button
                                          type="button"
                                          className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary-light text-sm font-medium text-secondary-light-foreground outline-none transition-colors hover:bg-secondary-light-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:h-9 sm:w-9"
                                        >
                                          <span className="sr-only">Close</span>
                                          <FaXmark className="flex h-5 w-5 items-center justify-center" />
                                        </button>
                                      </Dialog.Close>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-6">
                                      Nếu xóa boost bạn sẽ bị trừ 1% giá trị
                                      boost tương đương
                                      <p>
                                        (
                                        {price &&
                                          formatMoney(
                                            currency,
                                            (price * 1) / 100,
                                          )}
                                        )
                                      </p>
                                    </div>

                                    {/* FOOTER */}
                                    <div
                                      className={clsx(
                                        "flex flex-row-reverse items-center gap-2 border-t border-border bg-muted/50 px-6 py-6",
                                        "sm:gap-3 sm:rounded-b-xl sm:px-6 sm:py-4",
                                      )}
                                    >
                                      <Dialog.Close asChild>
                                        <button
                                          type="submit"
                                          onClick={() =>
                                            handleCancel(boost_id as string)
                                          }
                                          className={clsx(
                                            "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-danger px-4 py-2 text-sm font-medium text-danger-foreground shadow-sm outline-none transition-colors",
                                            "hover:bg-danger-hover focus:outline focus:outline-offset-2 focus:outline-danger focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                                          )}
                                        >
                                          Cancel Boost
                                        </button>
                                      </Dialog.Close>
                                      <Dialog.Close asChild>
                                        <button
                                          type="button"
                                          className={clsx(
                                            "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors",
                                            "hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                                          )}
                                        >
                                          Cancel
                                        </button>
                                      </Dialog.Close>
                                    </div>
                                  </Dialog.Content>
                                </Dialog.Portal>
                              </Dialog.Root>
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
    </div>
  );
};

export default DataTable;
