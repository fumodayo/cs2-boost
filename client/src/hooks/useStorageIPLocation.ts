import axios from "axios";
import { useEffect } from "react";
import { getLocalStorage, setLocalStorage } from "~/utils/localStorage";

const useStorageIPLocation = () => {
  useEffect(() => {
    (async () => {
      const { data } = await axios.get("https://freeipapi.com/api/json");
      if (
        !getLocalStorage("ip_location", "") &&
        !getLocalStorage("country", "")
      ) {
        setLocalStorage("ip_location", data.ipAddress);
        setLocalStorage("country", data.countryName);
      }
    })();
  }, []);
};

export default useStorageIPLocation;
