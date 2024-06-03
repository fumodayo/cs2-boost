import { useState, useEffect } from "react";
import { Order } from "../types";
import { useLocation } from "react-router-dom";

interface Orders {
  orders: Order[] | [];
  countingPage: number;
  page: number;
  pages: number;
}

export const usePendingOrder = () => {
  const location = useLocation();

  const [data, setData] = useState<Orders>();

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(location.search);
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/order/pending-order?${searchParams}`,
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
