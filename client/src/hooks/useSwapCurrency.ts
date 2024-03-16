import { useEffect, useState } from "react";

export const useExchangeRate = (fromCurrency: string, toCurrency: string) => {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

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
