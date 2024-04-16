import { useState, useEffect } from "react";
import { Order } from "../types";

interface SearchOrders {
  searchKey: string;
  gameKey: string[];
  statusKey: string[];
}

interface Orders {
  orders: Order[];
  completed?: number;
  in_progress?: number;
}

export const useProgressOrder = ({
  searchKey,
  gameKey,
  statusKey,
}: SearchOrders) => {
  const [orders, setOrders] = useState<Orders>();

  useEffect(() => {
    let searchTimeout: NodeJS.Timeout | null = null;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/order/progress-order`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(() => {
      fetchData();
    }, 1500);

    return () => clearTimeout(searchTimeout as NodeJS.Timeout);
  }, [searchKey, gameKey, statusKey]);

  return orders;
};
