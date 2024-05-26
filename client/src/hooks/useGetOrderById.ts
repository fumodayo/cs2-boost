import { useEffect, useState } from "react";
import { Order } from "../types";

export const useGetOrderById = (id?: string) => {
  const [order, setOrder] = useState<Order>({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/order/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setOrder(data);
    };
    fetchData();
  }, [id]);

  return order;
};
