import { useEffect, useState } from "react";

interface IPLogger {
  country?: string;
  city?: string;
  query?: string;
}

export const useGetIP = () => {
  const [data, setData] = useState<IPLogger | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://ip-api.com/json/`, {
        referrerPolicy: "unsafe-url",
      });
      const data = await res.json();
      setData(data);
    };
    fetchData();
  }, []);

  return data;
};
