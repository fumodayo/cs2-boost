import axios from "axios";
import { useEffect, useState } from "react";

interface IPLogger {
  ipAddress?: string;
  countryName?: string;
}

export const useGetIP = () => {
  const [data, setData] = useState<IPLogger | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`https://freeipapi.com/api/json`);
      localStorage.setItem("ip_address", data.ipAddress);
      localStorage.setItem("country_name", data.countryName);
      setData(data);
    };
    fetchData();
  }, []);

  return data;
};
