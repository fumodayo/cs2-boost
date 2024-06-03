import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Order } from "../types";

interface Orders {
  orders: Order[] | [];
  countingPage: number;
  page: number;
  pages: number;
  in_progress: number;
  completed: number;
}

export const useProgressOrder = () => {
  const location = useLocation();

  const [data, setData] = useState<Orders>();

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(location.search);
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/order/progress-order?${searchParams}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const response = await res.json();
        setData(response);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
  }, [location]);

  return data;
};
