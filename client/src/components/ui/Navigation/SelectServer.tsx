import { useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import SwiperCore from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "~/components/ui/Button";
import cn from "~/libs/utils";
import { gameServer } from "~/constants/mode";
import { useTranslation } from "react-i18next";

interface ISelectServerProps {
  server?: string;
  setServer: (value: string) => void;
}

const SelectServer = ({ server, setServer }: ISelectServerProps) => {
  const { t } = useTranslation("common");
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
        {t("select_server.title")}
      </p>
      <div className="mb-4 flex justify-between">
        <p className="mt-1 text-sm text-muted-foreground">
          {t("select_server.subtitle")}
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
        {gameServer.map(({ value, translationKey }, idx) => (
          <SwiperSlide key={idx}>
            <Button
              onClick={() => setServer(value)}
              className="h-28 w-24 rounded-lg bg-accent text-foreground sm:h-32 sm:w-2 md:h-40 md:w-56"
            >
              <div
                className={cn(
                  "group relative h-28 w-full overflow-hidden rounded-lg border-2 bg-accent p-3 text-center transition-all duration-300 ease-in-out focus:outline-none sm:h-40",
                  server === value
                    ? "scale-102 border-primary shadow-lg shadow-primary/10"
                    : "hover:scale-102 border-transparent hover:border-primary/50",
                )}
              >
                <img
                  className="h-16 w-full object-contain sm:h-28"
                  src={`/assets/games/counter-strike-2/servers/${value}${server === value ? "-selected" : ""}.png`}
                  alt={t(`servers.${translationKey}`)}
                />
                <p
                  className={cn(
                    "mt-1 text-[9px] sm:text-sm md:font-semibold",
                    server === value
                      ? "text-secondary-foreground"
                      : "secondary",
                  )}
                >
                  {t(`servers.${translationKey}`)}
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