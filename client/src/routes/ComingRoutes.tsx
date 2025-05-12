import { Route } from "react-router-dom";
import { NewGamePage } from "~/pages";

interface INewGame {
  path: string;
  image: string;
  title: string;
}

const newGames: INewGame[] = [
  {
    path: "/free-fire",
    image: "free-fire",
    title: "Free Fire",
  },
  {
    path: "/genshin-impact",
    image: "genshin-impact",
    title: "Genshin Impact",
  },
  {
    path: "/honkai-star-rail",
    image: "honkai-star-rail",
    title: "Honkai Star Rail",
  },
  {
    path: "/league-of-legends",
    image: "league-of-legends",
    title: "League of Legends",
  },
  {
    path: "/minecraft",
    image: "minecraft",
    title: "Minecraft",
  },
  {
    path: "/overwatch-2",
    image: "overwatch-2",
    title: "Overwatch 2",
  },
  {
    path: "/pubg-mobile",
    image: "pubg-mobile",
    title: "PUBG Mobile",
  },
  {
    path: "/roblox",
    image: "roblox",
    title: "Roblox",
  },
  {
    path: "/rust",
    image: "rust",
    title: "Rust",
  },
  {
    path: "/valorant",
    image: "valorant",
    title: "Valorant",
  },
  {
    path: "/war-thunder",
    image: "war-thunder",
    title: "War Thunder",
  },
  {
    path: "/warframe",
    image: "warframe",
    title: "Warframe",
  },
  {
    path: "/world-of-tanks",
    image: "world-of-tanks",
    title: "World of Tanks",
  },
];

const ComingRoutes = () => {
  return (
    <>
      {newGames.map(({ path, ...props }) => (
        <Route key={path} path={path} element={<NewGamePage {...props} />} />
      ))}
    </>
  );
};

export default ComingRoutes;
