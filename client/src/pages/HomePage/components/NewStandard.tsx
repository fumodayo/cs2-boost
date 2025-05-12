import { useContext, useRef, useEffect } from "react";
import gsap from "gsap";
import { AppContext } from "~/components/context/AppContext";
import cn from "~/libs/utils";
import { useTranslation } from "react-i18next";

interface ICardProps {
  image: string;
  title?: string;
  subtitle?: string;
}

const Circle: React.FC<{ containerRef: React.RefObject<HTMLDivElement> }> = ({
  containerRef,
}) => {
  const dpkCursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dpkCursor = dpkCursorRef.current;
    const container = containerRef.current;

    // Set initial position of the circle
    gsap.set(dpkCursor, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const handleMouseMove = (e: MouseEvent) => {
      const bounds = container?.getBoundingClientRect();
      if (
        bounds &&
        e.clientX >= bounds.left &&
        e.clientX <= bounds.right &&
        e.clientY >= bounds.top &&
        e.clientY <= bounds.bottom
      ) {
        gsap.to(dpkCursor, {
          x: e.clientX,
          y: e.clientY,
          autoAlpha: 1,
          duration: 0.3, // Increased duration for smoothness
          ease: "power2.out",
          overwrite: "auto", // Ensures smooth transitions
        });
      } else {
        gsap.to(dpkCursor, {
          autoAlpha: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [containerRef]);

  return (
    <div
      ref={dpkCursorRef}
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-10 h-[200px] w-[200px] rounded-full bg-[#91baf8] text-white opacity-10 shadow-2xl blur-[120px]",
        "dark:mix-blend-hard-light",
      )}
    />
  );
};

const Card = ({ image, title, subtitle }: ICardProps) => {
  const { t } = useTranslation();
  const { theme } = useContext(AppContext);

  return (
    <div
      className={cn(
        "container",
        "border-gradient before group relative h-full w-full overflow-hidden rounded-2xl bg-card transition-transform duration-500 before:absolute before:-inset-px before:h-[calc(100%+2px)] before:w-[calc(100%+2px)] before:rounded-xl before:blur-xl",
        "dark:bg-[#141825]",
      )}
    >
      <img
        className="h-full w-full rounded-2xl object-cover"
        src={`/assets/illustrations/s${image}${theme === "light" ? "_w" : ""}.png`}
      />
      <div className="absolute bottom-4 flex flex-col gap-2 p-8 pt-0">
        <h5 className="text-2xl font-bold text-foreground">
          {t(`NewStandard.card.title.${title}`)}
        </h5>
        <p className="text-base text-foreground/90">
          {subtitle && t(`NewStandard.card.subtitle.${subtitle}`)}
        </p>
      </div>
    </div>
  );
};

const NewStandard = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <h2
        className={cn(
          "font-display mx-auto text-center text-4xl font-bold tracking-tight text-foreground",
          "md:mx-0",
        )}
      >
        {t("NewStandard.heading")}
      </h2>
      <p
        className={cn("mx-auto mt-4 text-center text-foreground/90", "md:mx-0")}
      >
        {t("NewStandard.subheading")}
      </p>
      <div
        className="z-20 mt-20 grid w-full grid-cols-5 gap-4"
        ref={containerRef}
      >
        <Circle containerRef={containerRef} />
        <div className={cn("col-span-5 w-full", "lg:col-span-2")}>
          <Card
            image="1"
            title="Instant 24/7 Human Support"
            subtitle="No bots, no ChatGPT – just humans."
          />
        </div>
        <div
          className={cn("col-span-5 grid grid-cols-2 gap-4", "lg:col-span-3")}
        >
          <div className="col-span-2 w-full md:col-span-1">
            <Card image="3" title="3-6% Cashback on all purchases" />
          </div>
          <div className={cn("col-span-2 w-full", "md:col-span-1")}>
            <Card
              image="2"
              title="Full Privacy & Anonymity"
              subtitle="Who are you? We don't know."
            />
          </div>
          <div className="col-span-2">
            <Card
              image="4"
              title="Secure & Instant Payments"
              subtitle="Buy gaming services with PaysafeCard, Apple Pay, and more."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewStandard;
