import { useMemo, useState } from "react";
import { GoClockFill } from "react-icons/go";
import {
  FaEarthAsia,
  FaEarthAfrica,
  FaEarthEurope,
  FaEarthAmericas,
} from "react-icons/fa6";
import { BsGlobeAsiaAustralia } from "react-icons/bs";
import { RxGlobe } from "react-icons/rx";
import { GiDiamondHard, GiBroadsword } from "react-icons/gi";
import { LuSwords } from "react-icons/lu";
import { useTranslation } from "react-i18next";

type ExtraOption = {
  name: string;
  option: string;
  extra: number;
};

interface CheckoutProps {
  beginText?: string;
  lastText?: string;
  server?: string;
  mode?: string;
  currentRating?: number;
  desiredRating?: number;
  currentRanking?: string;
  desiredRanking?: string;
  totalTime: number;
  cost: number;
  extraOptions: ExtraOption[];
}

const listOfCountries = [
  {
    name: "Africa",
    value: "AF",
    icon: FaEarthAfrica,
  },
  {
    name: "Asia",
    value: "AS",
    icon: FaEarthAsia,
  },
  {
    name: "Australia",
    value: "AU",
    icon: BsGlobeAsiaAustralia,
  },
  {
    name: "China",
    value: "CN",
    icon: FaEarthAsia,
  },
  {
    name: "Europe",
    value: "EU",
    icon: FaEarthEurope,
  },
  {
    name: "North America",
    value: "NA",
    icon: FaEarthAmericas,
  },
  {
    name: "South America",
    value: "SA",
    icon: FaEarthAmericas,
  },
];

const listOfServices = [
  {
    icon: GiDiamondHard,
    label: "Level Farming",
    value: "level-farming",
  },
  {
    icon: GiBroadsword,
    label: "Premie",
    value: "premie",
  },
  {
    icon: LuSwords,
    label: "Wingman",
    value: "wingman",
  },
];

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

