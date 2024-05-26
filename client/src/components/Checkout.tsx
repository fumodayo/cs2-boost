import clsx from "clsx";
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { GoClockFill } from "react-icons/go";
import { RxGlobe } from "react-icons/rx";
import { GiDiamondHard, GiBroadsword } from "react-icons/gi";
import { LuSwords } from "react-icons/lu";

import { RootState } from "../redux/store";
import { formatMoney } from "../utils/formatMoney";
import { Order } from "../types";
import { listOfCountries, rankOptions } from "../constants";
import { AppContext } from "../context/AppContext";
import { useExchangeMoney } from "../hooks/useExchangeMoney";
import { addCartStart, addCartSuccess } from "../redux/cart/cartSlice";
import Input from "./Input";

type ExtraOption = {
  name: string;
  option: string;
  extra: number;
};

interface CheckoutProps {
  title?: string;
  beginText?: string;
  lastText?: string;
  server?: string;
  mode?: string;
  currentExp?: number;
  desiredExp?: number;
  currentRating?: number;
  desiredRating?: number;
  currentRanking?: string;
  desiredRanking?: string;
  totalTime: number;
  cost: number;
  extraOptions: ExtraOption[];
}

const listOfServices = [
  {
    icon: GiDiamondHard,
    label: "Level Farming",
    value: "level-farming",
  },
  {
    icon: GiBroadsword,
    label: "Premier",
    value: "premier",
  },
  {
    icon: LuSwords,
    label: "Wingman",
    value: "wingman",
  },
];

const Checkout: React.FC<CheckoutProps> = ({
  title,
  beginText,
  lastText,
  server,
  mode,
  currentExp,
  desiredExp,
  currentRating,
  desiredRating,
  currentRanking,
  desiredRanking,
  totalTime,
  cost,
  extraOptions,
}) => {
  const { t } = useTranslation();
  const { currency, onOpenLoginModal } = useContext(AppContext);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      promo_code: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
  };

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

    return costWithExtraOptions;
  }, [cost, extraOptions, selectedOptions]);

  const totalOptions = useMemo(() => {
    const options: string[] = [];
    selectedOptions.forEach((index: number) => {
      options.push(extraOptions[index].name);
    });
    return options;
  }, [extraOptions, selectedOptions]);

  const exchangeMoney = useExchangeMoney(Math.ceil(totalCost / 1000) * 1000);

  const handleCreateOrder = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch(addCartStart());

    const order: Order = {
      options: totalOptions,
      title: title,
      game: "counter strike 2",
      type: title,
      price: Math.ceil(totalCost / 1000) * 1000,
      currency: "vnd",
      // Farm Exp
      start_exp: currentExp,
      end_exp: desiredExp,
      // Premier
      server: server,
      start_rating: currentRating,
      end_rating: desiredRating,
      // Wingman
      start_rank: currentRanking,
      end_rank: desiredRanking,
    };

    if (!currentUser) {
      onOpenLoginModal();
      return;
    }

    const res = await fetch("/api/order/create-order", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    const id = await res.json();

    dispatch(addCartSuccess(order));
    navigate(`/checkout/${id}`);
  };

  return (
    <div className={clsx("gap-5", "lg:col-span-2 xl:col-span-2")}>
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
              {currentExp && <p className="w-4">{currentExp}</p>}
              {currentRating && <p className="w-4">{currentRating}</p>}
              {selectedCurrentRank && (
                <img
                  src={`/src/assets/counter-strike-2/wingman/${selectedCurrentRank.image}.png`}
                  alt={selectedCurrentRank.name}
                  className="h-full w-14"
                />
              )}
              <span className="ml-8">{"->"}</span>
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
              {desiredExp && <p className="w-4">{desiredExp}</p>}
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
                <Input
                  register={register}
                  errors={errors}
                  style="h-7"
                  id="promo_code"
                  placeholder="Discount Code"
                />
              </div>
            </div>
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className={clsx(
                "relative ml-1 inline-flex h-9 items-center justify-center overflow-hidden truncate whitespace-nowrap rounded-md bg-secondary px-4 py-2 !text-xs font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors",
                "hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                "sm:h-8",
              )}
            >
              {t("Apply")}
            </button>
          </div>
        </div>
        <div className="mt-6 flex items-end justify-between">
          <p className="text-lg text-muted-foreground">{t("Total Price")}:</p>
          {exchangeMoney && exchangeMoney > 0 && (
            <div className="flex flex-row items-end gap-2">
              <span className="bg-gradient-to-l from-foreground to-muted-foreground bg-clip-text text-4xl font-semibold tracking-tight text-transparent">
                {formatMoney(currency, exchangeMoney)}
              </span>
            </div>
          )}
        </div>

        {server ? (
          <button
            onClick={handleCreateOrder}
            className={clsx(
              "text-md mt-4 w-full rounded-md bg-blue-600 py-2 font-semibold text-foreground",
              "hover:bg-blue-700",
            )}
          >
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
