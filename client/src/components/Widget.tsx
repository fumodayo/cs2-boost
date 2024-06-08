import clsx from "clsx";
import { FaCheck } from "react-icons/fa6";
import { Order, User } from "../types";
import { formatMoney } from "../utils/formatMoney";
import { rankOptions } from "../constants";
import Copy from "./Common/Copy";

interface WidgetProps {
  titleHeader: string;
  headers?: string[];
  boostItem?: Order | User | undefined;
  boostOptions?: string[];
}

const isOrder = (item: Order | User): item is Order => {
  return (item as Order).boost_id !== undefined;
};

const formatDate = (dateString?: Date): string => {
  return dateString
    ? new Date(dateString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";
};

const Widget: React.FC<WidgetProps> = ({
  titleHeader,
  headers,
  boostItem,
  boostOptions,
}) => {
  if (!boostItem) {
    return null;
  }

  const selectedStartRank = isOrder(boostItem)
    ? rankOptions.find((item) => item.value === boostItem.start_rank)
    : undefined;

  const selectedEndRank = isOrder(boostItem)
    ? rankOptions.find((item) => item.value === boostItem.end_rank)
    : undefined;

  return (
    <div
      className={clsx(
        "-mx-4 border border-border/50 bg-card text-card-foreground shadow-sm",
        "sm:mx-0 sm:rounded-xl",
      )}
    >
      {/* HEADER */}
      <div
        className={clsx(
          "flex flex-col space-y-1.5 border-b border-border bg-muted/50 px-4 py-6",
          "sm:rounded-t-xl sm:px-6",
        )}
      >
        <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
          {titleHeader}
        </h3>
      </div>
      {/* CONTENT */}
      <div className="px-0 pt-0 sm:px-6">
        <div className={clsx("grid grid-cols-2", "lg:grid-cols-3")}>
          {headers?.map((header, idx) => (
            <div
              key={idx}
              className={clsx(
                "border-t border-border/50 px-4 py-6",
                "sm:col-span-1 sm:px-0",
              )}
            >
              <dt className="text-sm font-medium capitalize text-foreground">
                {header}
              </dt>
              <dd
                className={clsx(
                  "mt-1 text-sm leading-6 text-muted-foreground",
                  "sm:col-span-2 sm:mt-0",
                )}
              >
                <div className="flex items-center gap-x-2">
                  {header === "server" && isOrder(boostItem) && (
                    <span>{boostItem.server}</span>
                  )}
                  {header === "start rating" && isOrder(boostItem) && (
                    <span>{boostItem.start_rating}</span>
                  )}
                  {header === "end rating" && isOrder(boostItem) && (
                    <span>{boostItem.end_rating}</span>
                  )}
                  {header === "start exp" && isOrder(boostItem) && (
                    <span>{boostItem.start_exp}</span>
                  )}
                  {header === "end exp" && isOrder(boostItem) && (
                    <span>{boostItem.end_exp}</span>
                  )}
                  {header === "title" && isOrder(boostItem) && (
                    <span>{boostItem.title}</span>
                  )}
                  {header === "username" && !isOrder(boostItem) && (
                    <span>{boostItem.username}</span>
                  )}
                  {header === "handle" && !isOrder(boostItem) && (
                    <span>{boostItem.handle}</span>
                  )}
                  {header === "user ID" && !isOrder(boostItem) && (
                    <span>{boostItem.user_id}</span>
                  )}
                  {header === "email address" && !isOrder(boostItem) && (
                    <span>{boostItem.email}</span>
                  )}
                  {header === "games" && isOrder(boostItem) && (
                    <span>{boostItem.game}</span>
                  )}
                  {header === "full name" && !isOrder(boostItem) && (
                    <span>{boostItem.real_name}</span>
                  )}
                  {header === "address" && !isOrder(boostItem) && (
                    <span>{boostItem.addresses}</span>
                  )}
                  {header === "phone" && !isOrder(boostItem) && (
                    <span>{boostItem.phone_number}</span>
                  )}
                  {header === "gender" && !isOrder(boostItem) && (
                    <span>{boostItem.gender}</span>
                  )}
                  {header === "CCCD number" && !isOrder(boostItem) && (
                    <span>{boostItem.cccd_number}</span>
                  )}
                  {header === "CCCD issue date" && !isOrder(boostItem) && (
                    <span>{formatDate(boostItem.cccd_issue_date)}</span>
                  )}
                  {header === "birth date" && !isOrder(boostItem) && (
                    <span>{formatDate(boostItem.date_of_birth)}</span>
                  )}
                  {header === "boost id" && isOrder(boostItem) && (
                    <span className="flex items-center gap-1">
                      #{boostItem.boost_id}
                      {boostItem.boost_id && <Copy text={boostItem.boost_id} />}
                    </span>
                  )}
                  {header === "status" && isOrder(boostItem) && (
                    <span className="inline-flex items-center rounded-md bg-secondary-light px-2 py-1 text-xs font-medium capitalize text-muted-foreground ring-1 ring-inset ring-secondary-ring">
                      {boostItem.status}
                    </span>
                  )}
                  {header === "game" && isOrder(boostItem) && (
                    <span>{boostItem.game}</span>
                  )}
                  {header === "type" && isOrder(boostItem) && (
                    <span>{boostItem.type}</span>
                  )}
                  {header === "price" && isOrder(boostItem) && (
                    <span>
                      {formatMoney(boostItem.currency, boostItem.price)}
                    </span>
                  )}
                  {header === "start rank" && selectedStartRank && (
                    <div className="flex items-center gap-x-2">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <img
                            src={`/assets/counter-strike-2/wingman/${selectedStartRank.image}.png`}
                            alt={selectedStartRank.name}
                            className="w-12"
                          />
                        </div>
                        <div className="ml-2.5 truncate">
                          <div className="text-sm font-medium text-foreground">
                            {selectedStartRank.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {header === "end rank" && selectedEndRank && (
                    <div className="flex items-center gap-x-2">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <img
                            src={`/assets/counter-strike-2/wingman/${selectedEndRank.image}.png`}
                            alt={selectedEndRank.name}
                            className="w-12"
                          />
                        </div>
                        <div className="ml-2.5 truncate">
                          <div className="text-sm font-medium text-foreground">
                            {selectedEndRank.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </dd>
            </div>
          ))}
          {boostOptions?.map((option, idx) => (
            <div
              key={idx}
              className={clsx(
                "col-span-3 border-t border-border/50 px-4 py-6",
                "sm:col-span-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0",
              )}
            >
              <dt className="text-sm font-medium capitalize text-foreground">
                {option}
              </dt>
              <dd
                className={clsx(
                  "mt-1 text-sm leading-6 text-muted-foreground",
                  "sm:col-span-2 sm:mt-0",
                )}
              >
                <span className="flex items-center">
                  <FaCheck
                    className={clsx(
                      "mr-1 text-green-600",
                      "dark:text-green-500",
                    )}
                  />
                  Yes
                </span>
              </dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Widget;
