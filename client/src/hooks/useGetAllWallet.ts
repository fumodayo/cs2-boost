import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Order } from "../types";

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
        const res = await fetch(`/api/wallet?${searchParams}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await res.json();
        console.log(response);
        setData(response);
      } catch (error) {
        console.error("Error fetching wallet:", error);
      }
    };

    fetchData();
  }, [location]);

  return data;
};
