import {
  FaEarthAsia,
  FaEarthAfrica,
  FaEarthEurope,
  FaEarthAmericas,
} from "react-icons/fa6";
import { BsGlobeAsiaAustralia } from "react-icons/bs";
import { useTranslation } from "react-i18next";

const listOfCountries = [
  {
    name: "Africa",
    value: "AF",
    icon: FaEarthAfrica,
  },
  {
    name: "Asia",
    value: "AS",
    icon: FaEarthAsia,
  },
  {
    name: "Australia",
    value: "AU",
    icon: BsGlobeAsiaAustralia,
  },
  {
    name: "China",
    value: "CN",
    icon: FaEarthAsia,
  },
  {
    name: "Europe",
    value: "EU",
    icon: FaEarthEurope,
  },
  {
    name: "North America",
    value: "NA",
    icon: FaEarthAmericas,
  },
  {
    name: "South America",
    value: "SA",
    icon: FaEarthAmericas,
  },
];

interface ChooseServerProps {
  server?: string;
  onChooseServer: (value: string) => void;
}

const ChooseServer: React.FC<ChooseServerProps> = ({
  server,
  onChooseServer,
}) => {
  const { t } = useTranslation();

  return (
    <div className="scroll-custom mx-auto mb-5 w-full rounded-lg bg-card p-6 shadow-md">
      <p className="mb-1 text-start text-lg font-bold text-foreground">
        {t("Server")}
      </p>
      <p className="text-start text-sm text-muted-foreground">
        {t("Select the server you play on")}
      </p>
      <div className="flex justify-start overflow-x-auto py-5">
        <div className="flex space-x-8">
          {listOfCountries.map((country) => (
            <button
              key={country.value}
              onClick={() => onChooseServer(country.value)}
              className="text-md h-40 w-72 rounded-lg bg-accent py-2 font-semibold text-foreground"
            >
              <div className="flex flex-col items-center gap-2">
                {server === country.value ? (
                  <img
                    src={`/src/assets/counter-strike-2/server/${country.value}-selected.png`}
                    alt={country.value}
                    className="h-24 w-full object-contain"
                  />
                ) : (
                  <img
                    src={`/src/assets/counter-strike-2/server/${country.value}.png`}
                    alt={country.value}
                    className="h-24 w-full object-contain"
                  />
                )}
                <p>{t(country.name)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChooseServer;
