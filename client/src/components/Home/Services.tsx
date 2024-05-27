import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

import { AppContext } from "../../context/AppContext";

interface CardServiceProps {
  image_number: string;
  title?: string;
  subtitle?: string;
}

const CardService: React.FC<CardServiceProps> = ({
  image_number,
  title,
  subtitle,
}) => {
  const { t } = useTranslation();
  const { theme } = useContext(AppContext);

  return (
    <div
      className={clsx(
        "border-gradient group relative h-full w-full overflow-hidden rounded-2xl bg-card",
        "dark:bg-[#141825]",
        "transition-transform duration-500 before:absolute before:-inset-px before:h-[calc(100%+2px)] before:w-[calc(100%+2px)] before:rounded-xl before:blur-xl",
      )}
    >
      {image_number && (
        <img
          src={`/assets/illustrations/s${image_number}${
            theme === "light" ? "_w" : ""
          }.png`}
          alt="feature1"
          loading="lazy"
          className="h-full w-full rounded-2xl object-cover"
        />
      )}
      <div className="absolute bottom-4 flex flex-col gap-2 p-8 pt-0">
        {title && (
          <h3 className="text-2xl font-bold text-foreground">{t(title)}</h3>
        )}
        {subtitle && (
          <p className="text-base text-foreground">{t(subtitle)}.</p>
        )}
      </div>
    </div>
  );
};

const Circle: React.FC = () => {
  const dpkCursorMouse = { x: -100, y: -100 };
  const dpkCursorPos = { x: 0, y: 0 };
  const speed = 0.25;

  useEffect(() => {
    const dpkCursor = document.createElement("div");
    dpkCursor.classList.add("dpkCursor");
    document.body.appendChild(dpkCursor);

    window.addEventListener("mousemove", (e) => {
      dpkCursorMouse.x = e.clientX;
      dpkCursorMouse.y = e.clientY;
    });

    const updatePosition = () => {
      dpkCursorPos.x += (dpkCursorMouse.x - dpkCursorPos.x) * speed;
      dpkCursorPos.y += (dpkCursorMouse.y - dpkCursorPos.y) * speed;

      dpkCursor.style.transform = `translate(calc(${dpkCursorPos.x}px - 50%), calc(${dpkCursorPos.y}px - 50%))`;
    };

    function loop() {
      updatePosition();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    return () => {
      document.body.removeChild(dpkCursor);
    };
  }, [speed]);

  return null;
};

const Services = () => {
  const { t } = useTranslation();

  return (
    <div id="services">
      <div
        className={clsx(
          "relative z-20 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4",
          "sm:px-6 xl:px-8",
        )}
      >
        <h2
          className={clsx(
            "font-display mx-auto text-center text-4xl font-bold tracking-tight text-foreground",
            "md:mx-0",
          )}
        >
          {t("Gaming Services Just Got Better")}
        </h2>
        <p
          className={clsx(
            "mx-auto mt-4 text-center text-foreground",
            "md:mx-0",
          )}
        >
          {t("We are setting the new standard in the gaming industry.")}
        </p>
        <div className="mt-20 grid w-full grid-cols-5 gap-4">
          <div className={clsx("col-span-5 w-full", "lg:col-span-2")}>
            <CardService
              image_number="1"
              title="Instant 24/7 Human Support"
              subtitle="No bots, no ChatGPT – just humans"
            />
          </div>
          <div
            className={clsx(
              "col-span-5 grid grid-cols-2 gap-4",
              "lg:col-span-3",
            )}
          >
            <div className={clsx("col-span-2 w-full", "md:col-span-1")}>
              <CardService
                image_number="3"
                title="3-6% Cashback on all purchases"
              />
            </div>
            <div className={clsx("col-span-2 w-full", "md:col-span-1")}>
              <CardService
                image_number="2"
                title="Full Privacy & Anonymity"
                subtitle="Who are you? We don't know"
              />
            </div>
            <div className="col-span-2">
              <CardService
                image_number="4"
                title="Secure & Instant Payments"
                subtitle="Buy gaming services with PaysafeCard, Apple Pay, and more"
              />
            </div>
          </div>
        </div>
        <Circle />
      </div>
    </div>
  );
};

export default Services;
