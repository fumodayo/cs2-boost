import { useTranslation } from "react-i18next";
import { listOfCountries } from "../constants";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import SwiperCore from "swiper";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useRef } from "react";
import { Button } from "./Buttons/Button";

interface ChooseServerProps {
  server?: string;
  onChooseServer: (value: string) => void;
}

const ChooseServer: React.FC<ChooseServerProps> = ({
  server,
  onChooseServer,
}) => {
  const { t } = useTranslation();
  const swiperRef = useRef<SwiperCore>();

  return (
    <div className="mx-auto mb-5 w-full rounded-lg bg-card p-6 shadow-md">
      <p className="mb-1 text-start text-lg font-bold text-foreground">
        {t("Server")}
      </p>
      <div className="mb-4 flex justify-between">
        <p className="mt-1 text-sm text-muted-foreground">
          {t("Select the server you play on")}
        </p>
        <div className="space-x-1">
          <Button
            color="transparent"
            onClick={() => swiperRef.current && swiperRef.current.slidePrev()}
            className="rounded-md px-4 py-2 text-sm font-medium"
          >
            <FaChevronLeft className="text-base" />
          </Button>
          <Button
            color="transparent"
            onClick={() => swiperRef.current && swiperRef.current.slideNext()}
            className="rounded-md px-4 py-2 text-sm font-medium"
          >
            <FaChevronRight className="text-base" />
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
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {listOfCountries.map((country) => (
          <SwiperSlide>
            <button
              key={country.value}
              onClick={() => onChooseServer(country.value)}
              className="text-md h-32 w-24 rounded-lg bg-accent text-foreground md:h-40 md:w-56"
            >
              <div className="px-2">
                {server === country.value ? (
                  <img
                    src={`/assets/counter-strike-2/server/${country.value}-selected.png`}
                    alt={country.value}
                    className="h-20 w-full object-contain md:h-24"
                  />
                ) : (
                  <img
                    src={`/assets/counter-strike-2/server/${country.value}.png`}
                    alt={country.value}
                    className="h-20 w-full object-contain md:h-24"
                  />
                )}
                <p className="mt-1 text-xs md:text-base md:font-semibold">
                  {t(country.name)}
                </p>
              </div>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ChooseServer;
