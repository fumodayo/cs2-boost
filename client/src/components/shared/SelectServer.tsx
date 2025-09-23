import { useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import SwiperCore from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "./Button";
import cn from "~/libs/utils";
import { gameServer } from "~/constants/mode";
import { useTranslation } from "react-i18next";

interface ISelectServerProps {
  server?: string;
  setServer: (value: string) => void;
}

const SelectServer = ({ server, setServer }: ISelectServerProps) => {
  const { t } = useTranslation();
  const swiperRef = useRef<SwiperCore>();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (swiperRef.current && server) {
        const idx = gameServer.findIndex((i) => i.value === server);
        if (idx !== -1) {
          swiperRef.current.slideTo(idx, 300);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [server]);

  return (
    <div className="mx-auto mb-5 w-full rounded-lg bg-card p-6 shadow-md">
      <p className="mb-1 text-start text-lg font-bold text-foreground">
        {t("SelectServer.title")}
      </p>
      <div className="mb-4 flex justify-between">
        <p className="mt-1 text-sm text-muted-foreground">
          {t("SelectServer.subtitle")}
        </p>
        <div className="space-x-1">
          <Button
            variant="transparent"
            className="rounded-md px-4 py-2 text-sm font-medium"
            onClick={() => swiperRef.current && swiperRef.current.slidePrev()}
          >
            <FaChevronLeft />
          </Button>
          <Button
            variant="transparent"
            className="rounded-md px-4 py-2 text-sm font-medium"
            onClick={() => swiperRef.current && swiperRef.current.slideNext()}
          >
            <FaChevronRight />
          </Button>
        </div>
      </div>
      <Swiper
        className="ml-0"
        style={{ marginLeft: "0px" }}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {gameServer.map(({ label, value }, idx) => (
          <SwiperSlide key={idx}>
            <Button
              onClick={() => setServer(value)}
              className="h-32 w-24 rounded-lg bg-accent text-foreground md:h-40 md:w-56"
            >
              <div
                className={cn(
                  "group relative h-40 w-full overflow-hidden rounded-lg border-2 bg-accent p-3 text-center transition-all duration-300 ease-in-out focus:outline-none",
                  server === value
                    ? "scale-102 border-primary shadow-lg shadow-primary/10"
                    : "hover:scale-102 border-transparent hover:border-primary/50",
                )}
              >
                <img
                  className="h-20 w-full object-contain md:h-28"
                  src={`/assets/games/counter-strike-2/servers/${value}${server === value ? "-selected" : ""}.png`}
                  alt={label}
                />
                <p
                  className={cn(
                    "mt-1 text-xs md:text-base md:font-semibold",
                    server === value
                      ? "text-secondary-foreground"
                      : "secondary",
                  )}
                >
                  {t(`Globals.Server.${label}`)}
                </p>
              </div>
            </Button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SelectServer;
