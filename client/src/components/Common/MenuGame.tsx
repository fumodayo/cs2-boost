import clsx from "clsx";
import { useTranslation } from "react-i18next";
import * as Popover from "@radix-ui/react-popover";

import { IoChevronDownOutline } from "react-icons/io5";

const games = [
  { image: "counter-strike-2", name: "Counter Strike 2", link: "/counter-strike-2" },
  { image: "lol-wild-rift", name: "Lol: Wild Rift", link: "/lol-wild-rift" },
  { image: "overwatch-2", name: "Overwatch 2", link: "/overwatch-2" },
  { image: "rocket-league", name: "Rocket League", link: "/rocket-league" },
  { image: "teamfight-tactics", name: "Teamfight Tactics", link: "/teamfight-tactics" },
  { image: "valorant", name: "Valorant", link: "/valorant" },
  { image: "world-of-warcraft", name: "World of Warcraft", link: "/world-of-warcraft" },
  { image: "league-of-legends", name: "League of Legends", link: "/league-of-legends" },
  { image: "destiny-2", name: "Destiny 2", link: "/destiny-2" },
  { image: "apex-legends", name: "Apex Legends", link: "/apex-legends" },
];

const MenuGame = () => {
  const { t } = useTranslation();

  return (
    <Popover.Root>
      <Popover.Trigger>
        <button
          type="button"
          className={clsx(
            "relative flex h-11 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full border border-muted-foreground/20 bg-secondary-light px-4 py-2 text-sm font-medium text-secondary-light-foreground outline-none transition-colors",
            "hover:bg-secondary-light-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          <img
            src="/src/assets/illustrations/target.svg"
            className="h-5 w-5 fill-muted-foreground opacity-50"
            alt="target"
          />
          <div className="mx-1 capitalize">{t("Select Game")}</div>
          <IoChevronDownOutline />
        </button>
      </Popover.Trigger>
      <Popover.Content
        side="bottom"
        align="start"
        className="backdrop-brightness-5 z-50 w-64 min-w-[8rem] overflow-hidden rounded-md border bg-popover/75 p-2 text-popover-foreground shadow-md ring-1 ring-border backdrop-blur-lg"
      >
        {games.map(({ link, image, name }) => (
          <a
            key={name}
            className={clsx(
              "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none transition-colors",
              "hover:bg-accent focus:bg-accent focus:text-accent-foreground",
            )}
            href={link}
          >
            <img
              className="mr-2 h-6 w-6"
              src={`/src/assets/${image}/logo.svg`}
            />
            {name}
          </a>
        ))}
      </Popover.Content>
    </Popover.Root>
  );
};

export default MenuGame;
