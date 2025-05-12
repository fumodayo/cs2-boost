import { useContext, useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { AppContext } from "../context/AppContext";

const Confetti = () => {
  const { isOpenConfetti, toggleConfetti } = useContext(AppContext);

  const [windowDimension, setDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const detectSize = () => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);
    return () => window.removeEventListener("resize", detectSize);
  }, [windowDimension]);

  useEffect(() => {
    if (isOpenConfetti) {
      const timer = setTimeout(() => {
        toggleConfetti();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isOpenConfetti, toggleConfetti]);

  return (
    isOpenConfetti && (
      <ReactConfetti
        width={windowDimension.width}
        height={windowDimension.height}
        tweenDuration={1000}
      />
    )
  );
};

export default Confetti;
