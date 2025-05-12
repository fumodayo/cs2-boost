import {
  FaArrowDownWideShort,
  FaArrowRight,
  FaArrowUpWideShort,
  FaCheck,
  FaRegEyeSlash,
  FaXmark,
} from "react-icons/fa6";
import { HiMiniRocketLaunch } from "react-icons/hi2";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "./Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../@radix-ui/Dropdown";
import { LuArrowUpDown } from "react-icons/lu";
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
  BigTooltip,
  BigTooltipContent,
  BigTooltipTrigger,
} from "../@radix-ui/BigTooltip";
import { listOfStatus, ORDER_STATUS } from "~/constants/order";
import { IOrderProps, IPaymentProps } from "~/types";
import { useTranslation } from "react-i18next";
import { IDataListHeaders } from "~/constants/headers";
import { formatDistanceDate, formatMoney } from "~/utils";
import { useState } from "react";
import { axiosAuth } from "~/axiosAuth";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { ROLE_USER } from "~/constants/user";
import { v4 as uuidv4 } from "uuid";

const sortOptions = [
  {
    label: "Asc",
    icon: FaArrowUpWideShort,
    value: "asc",
  },
  {
    label: "Desc",
    icon: FaArrowDownWideShort,
    value: "desc",
  },
  {
    label: "Hide",
    icon: FaRegEyeSlash,
    value: "hide",
  },
];

interface IDataTableProps {
  headers: IDataListHeaders[];
  toggleColumn: (value: string) => void;
  boosts?: IOrderProps[] | [];
  payments?: IPaymentProps[] | [];
}

const RowTable = ({ children }: { children: React.ReactNode }) => (
  <td className="px-2.5 py-2.5 text-left align-middle first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
    {children}
  </td>
);

const RowBoost = ({ game, title, type, status, boost_id }: IOrderProps) => {
  const { t } = useTranslation();
  const currentStatus = listOfStatus.filter((item) => item.value === status);

  return (
    <RowTable>
      <BigTooltip>
        <BigTooltipTrigger>
          <Link to={"/orders/boosts/" + boost_id} className="inline-flex">
            <div className="flex max-w-[350px] items-center">
              {/* LOGO */}
              <div className="relative flex size-10 shrink-0 items-center space-x-2">
                <div className="absolute flex size-10 items-center justify-center rounded-md bg-secondary p-1 text-secondary-foreground ring-1 ring-border">
                  <HiMiniRocketLaunch size={20} />
                </div>
                <img
                  src={`/assets/games/${game}/logo.png`}
                  className="absolute -bottom-1 -right-1 size-5 object-contain shadow-sm"
                  alt="logo"
                />
              </div>
              {/* CONTENT */}
              <div className="ml-2.5 truncate">
                <div className="truncate text-sm font-medium text-foreground">
                  <h2 className="truncate text-sm">{title}</h2>
                </div>
                <p className="truncate text-xs capitalize text-muted-foreground">
                  {type?.replace("_", " ")} Boost
                </p>
              </div>
            </div>
          </Link>
        </BigTooltipTrigger>
        <BigTooltipContent>
          <div className="w-lg">
            {/* HEADER */}
            <div className="-mx-3 -mt-1.5 flex items-start gap-x-2 border-b bg-secondary px-3 pb-2 pt-3">
              <img
                className="size-7 shrink-0 object-contain shadow-sm"
                src="/assets/games/counter-strike-2/logo.png"
                alt="logo"
              />
              <div className="flex flex-col">
                <h3 className="text-xs">{title}</h3>
                <p className="text-xs text-muted-foreground">{type} Boost</p>
              </div>
            </div>
            <div className="py-2">
              {/* CONTENT */}
              <div className="flex w-full items-baseline justify-between gap-x-2.5 py-2">
                <dt className="shrink-0 text-xs font-medium text-foreground">
                  ID:
                </dt>
                <hr className="w-full border-dashed" />
                <div className="shrink-0 text-xs font-medium capitalize text-muted-foreground">
                  #{boost_id}
                </div>
              </div>
              <div className="flex w-full items-baseline justify-between gap-x-2.5 py-2">
                <dt className="shrink-0 text-xs font-medium capitalize text-foreground">
                  {t("Globals.Order.label.type")}:
                </dt>
                <hr className="w-full border-dashed" />
                <div className="shrink-0 text-xs font-medium capitalize text-muted-foreground">
                  {type?.replace("_", " ")} Boost
                </div>
              </div>
              <div className="flex w-full items-baseline justify-between gap-x-2.5 py-2">
                <dt className="shrink-0 text-xs font-medium capitalize text-foreground">
                  {t("Globals.Order.label.status")}:
                </dt>
                <hr className="w-full border-dashed" />
                {currentStatus.map(({ icon: Icon, label }) => (
                  <div
                    key={uuidv4()}
                    className="flex shrink-0 text-xs font-medium capitalize text-secondary-light-foreground"
                  >
                    <Icon className="mr-1" />
                    {t(`Globals.Order.status.${label}`)}
                  </div>
                ))}
              </div>
              {/* FOOTER */}
              <Link to={"/orders/boosts/" + boost_id}>
                <Button
                  variant="secondary"
                  className="mt-4 w-full rounded-md px-2 py-1.5 text-xs"
                >
                  View Boost
                  <FaArrowRight className="ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </BigTooltipContent>
      </BigTooltip>
    </RowTable>
  );
};

