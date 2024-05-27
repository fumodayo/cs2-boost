import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import clsx from "clsx";

import { HiOutlineCursorClick } from "react-icons/hi";
import { FaCreditCard } from "react-icons/fa";
import { IoPlayForward } from "react-icons/io5";
import { GiPartyPopper } from "react-icons/gi";

import { AppContext } from "../../context/AppContext";

const introduction = [
  {
    icon: HiOutlineCursorClick,
    title: "Select Service",
    subtitle: "Select the game, service and customize your order",
  },
  {
    icon: FaCreditCard,
    title: "Secure Payment",
    subtitle:
      "We accept all major credit cards, PaySafe, Apple Pay, Google Pay, Crypto, and more!",
  },
  {
    icon: IoPlayForward,
    title: "Order Starts",
    subtitle:
      "Sit back, relax and enjoy - We will take care of everything for you",
  },
  {
    icon: GiPartyPopper,
    title: "Order Completed",
    subtitle:
      "Just like magic, you're now all set! We appreciate your feedback, so don't forget to share your experience with us",
  },
];

const Introduction = () => {
  const { t } = useTranslation();
  const { theme } = useContext(AppContext);

  /* Khi scroll đến div introduction thì mới chạy thanh progress */
  const [progress, setProgress] = useState(0);
  const [currentIntroIndex, setCurrentIntroIndex] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Xác định hàm kiểm tra xem element có trong viewport
  const isElementInViewport = (el: HTMLElement | null): boolean => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
      rect.bottom >= 0 &&
      rect.right >= 0 &&
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  // Hàm xử lý animation
  const startProgress = () => {
    if (isElementInViewport(progressRef.current) && !isAnimating) {
      setIsAnimating(true);
      const start = Date.now();
      const duration = 5000;

      const animate = () => {
        const now = Date.now();
        const elapsedTime = now - start;
        const progressValue = Math.min((elapsedTime / duration) * 100, 100);
        setProgress(progressValue);

        if (progressValue < 100) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    }
  };

  // Sử dụng useEffect để kích hoạt startProgress khi scroll
  useEffect(() => {
    const handleScroll = debounce(() => {
      startProgress();
    }, 100);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isAnimating]); // Chỉ kích hoạt khi isAnimating thay đổi

  // useEffect để gọi lại startProgress khi currentIntroIndex thay đổi
  useEffect(() => {
    startProgress();
  }, [currentIntroIndex]);

  // useEffect để kiểm tra khi progress đạt 100 và thay đổi currentIntroIndex
  useEffect(() => {
    if (progress >= 100) {
      if (currentIntroIndex < introduction.length - 1) {
        setCurrentIntroIndex(currentIntroIndex + 1);
      } else {
        setCurrentIntroIndex(0);
      }
      setProgress(0);
    }
  }, [progress, currentIntroIndex]);

  return (
    <div
      className={clsx(
        "relative z-20 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4",
        "sm:px-6 xl:px-8",
      )}
    >
      <div
        className={clsx(
          "grid w-full grid-cols-1 gap-4",
          "lg:grid-cols-7 lg:gap-16",
        )}
      >
        <div
          className={clsx(
            "col-span-7 flex flex-col items-center text-center",
            "lg:items-start lg:text-start",
          )}
        >
          <h2 className="z-20 max-w-xs text-4xl font-bold tracking-tight text-foreground">
            {t("We Like To Keep It Fast And Easy")}
          </h2>
          <p
            className={clsx(
              "mt-4 max-w-lg text-sm font-medium text-foreground",
              "sm:text-base",
            )}
          >
            {t(
              "Buying boosting, accounts and coaching has never been this easy. Just select your service, make a payment and enjoy!",
            )}
          </p>
        </div>
        <div
          ref={progressRef}
          className={clsx(
            "z-20 order-2 col-span-7 flex w-full flex-col gap-6",
            "lg:order-1 lg:col-span-3 lg:mt-10",
          )}
        >
          {introduction.map((intro, index) =>
            currentIntroIndex === index ? (
              <div
                key={index}
                className={clsx(
                  "relative flex w-full cursor-default gap-6 overflow-hidden rounded-xl bg-primary p-6 text-xl text-primary-foreground",
                  "transition-all duration-300",
                )}
              >
                <intro.icon />
                <div className="flex flex-col gap-3">
                  <h3 className="font-display text-lg font-bold">
                    {t(intro.title)}
                  </h3>
                  <p className="secondary max-w-sm text-sm">
                    {t(intro.subtitle)}.
                  </p>
                </div>
                <div
                  className={`fill-5 absolute bottom-[0.5px] left-0 h-1 rounded-b-2xl bg-black/30`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            ) : (
              <div
                key={index}
                onClick={() => {
                  setCurrentIntroIndex(index);
                }}
                className={clsx(
                  "relative z-20 flex w-full cursor-pointer items-center gap-6 overflow-hidden rounded-xl bg-card p-6 text-xl text-foreground shadow-lg ring-1 ring-inset ring-border transition-all",
                  "dark:bg-[#151926] dark:hover:bg-[#212435]",
                  "hover:bg-accent",
                )}
              >
                <intro.icon />
                <div className="flex flex-col gap-3">
                  <div className="font-display text-lg font-bold">
                    {t(intro.title)}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
        <div
          className={clsx(
            "relative order-1 col-span-7 flex items-center justify-center",
            "lg:bottom-36 lg:order-2 lg:col-span-4",
          )}
        >
          <img
            src={`/public/assets/services/howitworks${currentIntroIndex + 1}${
              theme === "light" ? "_w" : ""
            }.png`}
            className={clsx(
              "relative h-[400px] w-full object-contain object-center",
              "lg:absolute lg:top-10 lg:h-[800px] lg:w-[800px]",
            )}
            alt="illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default Introduction;
