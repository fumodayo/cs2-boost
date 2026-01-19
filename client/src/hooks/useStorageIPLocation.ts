import { useEffect } from "react";
import useSWR from "swr";
import { getIpLocation } from "~/services/ip.service";
import { IIpLocation } from "~/types";
import getErrorMessage from "~/utils/errorHandler";
import { getLocalStorage, setLocalStorage } from "~/utils/localStorage";

const useStorageIPLocation = () => {
  const getKey = () => {
    const ip = getLocalStorage("ip_location", "");
    const country = getLocalStorage("country", "");
    return ip && country ? null : "/util/ip-location";
  };

  const { error, isLoading } = useSWR<IIpLocation>(getKey, getIpLocation, {
    onSuccess: (data) => {
      if (data?.ipAddress && data?.countryName) {
        setLocalStorage("ip_location", data.ipAddress);
        setLocalStorage("country", data.countryName);
      }
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });

  useEffect(() => {
    if (error) {
      console.error(
        "SWR: Failed to fetch IP location:",
        getErrorMessage(error),
      );
    }
  }, [error]);

  return { isLoading, error };
};

export default useStorageIPLocation;