import { FaCheck } from "react-icons/fa6";
import Copy from "./Common/Copy";

interface BoostItem {
  id?: string;
  title?: string;
  game?: string;
  server?: string;
  startRating?: number;
  endRating?: number;
  area?: string;
  price?: number;
  status?: string;
  type?: string;
  startRank?: string;
  endRank?: string;
  username?: string;
  handle?: string;
  email?: string;
  language?: string;
  games?: string;
  full_name?: string;
  country?: string;
  city?: string;
  postal_code?: string;
  address?: string;
  phone_number?: string;
  national_id?: string;
  gender?: string;
  date_of_birth?: string;
}

interface WidgetProps {
  titleHeader: string;
  headers?: string[];
  boostItem?: BoostItem | undefined;
  boostOptions?: string[];
}

type RankOption = {
  name: string;
  value: string;
  image: string;
};

const rankOptions: RankOption[] = [
  {
    name: "Silver 1",
    value: "silver_1",
    image: "SILVER_1__WINGAME",
  },
  {
    name: "Silver 2",
    value: "silver_2",
    image: "SILVER_2__WINGAME",
  },
  {
    name: "Silver 3",
    value: "silver_3",
    image: "SILVER_3__WINGAME",
  },
  {
    name: "Silver 4",
    value: "silver_4",
    image: "SILVER_4__WINGAME",
  },
  {
    name: "Silver Elite",
    value: "silver_elite",
    image: "SILVER_ELITE__WINGAME",
  },
  {
    name: "Silver Elite Master",
    value: "silver_elite_master",
    image: "SILVER_ELITE_MASTER__WINGAME",
  },
  {
    name: "Glob Nova 1",
    value: "glob_nova_1",
    image: "GOLD_NOVA_1__WINGAME",
  },
  {
    name: "Glob Nova 2",
    value: "glob_nova_2",
    image: "GOLD_NOVA_2__WINGAME",
  },
  {
    name: "Glob Nova 3",
    value: "glob_nova_3",
    image: "GOLD_NOVA_3__WINGAME",
  },
  {
    name: "Glob Nova Master",
    value: "glob_nova_master",
    image: "GOLD_NOVA_MASTER__WINGAME",
  },
  {
    name: "Master Guardian 1",
    value: "master_guardian_1",
    image: "MASTER_GUADIAN_1__WINGAME",
  },
  {
    name: "Master Guardian 2",
    value: "master_guardian_2",
    image: "MASTER_GUARDIAN_2__WINGAME",
  },
  {
    name: "Master Guardian Elite",
    value: "master_guardian_elite",
    image: "MASTER_GUARDIAN_ELITE__WINGAME",
  },
  {
    name: "Distinguished Master Guardian",
    value: "distinguished_master_guardian",
    image: "DISTINGUISHED__MASTER__GUARDIAN__WINGAME",
  },
  {
    name: "Legendary Eagle",
    value: "legendary_eagle",
    image: "LEGENDARY__EAGLE__WINGAME",
  },
  {
    name: "Legendary Eagle Master",
    value: "legendary_eagle_master",
    image: "LEGENDARY__EAGLE__MASTER__WINGAME",
  },
  {
    name: "Supreme",
    value: "supreme",
    image: "SUPREME__WINGAME",
  },
  {
    name: "Global Elite",
    value: "global_elite",
    image: "GLOBAL_ELITE__WINGAME",
  },
];

const Widget: React.FC<WidgetProps> = ({
  titleHeader,
  headers,
  boostItem,
  boostOptions,
}) => {
  const {
    server,
    startRating,
    endRating,
    title,
    id,
    status,
    game,
    type,
    price,
    startRank,
    endRank,
    username,
    handle,
    email,
    language,
    games,
    full_name,
    country,
    city,
    postal_code,
    address,
    phone_number,
    national_id,
    gender,
    date_of_birth,
  } = boostItem || {};

  const selectedStartRank = rankOptions.find(
    (item) => item.value === startRank,
  );

  const selectedEndRank = rankOptions.find((item) => item.value === endRank);

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
          {headers?.map((header) => (
            <div className="border-t border-border/50 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium capitalize text-foreground">
                {header}
              </dt>
              <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                <div className="flex items-center gap-x-2">
                  {header === "server" && <span>{server}</span>}
                  {header === "start rating" && <span>{startRating}</span>}
                  {header === "end rating" && <span>{endRating}</span>}
                  {header === "title" && <span>{title}</span>}
                  {header === "username" && <span>{username}</span>}
                  {header === "handle" && <span>{handle}</span>}
                  {header === "user ID" && <span>{id}</span>}
                  {header === "email address" && <span>{email}</span>}
                  {header === "language" && <span>{language}</span>}
                  {header === "games" && <span>{games}</span>}
                  {header === "full name" && <span>{full_name}</span>}
                  {header === "country" && <span>{country}</span>}
                  {header === "city" && <span>{city}</span>}
                  {header === "postal code" && <span>{postal_code}</span>}
                  {header === "address" && <span>{address}</span>}
                  {header === "phone" && <span>{phone_number}</span>}
                  {header === "national ID" && <span>{national_id}</span>}
                  {header === "gender" && <span>{gender}</span>}
                  {header === "birth date" && <span>{date_of_birth}</span>}
                  {header === "boost id" && (
                    <span className="flex items-center gap-1">
                      #{id}
                      {id && <Copy text={id} />}
                    </span>
                  )}
                  {header === "status" && (
                    <span className="inline-flex items-center rounded-md bg-secondary-light px-2 py-1 text-xs font-medium capitalize text-muted-foreground ring-1 ring-inset ring-secondary-ring">
                      {status}
                    </span>
                  )}
                  {header === "game" && <span>{game}</span>}
                  {header === "type" && <span>{type}</span>}
                  {header === "price" && <span>{price}</span>}
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
          {boostOptions?.map((option) => (
            <div className="col-span-3 border-t border-border/50 px-4 py-6 sm:col-span-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
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
