import { useContext, useRef, useEffect } from "react";
import gsap from "gsap";
import { AppContext } from "~/components/context/AppContext";
import cn from "~/libs/utils";
import { useTranslation } from "react-i18next";

interface ICardProps {
  image: string;
  titleKey: string;
  subtitleKey?: string;
}

const Circle: React.FC<{ containerRef: React.RefObject<HTMLDivElement> }> = ({
  containerRef,
}) => {
  const dpkCursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dpkCursor = dpkCursorRef.current;
    const container = containerRef.current;

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
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
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

const Card = ({ image, titleKey, subtitleKey }: ICardProps) => {
  const { t } = useTranslation("landing");
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
        alt={t(titleKey)}
      />
      <div className="absolute bottom-4 flex flex-col gap-2 p-8 pt-0">
        <h5 className="text-2xl font-bold text-foreground">{t(titleKey)}</h5>
        <p className="text-base text-foreground/90">
          {subtitleKey && t(subtitleKey)}
        </p>
      </div>
    </div>
  );
};

const cards = {
  support: {
    image: "1",
    titleKey: "new_standard.support.title",
    subtitleKey: "new_standard.support.subtitle",
  },
  privacy: {
    image: "2",
    titleKey: "new_standard.privacy.title",
    subtitleKey: "new_standard.privacy.subtitle",
  },
  cashback: {
    image: "3",
    titleKey: "new_standard.cashback.title",
  },
  payments: {
    image: "4",
    titleKey: "new_standard.payments.title",
    subtitleKey: "new_standard.payments.subtitle",
  },
};

const NewStandard = () => {
  const { t } = useTranslation("landing");
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <h2
        className={cn(
          "font-display mx-auto text-center text-4xl font-bold tracking-tight text-foreground",
          "md:mx-0",
        )}
      >
        {t("new_standard.heading")}
      </h2>
      <p
        className={cn("mx-auto mt-4 text-center text-foreground/90", "md:mx-0")}
      >
        {t("new_standard.subheading")}
      </p>
      <div
        className="z-20 mt-20 grid w-full grid-cols-5 gap-4"
        ref={containerRef}
      >
        <Circle containerRef={containerRef} />
        <div className={cn("col-span-5 w-full", "lg:col-span-2")}>
          <Card {...cards.support} />
        </div>
        <div
          className={cn("col-span-5 grid grid-cols-2 gap-4", "lg:col-span-3")}
        >
          <div className="col-span-2 w-full md:col-span-1">
            <Card {...cards.cashback} />
          </div>
          <div className={cn("col-span-2 w-full", "md:col-span-1")}>
            <Card {...cards.privacy} />
          </div>
          <div className="col-span-2">
            <Card {...cards.payments} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewStandard;