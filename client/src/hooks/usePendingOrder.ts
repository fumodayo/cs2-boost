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
        const res = await fetch(`/api/order/pending-order?${searchParams}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await res.json();
        console.log(response);
        setData(response);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
  }, [location]);

  return data;
};
