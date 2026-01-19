import { useEffect, useState } from "react";
import { setLocalStorage } from "~/utils/localStorage";

const useDeviceType = () => {
  const [device, setDevice] = useState("Desktop");

  useEffect(() => {
    function handleDeviceDetection() {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();

      const isMobileDevice = /iphone|ipad|ipod|android|windows phone/g.test(
        userAgent,
      );

      if (width < 768 || isMobileDevice) {
        setDevice("Mobile");
        setLocalStorage("device", "Mobile");
      } else if (width < 1024) {
        setDevice("Tablet");
        setLocalStorage("device", "Tablet");
      } else {
        setDevice("Desktop");
        setLocalStorage("device", "Desktop");
      }
    }

    handleDeviceDetection();
    window.addEventListener("resize", handleDeviceDetection);

    return () => window.removeEventListener("resize", handleDeviceDetection);
  }, []);

  return {
    device,
    isMobile: device === "Mobile",
    isTablet: device === "Tablet",
    isDesktop: device === "Desktop",
  };
};

export default useDeviceType;