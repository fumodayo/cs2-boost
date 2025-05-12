export interface IListOfGames {
  label: string;
  value: string;
  isAvailable: boolean;
  isNew: boolean;
}

const listOfGames: IListOfGames[] = [
  {
    label: "Counter Strike 2",
    value: "counter-strike-2",
    isAvailable: true,
    isNew: true,
  },
  {
    label: "Free Fire",
    value: "free-fire",
    isAvailable: false,
    isNew: false,
  },
  {
    label: "Genshin Impact",
    value: "genshin-impact",
    isAvailable: false,
    isNew: false,
  },
  {
    label: "Honkai: Star Rail",
    value: "honkai-star-rail",
    isAvailable: false,
    isNew: false,
  },
  {
    label: "League of Legends",
    value: "league-of-legends",
    isAvailable: false,
    isNew: false,
  },
  {
    label: "Minecraft",
    value: "minecraft",
    isAvailable: false,
    isNew: false,
  },
  {
    label: "Overwatch 2",
    value: "overwatch-2",
    isAvailable: false,
    isNew: false,
  },
  {
    label: "PUBG Mobile",
    value: "pubg-mobile",
    isAvailable: false,
    isNew: false,
  },
  {
    label: "Roblox",
    value: "roblox",
    isAvailable: false,
    isNew: false,
  },
  {
    label: "Rust",
    value: "rust",
    isAvailable: false,
    isNew: false,
  },
  {
    label: "Valorant",
    value: "valorant",
    isAvailable: false,
    isNew: false,
  },
  {
    label: "War Thrunder",
    value: "war-thunder",
    isAvailable: false,
    isNew: false,
  },
  {
    label: "Warframe",
    value: "warframe",
    isAvailable: false,
    isNew: false,
  },
  {
    label: "World Of Tanks",
    value: "world-of-tanks",
    isAvailable: false,
    isNew: false,
  },
];

export interface IListOfRank {
  name: string;
  value: string;
  image: string;
}

const listOfRanks = [
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
    name: "Golden Nova 1",
    value: "glob_nova_1",
    image: "GOLD_NOVA_1__WINGAME",
  },
  {
    name: "Golden Nova 2",
    value: "glob_nova_2",
    image: "GOLD_NOVA_2__WINGAME",
  },
  {
    name: "Golden Nova 3",
    value: "glob_nova_3",
    image: "GOLD_NOVA_3__WINGAME",
  },
  {
    name: "Golden Nova Master",
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

export { listOfGames, listOfRanks };
