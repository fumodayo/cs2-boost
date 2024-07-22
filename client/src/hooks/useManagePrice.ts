import { useEffect, useState } from "react";
import { axiosInstance } from "../axiosAuth";
import { PremierPriceList, WingmanPriceList } from "../types";

interface WingmanPrice {
  price_list: WingmanPriceList[];
  unit_price: number;
}

interface PremierPrice {
  price_list: PremierPriceList[];
  unit_price: number;
}

export const useGetWingmanPrice = () => {
  const [priceList, setPriceList] = useState<WingmanPrice>();

  useEffect(() => {
    (async () => {
      const { data } = await axiosInstance.get(`/manage/wingman`);
      setPriceList(data);
    })();
  }, []);

  return priceList;
};

export const useGetPremierPrice = () => {
  const [priceList, setPriceList] = useState<PremierPrice>();

  useEffect(() => {
    (async () => {
      const { data } = await axiosInstance.get(`/manage/premier`);
      setPriceList(data);
    })();
  }, []);

  return priceList;
};
