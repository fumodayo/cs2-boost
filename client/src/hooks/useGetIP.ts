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
      setData(data);
      const storedIP = localStorage.getItem("ip_address");
      const storedCountry = localStorage.getItem("country_name");
      if (!storedIP && !storedCountry) {
        localStorage.setItem("ip_address", data.ipAddress);
        localStorage.setItem("country_name", data.countryName);
      }
    };
    fetchData();
  }, []);

  return data;
};
