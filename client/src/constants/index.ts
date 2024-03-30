import {
  FaEarthAsia,
  FaEarthAfrica,
  FaEarthEurope,
  FaEarthAmericas,
} from "react-icons/fa6";
import { BsGlobeAsiaAustralia } from "react-icons/bs";
import { IconType } from "react-icons";

interface RankOption {
  name: string;
  value: string;
  image: string;
}

export const rankOptions: RankOption[] = [
  {
    name: "Silver 1",
    value: "silver_1",
    image: "SILVER_1__WINGAME",
  },
  {
    name: "Silver 2",
    value: "silver_2",
    image: "SILVER_2__WINGAME",
  },
  {
    name: "Silver 3",
    value: "silver_3",
    image: "SILVER_3__WINGAME",
  },
  {
    name: "Silver 4",
    value: "silver_4",
    image: "SILVER_4__WINGAME",
  },
  {
    name: "Silver Elite",
    value: "silver_elite",
    image: "SILVER_ELITE__WINGAME",
  },
  {
    name: "Silver Elite Master",
    value: "silver_elite_master",
    image: "SILVER_ELITE_MASTER__WINGAME",
  },
  {
    name: "Glob Nova 1",
    value: "glob_nova_1",
    image: "GOLD_NOVA_1__WINGAME",
  },
  {
    name: "Glob Nova 2",
    value: "glob_nova_2",
    image: "GOLD_NOVA_2__WINGAME",
  },
  {
    name: "Glob Nova 3",
    value: "glob_nova_3",
    image: "GOLD_NOVA_3__WINGAME",
  },
  {
    name: "Glob Nova Master",
    value: "glob_nova_master",
    image: "GOLD_NOVA_MASTER__WINGAME",
  },
  {
    name: "Master Guardian 1",
    value: "master_guardian_1",
    image: "MASTER_GUADIAN_1__WINGAME",
  },
  {
    name: "Master Guardian 2",
    value: "master_guardian_2",
    image: "MASTER_GUARDIAN_2__WINGAME",
  },
  {
    name: "Master Guardian Elite",
    value: "master_guardian_elite",
    image: "MASTER_GUARDIAN_ELITE__WINGAME",
  },
  {
    name: "Distinguished Master Guardian",
    value: "distinguished_master_guardian",
    image: "DISTINGUISHED__MASTER__GUARDIAN__WINGAME",
  },
  {
    name: "Legendary Eagle",
    value: "legendary_eagle",
    image: "LEGENDARY__EAGLE__WINGAME",
  },
  {
    name: "Legendary Eagle Master",
    value: "legendary_eagle_master",
    image: "LEGENDARY__EAGLE__MASTER__WINGAME",
  },
  {
    name: "Supreme",
    value: "supreme",
    image: "SUPREME__WINGAME",
  },
  {
    name: "Global Elite",
    value: "global_elite",
    image: "GLOBAL_ELITE__WINGAME",
  },
];

interface ListOfCountry {
  name: string;
  value: string;
  icon: IconType;
}

export const listOfCountries: ListOfCountry[] = [
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

export interface ListOfGame {
  image?: string;
  value: string;
  label?: string;
  available?: boolean;
  href?: string;
}

export const listOfGame: ListOfGame[] = [
  {
    image: "counter-strike-2",
    label: "Counter Strike 2",
    value: "counter strike 2",
    href: "counter-strike-2",
    available: true,
  },
  {
    image: "lol-wild-rift",
    label: "Lol: Wild Rift",
    value: "lol wild rift",
    href: "lol-wild-rift",
    available: false,
  },
  {
    image: "overwatch-2",
    label: "Overwatch 2",
    value: "overwatch 2",
    href: "overwatch-2",
    available: false,
  },
  {
    image: "rocket-league",
    label: "Rocket League",
    value: "rocket league",
    href: "rocket-league",
    available: false,
  },
  {
    image: "teamfight-tactics",
    label: "Teamfight Tactics",
    value: "teamfight tactics",
    href: "teamfight-tactics",
    available: false,
  },
  {
    image: "valorant",
    label: "Valorant",
    value: "valorant",
    href: "valorant",
    available: false,
  },
  {
    image: "world-of-warcraft",
    label: "World of Warcraft",
    value: "world-of-warcraft",
    href: "world of warcraft",
    available: false,
  },
  {
    image: "league-of-legends",
    label: "League of Legends",
    value: "league-of-legends",
    href: "league of legends",
    available: false,
  },
  {
    image: "destiny-2",
    label: "Destiny 2",
    value: "destiny-2",
    href: "destiny 2",
    available: false,
  },
  {
    image: "apex-legends",
    label: "Apex Legends",
    value: "apex-legends",
    href: "apex legends",
    available: false,
  },
];
