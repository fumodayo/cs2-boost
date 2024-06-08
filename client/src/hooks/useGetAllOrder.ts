import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Order } from "../types";
import { axiosAuth } from "../axiosAuth";

interface Orders {
  orders: Order[] | [];
  countingPage: number;
  page: number;
  pages: number;
}

export const useGetAllOrder = () => {
  const location = useLocation();

  const [data, setData] = useState<Orders>();

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(location.search);
      try {
        const { data } = await axiosAuth.get(`/order?${searchParams}`);
        setData(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
  }, [location]);

  return data;
};
