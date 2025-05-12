import { useTranslation } from "react-i18next";
import { FaRightToBracket } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

interface ICardProps {
  title: string;
  subtitle: string;
  image: string;
  path: string;
}

const Card = ({ title, subtitle, image, path }: ICardProps) => {
  const { t } = useTranslation();
  return (
    <Link
      to={`/counter-strike-2/${path}`}
      className="group w-full hover:cursor-pointer"
    >
      <div className="overflow-hidden rounded-2xl">
        <img
          className="h-80 w-full transform object-cover transition-transform duration-300 group-hover:scale-110"
          src={`/assets/games/counter-strike-2/services/${image}.png`}
          alt={image}
        />
      </div>
      <div className="mt-4 h-36 rounded-2xl border border-border bg-card px-4 py-3 transition duration-300 group-hover:bg-accent sm:h-36 sm:px-8 sm:py-4 md:h-32 lg:h-24">
        <div className="flex items-center gap-2">
          <div className="w-full">
            <p className="text-base font-bold sm:text-lg">
              {t(`Globals.GameMode.${title}`)}
            </p>
            <div className="flex justify-between">
              <p className="text-xs text-muted-foreground sm:text-sm">
                {t(`GameModePage.card.subtitle.${subtitle}`)}
              </p>
              <FaRightToBracket className="text-xl text-muted-foreground sm:text-2xl" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const cards = [
  {
    title: "Level Farming",
    subtitle: "Farming levels to gain experience points and rewards",
    image: "level-farming",
    path: "level-farming",
  },
  {
    title: "Premier",
    subtitle: "A competitive ranked mode with the new Elo system",
    image: "premier",
    path: "premier",
  },
  {
    title: "Wingman",
    subtitle: "A 2v2 mode on smaller maps, focused on strategy and teamwork",
    image: "wingman",
    path: "wingman",
  },
];

const ListMode = () => (
  <div className="col-span-4 my-4 flex w-full gap-8 lg:col-span-4 xl:col-span-5">
    <div className="flex w-full justify-between gap-4">
      {cards.map((props) => (
        <Card key={uuidv4()} {...props} />
      ))}
    </div>
  </div>
);

export default ListMode;
