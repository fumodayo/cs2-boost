import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "~/components/context/AppContext";

const useExchangeRate = (fromCurrency: string, toCurrency: string) => {
  const [exchangeRate, setExchangeRate] = useState();

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const { data } = await axios.get(
          `https://latest.currency-api.pages.dev/v1/currencies/${fromCurrency}.json`,
        );

        if (!data || !data[fromCurrency] || !data[fromCurrency][toCurrency]) {
          throw new Error("Exchange rate not available");
        }

        setExchangeRate(data[fromCurrency][toCurrency]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  return exchangeRate;
};

export const useExchangeMoney = (amount: number) => {
  const { currency } = useContext(AppContext);
  const exchangeRate = useExchangeRate("usd", "vnd");

  if (amount && exchangeRate && currency === "usd") {
    return amount / exchangeRate;
  }

  return amount;
};
