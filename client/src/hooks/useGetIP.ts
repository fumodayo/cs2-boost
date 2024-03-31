import { useEffect, useState } from "react";

interface IPLogger {
  country_name?: string;
  city?: string;
  IPv4?: string;
}

export const useGetIP = () => {
  const [data, setData] = useState<IPLogger | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://geolocation-db.com/json/`);
      const data = await res.json();
      setData(data);
    };
    fetchData();
  }, []);

  return data;
};
