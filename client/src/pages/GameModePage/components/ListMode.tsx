import { useTranslation } from "react-i18next";
import { FaRightToBracket } from "react-icons/fa6";
import { Link } from "react-router-dom";

interface ICardProps {
  title: string;
  subtitle: string;
  image: string;
  path: string;
}

const Card = ({ title, subtitle, image, path }: ICardProps) => {
  return (
    <Link
      to={`/counter-strike-2/${path}`}
      className="group w-full hover:cursor-pointer"
    >
      <div className="overflow-hidden rounded-2xl">
        <img
          className="h-48 w-full transform object-cover transition-transform duration-300 group-hover:scale-110 sm:h-80"
          src={`/assets/games/counter-strike-2/services/${image}.png`}
          alt={image}
        />
      </div>
      <div className="mt-3 rounded-2xl border border-border bg-card px-4 py-3 transition duration-300 group-hover:bg-accent sm:mt-4 sm:px-8 sm:py-4">
        <div className="flex items-center gap-2">
          <div className="w-full">
            <p className="text-sm font-bold sm:text-lg">{title}</p>
            <div className="flex items-center justify-between gap-2">
              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {subtitle}
              </p>
              <FaRightToBracket className="flex-shrink-0 text-lg text-muted-foreground sm:text-2xl" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const cardsData = [
  { key: "level_farming", image: "level-farming", path: "level-farming" },
  { key: "premier", image: "premier", path: "premier" },
  { key: "wingman", image: "wingman", path: "wingman" },
];

const ListMode = () => {
  const { t } = useTranslation(["game_mode", "common"]);

  return (
    <div className="col-span-4 my-4 flex w-full gap-8 lg:col-span-4 xl:col-span-5">
      <div className="flex w-full flex-wrap justify-between gap-4 xl:flex-nowrap">
        {cardsData.map((card) => (
          <Card
            key={card.key}
            image={card.image}
            path={card.path}
            title={t(`game_modes.${card.key}`, { ns: "common" })}
            subtitle={t(`list_mode.${card.key}.subtitle`)}
          />
        ))}
      </div>
    </div>
  );
};

export default ListMode;