import { useState, useEffect } from "react";

interface SearchOrders {
  searchKey: string;
  gameKey: string[];
  statusKey: string[];
}

export const usePendingOrder = ({
  searchKey,
  gameKey,
  statusKey,
}: SearchOrders) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let searchTimeout: NodeJS.Timeout | null = null;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/order/pending-order`, {
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
