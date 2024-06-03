import { useEffect, useState } from "react";
import { Revenue } from "../types";

export const useGetRevenue = (periodMoney: string, periodOrder: string) => {
  const [data, setData] = useState<Revenue>();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/revenue`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            periodMoney: periodMoney,
            periodOrder: periodOrder,
          }),
        },
      );
      const data = await res.json();
      setData(data);
    };
    fetchData();
  }, [periodMoney, periodOrder]);

  return data;
};
