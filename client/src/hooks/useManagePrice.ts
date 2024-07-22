import { useEffect, useState } from "react";
import { axiosInstance } from "../axiosAuth";

export const useGetWingmanPrice = () => {
  const [priceList, setPriceList] = useState({});

  useEffect(() => {
    (async () => {
      const { data } = await axiosInstance.get(`/manage/wingman`);
      setPriceList(data);
    })();
  }, []);

  return priceList;
};

export const useGetPremierPrice = () => {
  const [priceList, setPriceList] = useState({});

  useEffect(() => {
    (async () => {
      const { data } = await axiosInstance.get(`/manage/premier`);
      setPriceList(data);
    })();
  }, []);

  return priceList;
};
