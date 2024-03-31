import { FaCheck } from "react-icons/fa6";
import Copy from "./Common/Copy";
import { Order, User } from "../types";
import { formatMoney } from "../utils/formatMoney";
import { rankOptions } from "../constants";

interface WidgetProps {
  titleHeader: string;
  headers?: string[];
  boostItem?: Order | User | undefined;
  boostOptions?: string[];
}

const Widget: React.FC<WidgetProps> = ({
  titleHeader,
  headers,
  boostItem,
  boostOptions,
}) => {
  if (!boostItem) {
    return null;
  }

  const {
    boost_id,
    server,
    start_rating,
    end_rating,
    title,
    status,
    game,
    type,
    price,
    start_rank,
    end_rank,
    username,
    handle,
    email,
    games,
    user_id,
    addresses,
    phone_number,
    gender,
    date_of_birth,
    currency,
    cccd_number,
    cccd_issue_date,
    real_name,
  } = boostItem || {};

  const selectedStartRank = rankOptions.find(
    (item) => item.value === start_rank,
  );

  const selectedEndRank = rankOptions.find((item) => item.value === end_rank);

  return (
    <div className="-mx-4 border border-border/50 bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl">
      {/* HEADER */}
      <div className="flex flex-col space-y-1.5 border-b border-border bg-muted/50 px-4 py-6 sm:rounded-t-xl sm:px-6">
        <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
          {titleHeader}
        </h3>
      </div>
      {/* CONTENT */}
      <div className="px-0 pt-0 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-3">
          {headers?.map((header, idx) => (
            <div
              key={idx}
              className="border-t border-border/50 px-4 py-6 sm:col-span-1 sm:px-0"
            >
              <dt className="text-sm font-medium capitalize text-foreground">
                {header}
              </dt>
              <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                <div className="flex items-center gap-x-2">
                  {header === "server" && <span>{server}</span>}
                  {header === "start rating" && <span>{start_rating}</span>}
                  {header === "end rating" && <span>{end_rating}</span>}
                  {header === "title" && <span>{title}</span>}
                  {header === "username" && <span>{username}</span>}
                  {header === "handle" && <span>{handle}</span>}
                  {header === "user ID" && <span>{user_id}</span>}
                  {header === "email address" && <span>{email}</span>}
                  {header === "games" && <span>{games}</span>}
                  {header === "full name" && <span>{real_name}</span>}
                  {header === "address" && <span>{addresses}</span>}
                  {header === "phone" && <span>{phone_number}</span>}
                  {header === "gender" && <span>{gender}</span>}
                  {header === "CCCD number" && <span>{cccd_number}</span>}
                  {header === "CCCD issue date" && (
                    <span>{cccd_issue_date}</span>
                  )}
                  {header === "birth date" && <span>{date_of_birth}</span>}
                  {header === "boost id" && (
                    <span className="flex items-center gap-1">
                      #{boost_id}
                      {boost_id && <Copy text={boost_id} />}
                    </span>
                  )}
                  {header === "status" && (
                    <span className="inline-flex items-center rounded-md bg-secondary-light px-2 py-1 text-xs font-medium capitalize text-muted-foreground ring-1 ring-inset ring-secondary-ring">
                      {status}
                    </span>
                  )}
                  {header === "game" && <span>{game}</span>}
                  {header === "type" && <span>{type}</span>}
                  {header === "price" && (
                    <span>{formatMoney(currency, price)}</span>
                  )}
                  {header === "start rank" && (
                    <div className="flex items-center gap-x-2">
                      {selectedStartRank && (
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <img
                              src={`/src/assets/counter-strike-2/wingman/${selectedStartRank.image}.png`}
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
                      )}
                    </div>
                  )}
                  {header === "end rank" && (
                    <div className="flex items-center gap-x-2">
                      {selectedEndRank && (
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <img
                              src={`/src/assets/counter-strike-2/wingman/${selectedEndRank.image}.png`}
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
                      )}
                    </div>
                  )}
                </div>
              </dd>
            </div>
          ))}
          {boostOptions?.map((option, idx) => (
            <div
              key={idx}
              className="col-span-3 border-t border-border/50 px-4 py-6 sm:col-span-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
            >
              <dt className="text-sm font-medium capitalize text-foreground">
                {option}
              </dt>
              <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                <span className="flex items-center">
                  <FaCheck className="mr-1 text-green-600 dark:text-green-500" />
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
