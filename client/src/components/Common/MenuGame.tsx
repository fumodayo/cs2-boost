import clsx from "clsx";

const games = [
  { image: "counter-strike-2", name: "Counter Strike 2", link: "" },
  { image: "lol-wild-rift", name: "Lol: Wild Rift", link: "" },
  { image: "overwatch-2", name: "Overwatch 2", link: "" },
  { image: "rocket-league", name: "Rocket League", link: "" },
  { image: "teamfight-tactics", name: "Teamfight Tactics", link: "" },
  { image: "valorant", name: "Valorant", link: "" },
  { image: "world-of-warcraft", name: "World of Warcraft", link: "" },
  { image: "league-of-legends", name: "League of Legends", link: "" },
  { image: "destiny-2", name: "Destiny 2", link: "" },
  { image: "apex-legends", name: "Apex Legends", link: "" },
];

const MenuGame = () => {
  return (
    <div>
      {games.map((game) => (
        <a
          className={clsx(
            "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          )}
          href={game.link}
        >
          <img
            className="mr-2 h-6 w-6"
            src={`/src/assets/${game.image}/logo.svg`}
          />
          {game.name}
        </a>
      ))}
    </div>
  );
};

export default MenuGame;
