import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Order } from "../types";
import { axiosAuth } from "../axiosAuth";

interface Orders {
  invoices: Order[] | [];
  countingPage: number;
  page: number;
  pages: number;
}

export const useGetAllWallet = () => {
  const location = useLocation();

  const [data, setData] = useState<Orders>();

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(location.search);
      try {
        const { data } = await axiosAuth.get(`/wallet?${searchParams}`);
        setData(data);
      } catch (error) {
        console.error("Error fetching wallet:", error);
      }
    };

    fetchData();
  }, [location]);

  return data;
};