const RowStatus = ({ status }: IOrderProps) => {
  const { t } = useTranslation();
  const currentStatus = listOfStatus.filter((item) => item.value === status);

  return (
    <RowTable>
      {currentStatus.map(({ icon: Icon, label }) => (
        <div
          key={uuidv4()}
          className="inline-flex items-center rounded-md bg-secondary-light px-2 py-1 text-xs font-medium capitalize text-muted-foreground ring-1 ring-inset ring-secondary-ring"
        >
          <Icon className="mr-1.5" />
          <span className="flex-1 shrink-0 truncate">
            {t(`Globals.Order.status.${label}`)}
          </span>
        </div>
      ))}
    </RowTable>
  );
};

const RowAction = ({
  status,
  boost_id,
  user,
  assign_partner,
  retryCount,
}: IOrderProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const isPartner = currentUser?.role?.includes(ROLE_USER.PARTNER);

  const isCurrentUser = user?.user_id === currentUser?.user_id;

  const isAssignPartner = currentUser?.user_id === assign_partner?.user_id;

  const handleRefuse = async () => {
    try {
      setLoading(true);
      const { data } = await axiosAuth.post(`/order/refuse-order/${boost_id}`);
      if (data.success) {
        toast.success("Order refuse");
        navigator(`/orders/boosts/${boost_id}`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axiosAuth.post(`/order/accept-order/${boost_id}`);
      if (data.success) {
        toast.success("Order accepted");
        navigator(`/orders/boosts/${boost_id}`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCompletedOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axiosAuth.post(
        `/order/completed-order/${boost_id}`,
      );
      if (data.success) {
        toast.success("Order completed successfully");
        navigator(`/pending-boosts`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axiosAuth.post(`/order/cancel-order/${boost_id}`);
      if (data.success) {
        toast.success("Order canceled successfully");
        navigator(`/pending-boosts`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRenewOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axiosAuth.post(`/order/renew-order/${boost_id}`);
      if (data.success) {
        toast.success("Order renew successfully");
        navigator(`/checkout/${data.boost_id}`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRecoveryOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axiosAuth.post(
        `/order/recovery-order/${boost_id}`,
      );
      const { success, order_id } = data;
      if (success) {
        toast.success("Order recovery successfully");
        navigator(`/orders/boosts/${order_id}`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RowTable>
      {status === ORDER_STATUS.PENDING && isCurrentUser && (
        <div className="flex justify-end">
          <Link to={`/checkout/${boost_id}`}>
            <Button
              variant="light"
              className="flex h-8 rounded-md bg-success-light px-2.5 py-1.5 text-xs text-success-light-foreground hover:bg-success-light-hover focus:outline-success"
            >
              {t("DataTable.actions.Pay Now")} <FaArrowRight className="ml-1" />
            </Button>
          </Link>
        </div>
      )}
      {status === ORDER_STATUS.IN_ACTIVE && isPartner && (
        <div className="flex justify-end">
          <Button
            onClick={handleAcceptOrder}
            disabled={loading}
            variant="light"
            className="flex h-8 rounded-md bg-success-light px-2.5 py-1.5 text-xs text-success-light-foreground hover:bg-success-light-hover focus:outline-success"
          >
            {t("DataTable.actions.Accept Order")}
            <FaArrowRight className="ml-1" />
          </Button>
        </div>
      )}
      {status === ORDER_STATUS.WAITING && isCurrentUser && (
        <div className="flex justify-end space-x-2">
          <Button
            onClick={handleRefuse}
            disabled={loading}
            variant="light"
            className="flex h-8 rounded-md bg-danger-light px-2.5 py-1.5 text-xs text-danger-light-foreground hover:bg-danger-light-hover focus:outline-danger"
          >
            Refuse <FaXmark className="ml-1" />
          </Button>
        </div>
      )}
      {status === ORDER_STATUS.WAITING && isAssignPartner && (
        <div className="flex justify-end space-x-2">
          <Button
            onClick={handleAcceptOrder}
            disabled={loading}
            variant="light"
            className="flex h-8 rounded-md bg-primary-light px-2.5 py-1.5 text-xs text-primary-light-foreground hover:bg-primary-light-hover focus:outline-primary"
          >
            {t("DataTable.actions.Accept Order")} <FaCheck className="ml-1" />
          </Button>
          <Button
            onClick={handleRefuse}
            disabled={loading}
            variant="light"
            className="flex h-8 rounded-md bg-danger-light px-2.5 py-1.5 text-xs text-danger-light-foreground hover:bg-danger-light-hover focus:outline-danger"
          >
            Refuse <FaXmark className="ml-1" />
          </Button>
        </div>
      )}
      {status === ORDER_STATUS.IN_PROGRESS && isPartner && (
        <div className="flex justify-end space-x-2">
          <Button
            onClick={handleCompletedOrder}
            disabled={loading}
            variant="light"
            className="flex h-8 rounded-md bg-primary-light px-2.5 py-1.5 text-xs text-primary-light-foreground hover:bg-primary-light-hover focus:outline-primary"
          >
            {t("DataTable.actions.Completed")} <FaCheck className="ml-1" />
          </Button>
          <Button
            onClick={handleCancelOrder}
            disabled={loading}
            variant="light"
            className="flex h-8 rounded-md bg-danger-light px-2.5 py-1.5 text-xs text-danger-light-foreground hover:bg-danger-light-hover focus:outline-danger"
          >
            {t("DataTable.actions.Cancel")} <FaXmark className="ml-1" />
          </Button>
        </div>
      )}
      {status === ORDER_STATUS.COMPLETED && isCurrentUser && retryCount < 1 && (
        <div className="flex justify-end">
          <Button
            onClick={handleRenewOrder}
            variant="light"
            className="flex h-8 rounded-md bg-primary-light px-2.5 py-1.5 text-xs text-primary-light-foreground hover:bg-primary-light-hover focus:outline-primary"
          >
            {t("DataTable.actions.Renew Order")}
            <FaArrowRight className="ml-1" />
          </Button>
        </div>
      )}
      {status === ORDER_STATUS.CANCEL && isCurrentUser && retryCount < 1 && (
        <div className="flex justify-end">
          <Button
            onClick={handleRecoveryOrder}
            variant="light"
            className="flex h-8 rounded-md bg-danger-light px-2.5 py-1.5 text-xs text-danger-light-foreground hover:bg-danger-light-hover focus:outline-danger"
          >
            {t("DataTable.actions.Recovery Order")}
            <FaArrowRight className="ml-1" />
          </Button>
        </div>
      )}
    </RowTable>
  );
};

const DataTable = ({
  headers,
  toggleColumn,
  boosts = [],
  payments = [],
}: IDataTableProps) => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [sortParams, setSortParams] = useSearchParams();
  const handleSort = (value: string, sortValue: string) => {
    const params = new URLSearchParams(sortParams);
    params.delete("sort");
    params.append("sort", (sortValue === "desc" ? "-" : "") + value);
    setSortParams(params);
  };

  return (
    <div className="-mx-4 border border-border sm:-mx-6 lg:-mx-0 lg:rounded-md">
      <div className="w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="overflow-clip [&_tr]:border-b">
            <tr className="border-b border-border text-muted-foreground transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              {headers.map(({ label, value, isSort }) => (
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
                            {t(`DataTable.header.${label}`)}
                            <LuArrowUpDown
                              size={12}
                              className="fa-regular opacity-0 group-hover:opacity-100"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {sortOptions
                            .slice(0, 2)
                            .map(({ label, icon: Icon, value: sortValue }) => (
                              <DropdownMenuItem
                                key={uuidv4()}
                                onSelect={() => handleSort(value, sortValue)}
                                className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                              >
                                <Icon
                                  size={20}
                                  className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                                />
                                {t(`DataTable.label.${label}`)}
                              </DropdownMenuItem>
                            ))}
                          <Separator className="-mx-1 my-1.5 h-px bg-accent/50" />
                          {sortOptions
                            .slice(2, 3)
                            .map(({ label, icon: Icon }) => (
                              <DropdownMenuItem
                                key={uuidv4()}
                                onSelect={() => toggleColumn(value)}
                                className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                              >
                                <Icon
                                  size={20}
                                  className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                                />
                                {t(`DataTable.label.${label}`)}
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <>{t(`DataTable.header.${label}`)}</>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-card-alt [&_tr:last-child]:border-0">
            {/* NO RESULTS */}
            {boosts.length === 0 && payments.length === 0 && (
              <tr className="border-b border-border text-muted-foreground transition-colors hover:bg-muted/50">
                <td
                  colSpan={12}
                  className="align-center h-24 px-2.5 py-2.5 text-center"
                  style={{ gridColumn: "1/span 12" }}
                >
                  {t("DataTable.label.No results")}
                </td>
              </tr>
            )}

            {/* BOOSTS */}
            {boosts.map((props) => (
              <tr
                key={uuidv4()}
                className="border-b text-muted-foreground transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                {/* BOOST */}
                {headers.find((col) => col.value === "order") && (
                  <RowBoost {...props} />
                )}

                {/* BOOST ID */}
                {headers.find((col) => col.value === "boost_id") && (
                  <RowTable>#{props.boost_id}</RowTable>
                )}

                {/* STATUS */}
                {headers.find((col) => col.value === "status") && (
                  <RowStatus {...props} />
                )}

                {/* PRICE */}
                {headers.find((col) => col.value === "price") && (
                  <RowTable>{formatMoney(props.price, "vnd")}</RowTable>
                )}

                {/* LAST UPDATED */}
                {headers.find((col) => col.value === "updatedAt") && (
                  <RowTable>
                    {formatDistanceDate(props.updatedAt, i18n.language)}
                  </RowTable>
                )}

                {/* ACTIONS */}
                {headers.find((col) => col.value === "actions") && (
                  <RowAction {...props} />
                )}
              </tr>
            ))}

            {/* PAYMENT */}
            {payments.map((props) => (
              <tr
                key={uuidv4()}
                className="border-b text-muted-foreground transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                {/* BOOST */}
                {headers.find((col) => col.value === "order") && (
                  <RowBoost {...props.order} />
                )}

                {/* PAYMENT METHOD */}
                {headers.find((col) => col.value === "payment_method") && (
                  <RowTable>{props.payment_method}</RowTable>
                )}

                {/* STATUS */}
                {headers.find((col) => col.value === "status") && (
                  <RowTable>
                    <div className="inline-flex items-center rounded-md bg-secondary-light px-2 py-1 text-xs font-medium capitalize text-muted-foreground ring-1 ring-inset ring-secondary-ring">
                      <span className="flex-1 shrink-0 truncate">
                        {props.status}
                      </span>
                    </div>
                  </RowTable>
                )}

                {/* TRANSITION ID */}
                {headers.find((col) => col.value === "receipt_id") && (
                  <RowTable>#{props.receipt_id}</RowTable>
                )}

                {/* AMOUNT */}
                {headers.find((col) => col.value === "price") && (
                  <RowTable>{formatMoney(props.price, "vnd")}</RowTable>
                )}

                {/* LAST UPDATED */}
                {headers.find((col) => col.value === "updatedAt") && (
                  <RowTable>
                    {formatDistanceDate(props.updatedAt, i18n.language)}
                  </RowTable>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
