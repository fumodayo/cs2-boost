import { useEffect, useState } from "react";
import { Order } from "../types";
import { axiosAuth } from "../axiosAuth";

export const useGetOrderById = (id?: string) => {
  const [order, setOrder] = useState<Order>({});

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axiosAuth.get(`/order/${id}`);
      setOrder(data);
    };
    fetchData();
  }, [id]);

  return order;
};
