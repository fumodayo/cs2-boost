import { useContext, useEffect, useState } from "react";
import { FaCreditCard } from "react-icons/fa6";
import { GiPartyPopper } from "react-icons/gi";
import { HiOutlineCursorClick } from "react-icons/hi";
import { IoPlayForward } from "react-icons/io5";
import cn from "~/libs/utils";
import { AppContext } from "~/components/context/AppContext";
import { useTranslation } from "react-i18next";

const stepToOrder = [
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

const StepByStep = () => {
  const { t } = useTranslation();
  const { theme } = useContext(AppContext);

  const [progress, setProgress] = useState(0);
  const [currentCard, setCurrentCard] = useState(0);

  const startProgress = () => {
    const start = Date.now();
    const duration = 5000;

    const animated = () => {
      const now = Date.now();
      const elapsedTime = now - start;
      const progressValue = Math.min((elapsedTime / duration) * 100, 100);
      setProgress(progressValue);

      if (progressValue < 100) {
        requestAnimationFrame(animated);
      }
    };

    requestAnimationFrame(animated);
  };

  useEffect(() => {
    if (progress >= 100) {
      if (currentCard < stepToOrder.length - 1) {
        setCurrentCard(currentCard + 1);
      } else {
        setCurrentCard(0);
      }
      setProgress(0);
    }
  }, [progress, currentCard]);

  useEffect(() => {
    startProgress();
  }, [currentCard]);

  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-4",
        "lg:grid-cols-7 lg:gap-16",
      )}
    >
      <div
        className={cn(
          "col-span-7 flex flex-col items-center text-center",
          "lg:items-start lg:text-start",
        )}
      >
        <h4 className="font-display z-20 max-w-xs text-4xl font-bold tracking-tight text-foreground">
          {t("StepByStep.heading")}
        </h4>
        <p
          className={cn(
            "mt-4 max-w-lg text-sm font-medium text-foreground/90",
            "sm:text-base",
          )}
        >
          {t("StepByStep.subheading")}
        </p>
      </div>
      <div
        className={cn(
          "z-20 order-2 col-span-7 flex w-full flex-col gap-6",
          "lg:order-1 lg:col-span-3 lg:mt-10",
        )}
      >
        {stepToOrder.map(({ icon: Icon, title, subtitle }, index) =>
          currentCard === index ? (
            <div
              key={index}
              onClick={() => setCurrentCard(index)}
              className={cn(
                "relative flex w-full cursor-default gap-6 overflow-hidden rounded-xl bg-primary p-6 text-xl text-primary-foreground",
                "transition-all duration-300",
              )}
            >
              <Icon size={24} />
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-2xl font-bold">
                  {t(`StepByStep.card.title.${title}`)}
                </h3>
                <p className="secondary max-w-sm text-sm">
                  {t(`StepByStep.card.subtitle.${subtitle}`)}
                </p>
              </div>
              <div
                className="absolute bottom-[0.5px] left-0 h-1 rounded-b-2xl bg-black/30"
                style={{ width: `${progress}%` }}
              />
            </div>
          ) : (
            <div
              key={index}
              onClick={() => setCurrentCard(index)}
              className={cn(
                "relative z-20 flex w-full cursor-pointer items-center gap-6 overflow-hidden rounded-xl bg-card p-6 text-foreground shadow-lg ring-1 ring-inset ring-border transition-all hover:bg-accent/50",
                "dark:bg-[#151926]/60 dark:hover:bg-[#212435]/60",
              )}
            >
              <Icon size={24} />
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-2xl font-bold">
                  {t(`StepByStep.card.title.${title}`)}
                </h3>
              </div>
            </div>
          ),
        )}
      </div>
      <div
        className={cn(
          "relative order-1 col-span-7 flex items-center justify-center",
          "lg:bottom-36 lg:order-2 lg:col-span-4",
        )}
      >
        <img
          className={cn(
            "relative h-[400px] w-full object-contain object-center",
            "lg:absolute lg:top-10 lg:h-[800px] lg:w-[800px]",
          )}
          src={`/assets/services/howitworks${currentCard + 1}${theme === "light" ? "_w" : ""}.png`}
          alt="Illustration"
        />
      </div>
    </div>
  );
};

export default StepByStep;