const Checkout: React.FC<CheckoutProps> = ({
  beginText,
  lastText,
  server,
  mode,
  currentRating,
  desiredRating,
  currentRanking,
  desiredRanking,
  totalTime,
  cost,
  extraOptions,
}) => {
  const { t } = useTranslation();

  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const selectedCurrentRank = rankOptions.find(
    (item) => item.value === currentRanking,
  );

  const selectedDesiredRank = rankOptions.find(
    (item) => item.value === desiredRanking,
  );

  const handleToggleExtraOption = (index: number) => {
    const newSelectedOptions: number[] = [...selectedOptions];
    const selectedIndex: number = newSelectedOptions.indexOf(index);

    if (selectedIndex === -1) {
      newSelectedOptions.push(index);
    } else {
      newSelectedOptions.splice(selectedIndex, 1);
    }

    setSelectedOptions(newSelectedOptions);
  };

  const totalCost = useMemo(() => {
    let costWithExtraOptions = cost;
    selectedOptions.forEach((index: number) => {
      costWithExtraOptions +=
        (extraOptions[index].extra / 100) * costWithExtraOptions;
    });

    return costWithExtraOptions.toFixed(2);
  }, [cost, extraOptions, selectedOptions]);

  return (
    <div className="gap-5 lg:col-span-2 xl:col-span-2">
      <div className="w-full max-w-[540px] rounded-lg bg-card p-6 shadow">
        <p className="text-center text-lg font-semibold text-foreground">
          {t("Checkout")}
        </p>

        {/* RATING */}
        {server ? (
          <div className="text-md -mx-6 my-4 bg-accent py-3 text-center text-muted-foreground">
            <span className="flex justify-center">
              <span className="mx-4 font-bold text-foreground">
                {beginText && t(beginText)}
              </span>
              {currentRating && <p className="w-4">{currentRating}</p>}
              {selectedCurrentRank && (
                <img
                  src={`/src/assets/counter-strike-2/wingman/${selectedCurrentRank.image}.png`}
                  alt={selectedCurrentRank.name}
                  className="h-full w-14"
                />
              )}
              <span className="mx-4">{"->"}</span>
              <span className="mx-4 font-bold text-foreground">
                {lastText && t(lastText)}
              </span>
              {selectedDesiredRank && (
                <img
                  src={`/src/assets/counter-strike-2/wingman/${selectedDesiredRank.image}.png`}
                  alt={selectedDesiredRank.name}
                  className="h-full w-14"
                />
              )}
              {desiredRating && <p className="w-4">{desiredRating}</p>}
            </span>
          </div>
        ) : (
          <div>
            <p className="my-8 text-center text-warning">
              {t("Start by selecting the server")}!
            </p>
          </div>
        )}

        {/* EXTRA OPTIONS */}
        {server && (
          <div className="checkout-extra-options my-4 max-w-lg rounded-lg bg-card">
            <h4 className="mb-8 text-center text-sm text-muted-foreground">
              {t("Add extra options to your boost")}
            </h4>
            {extraOptions?.map((item: ExtraOption, index: number) => (
              <div
                key={index}
                className="mb-4 flex items-center justify-between"
              >
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-semibold">
                    {t(item.name)}
                  </label>
                  <span className="ml-1 inline-flex items-center rounded-md bg-primary-light px-2 py-1 text-xs font-semibold text-primary-light-foreground ring-1 ring-inset ring-primary-ring">
                    +{item.extra}%
                  </span>
                </div>
                <div>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex flex-grow">
                      <label className="cursor-pointer text-sm font-medium leading-6 text-foreground" />
                    </div>
                    <button
                      onClick={() => handleToggleExtraOption(index)}
                      className="emboss-shadow relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center rounded-full border border-border bg-accent transition-colors duration-200 ease-in-out hover:brightness-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary"
                      id="switch"
                      role="switch"
                      type="button"
                      aria-checked="true"
                      aria-required="false"
                      data-state={
                        selectedOptions.includes(index)
                          ? "checked"
                          : "unchecked"
                      }
                      value="on"
                    >
                      <span
                        data-state={
                          selectedOptions.includes(index)
                            ? "checked"
                            : "unchecked"
                        }
                        className="emboss-shadow pointer-events-none inline-block h-3 w-3 translate-x-1 transform rounded-full bg-muted-foreground shadow ring-0 transition duration-200 ease-in-out data-[state=checked]:h-3.5 data-[state=checked]:w-3.5 data-[state=checked]:translate-x-[1.4rem] data-[state=checked]:bg-white"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalTime > 0 && server && (
          <div className="-mx-6 mb-4 flex items-center justify-center bg-accent py-3 text-center text-sm font-bold text-muted-foreground">
            <GoClockFill className="mr-4 text-xl" /> {t("Completion Time")}:
            <span className="font-bold">
              ~{totalTime} {t("Hours")}
            </span>
          </div>
        )}

        {server && (
          <div className="my-8 flex flex-wrap gap-2">
            {listOfCountries.map(
              (country) =>
                country.value === server && (
                  <div
                    key={country.value}
                    className="mx-1 my-2 flex items-center space-x-2"
                  >
                    <country.icon className="text-xl text-blue-600" />
                    <span className="whitespace-nowrap rounded-md bg-accent px-3 py-1 text-sm text-muted-foreground">
                      {t(country.value)}
                    </span>
                  </div>
                ),
            )}
            {listOfServices.map(
              (service) =>
                service.value === mode && (
                  <div
                    key={service.value}
                    className="mx-1 my-2 flex items-center space-x-2"
                  >
                    <service.icon className="text-xl text-blue-600" />
                    <span className="whitespace-nowrap rounded-md bg-accent px-3 py-1 text-sm text-muted-foreground">
                      {t(service.label)}
                    </span>
                  </div>
                ),
            )}
          </div>
        )}

        <div className="py-6">
          <div className="flex items-end">
            <div className="w-full">
              <div className="mb-1 flex justify-between">
                <label className="block text-sm font-medium leading-6 text-foreground/90">
                  {t("Discount Code")}
                </label>
              </div>
              <div className="relative">
                <input
                  className="block w-full rounded-md border-0 bg-field py-1.5 text-field-foreground shadow-sm ring-1 ring-field-ring placeholder:text-muted-foreground hover:ring-field-ring-hover focus:ring-field-ring-hover disabled:pointer-events-none disabled:opacity-50 sm:text-sm"
                  placeholder={t("Enter discount code")}
                  type="text"
                />
              </div>
            </div>
            <button className="relative ml-1 inline-flex h-9 items-center justify-center overflow-hidden truncate whitespace-nowrap rounded-md bg-secondary px-4 py-2 !text-xs font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:h-8">
              {t("Apply")}
            </button>
          </div>
        </div>
        <div className="mt-6 flex items-end justify-between">
          <p className="text-lg text-muted-foreground">{t("Total Price")}:</p>
          {totalCost && cost > 0 && (
            <div className="flex flex-row items-end gap-2">
              <span className="bg-gradient-to-l from-foreground to-muted-foreground bg-clip-text text-4xl font-semibold tracking-tight text-transparent">
                ${totalCost}
              </span>
            </div>
          )}
        </div>

        {server ? (
          <button className="text-md mt-4 w-full rounded-md bg-blue-600 py-2 font-semibold text-foreground hover:bg-blue-700">
            {t("Buy Now")} →
          </button>
        ) : (
          <button
            className="text-md mt-4 w-full cursor-not-allowed rounded-md bg-accent py-2 font-semibold text-foreground"
            disabled
          >
            {t("Buy Now")} →
          </button>
        )}

        <div className="mt-4 flex items-center justify-center text-center text-sm font-semibold text-muted-foreground">
          <RxGlobe className="mr-1" />
          {t("Using a VPN is prohibited when making a purchase")}.
        </div>
      </div>
    </div>
  );
};

export default Checkout;
