import { IconType } from "react-icons";
import { BiSupport } from "react-icons/bi";
import { FaCog } from "react-icons/fa";
import { FaCartShopping, FaMoneyBillTrendUp, FaWallet } from "react-icons/fa6";
import { GiSamuraiHelmet } from "react-icons/gi";
import { MdOutlinePendingActions } from "react-icons/md";
import { RiUserHeartFill } from "react-icons/ri";

export interface IListOfPath {
  path: string;
  icon: IconType;
  tabKey: string;
  isActive?: boolean;
}

const listOfPathClient: IListOfPath[] = [
  {
    path: "/orders",
    icon: FaCartShopping,
    tabKey: "orders",
  },
  {
    path: "/wallet",
    icon: FaWallet,
    tabKey: "wallet",
  },
  {
    path: "/settings",
    icon: FaCog,
    tabKey: "settings",
  },
  {
    path: "/follow-partners",
    icon: RiUserHeartFill,
    tabKey: "follow_partners",
  },
  {
    path: "/supports",
    icon: BiSupport,
    tabKey: "supports",
  },
];

const listOfPathPartner: IListOfPath[] = [
  {
    path: "/pending-boosts",
    icon: MdOutlinePendingActions,
    tabKey: "pending_boosts",
  },
  {
    path: "/progress-boosts",
    icon: GiSamuraiHelmet,
    tabKey: "progress_boosts",
  },
  {
    path: "/income",
    icon: FaMoneyBillTrendUp,
    tabKey: "income",
  },
  {
    path: "/orders",
    icon: FaCartShopping,
    tabKey: "orders",
  },
  {
    path: "/wallet",
    icon: FaWallet,
    tabKey: "wallet",
  },
  {
    path: "/settings",
    icon: FaCog,
    tabKey: "settings",
  },
  {
    path: "/follow-partners",
    icon: RiUserHeartFill,
    tabKey: "follow_partners",
  },
  {
    path: "/supports",
    icon: BiSupport,
    tabKey: "supports",
  },
];

export { listOfPathClient, listOfPathPartner };