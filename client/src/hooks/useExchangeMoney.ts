import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";

const useExchangeRate = (fromCurrency: string, toCurrency: string) => {
  const [exchangeRate, setExchangeRate] = useState();

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          `https://latest.currency-api.pages.dev/v1/currencies/${fromCurrency}.json`,
        );

        const data = await response.json();
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

export const useExchangeMoney = (point: number) => {
  const { currency } = useContext(AppContext);
  const exchangeRate = useExchangeRate("usd", "vnd");

  // Vì tất cả giá tiền đều cho sẵn là VND nên hệ số đối với VND là 1/1
  let money = point;

  if (point && exchangeRate && currency === "usd") {
    money = point / exchangeRate;
  }

  return money;
};
