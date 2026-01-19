import { IconType } from "react-icons";
import { FaPlus } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";
import { PiUsersDuotone, PiUsersThreeDuotone } from "react-icons/pi";
import { BsGlobeAsiaAustralia } from "react-icons/bs";
import {
  FaEarthAfrica,
  FaEarthAmericas,
  FaEarthAsia,
  FaEarthEurope,
} from "react-icons/fa6";

export interface IGameModeProps {
  icon: IconType;
  tabKey: string;
  path: string;
}

const gameMode: IGameModeProps[] = [
  {
    icon: HiSparkles,
    tabKey: "services",
    path: "/counter-strike-2",
  },
  {
    icon: FaPlus,
    tabKey: "level_farming",
    path: "/counter-strike-2/level-farming",
  },
  {
    icon: PiUsersThreeDuotone,
    tabKey: "premier",
    path: "/counter-strike-2/premier",
  },
  {
    icon: PiUsersDuotone,
    tabKey: "wingman",
    path: "/counter-strike-2/wingman",
  },
];

export interface IGameServerProps {
  value: string;
  icon: IconType;
  translationKey: string;
}

const gameServer: IGameServerProps[] = [
  {
    value: "AF",
    icon: FaEarthAfrica,
    translationKey: "africa",
  },
  {
    value: "AS",
    icon: FaEarthAsia,
    translationKey: "asia",
  },
  {
    value: "AU",
    icon: BsGlobeAsiaAustralia,
    translationKey: "australia",
  },
  {
    value: "CN",
    icon: FaEarthAsia,
    translationKey: "china",
  },
  {
    value: "EU",
    icon: FaEarthEurope,
    translationKey: "europe",
  },
  {
    value: "NA",
    icon: FaEarthAmericas,
    translationKey: "north_america",
  },
  {
    value: "SA",
    icon: FaEarthAmericas,
    translationKey: "south_america",
  },
];

export { gameMode, gameServer };