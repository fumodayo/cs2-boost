import { useState, useEffect } from "react";

interface SearchOrders {
  searchKey: string;
  gameKey: string[];
  statusKey: string[];
}

export const useGetAllOrder = ({
  searchKey,
  gameKey,
  statusKey,
}: SearchOrders) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let searchTimeout: NodeJS.Timeout | null = null;

    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (searchKey) params.append("searchKey", searchKey);
        if (gameKey && gameKey.length > 0)
          params.append("gameKey", gameKey.join(","));
        if (statusKey && statusKey.length > 0)
          params.append("statusKey", statusKey.join(","));

        const res = await fetch(`/api/order?${params}`, {
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
