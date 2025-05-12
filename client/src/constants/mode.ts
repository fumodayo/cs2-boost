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
  label: string;
  path: string;
}

const gameMode: IGameModeProps[] = [
  {
    icon: HiSparkles,
    label: "Services",
    path: "/counter-strike-2",
  },
  {
    icon: FaPlus,
    label: "Level Farming",
    path: "/counter-strike-2/level-farming",
  },
  {
    icon: PiUsersThreeDuotone,
    label: "Premier",
    path: "/counter-strike-2/premier",
  },
  {
    icon: PiUsersDuotone,
    label: "Wingman",
    path: "/counter-strike-2/wingman",
  },
];

export interface IGameServerProps {
  label: string;
  value: string;
  icon: IconType;
}

const gameServer: IGameServerProps[] = [
  {
    label: "Africa",
    value: "AF",
    icon: FaEarthAfrica,
  },
  {
    label: "Asia",
    value: "AS",
    icon: FaEarthAsia,
  },
  {
    label: "Australia",
    value: "AU",
    icon: BsGlobeAsiaAustralia,
  },
  {
    label: "China",
    value: "CN",
    icon: FaEarthAsia,
  },
  {
    label: "Europe",
    value: "EU",
    icon: FaEarthEurope,
  },
  {
    label: "North America",
    value: "NA",
    icon: FaEarthAmericas,
  },
  {
    label: "South America",
    value: "SA",
    icon: FaEarthAmericas,
  },
];

export { gameMode, gameServer };
