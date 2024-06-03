import { useEffect, useState } from "react";

interface IPLogger {
  ipAddress?: string;
  countryName?: string;
}

export const useGetIP = () => {
  const [data, setData] = useState<IPLogger | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://freeipapi.com/api/json`);
      const data = await res.json();
      setData(data);
    };
    fetchData();
  }, []);

  return data;
};
