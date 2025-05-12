import { useEffect, useState } from "react";
import { getLocalStorage, setLocalStorage } from "~/utils/localStorage";

const useDeviceType = () => {
  const [device, setDevice] = useState("");

  useEffect(() => {
    function handleDeviceDetection() {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /iphone|ipad|ipod|android|windows phone/g.test(
        userAgent,
      );
      const isTablet =
        /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/g.test(userAgent);

      if (isMobile) setDevice("Mobile");
      else if (isTablet) setDevice("Tablet");
      else setDevice("Desktop");
    }

    handleDeviceDetection();
    window.addEventListener("resize", handleDeviceDetection);

    return () => window.removeEventListener("resize", handleDeviceDetection);
  }, []);

  /* prints 'Mobile', 'Tablet' or 'Desktop' depending on device. */
  if (!getLocalStorage("device", "")) setLocalStorage("device", device);
};

export default useDeviceType;
