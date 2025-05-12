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
  label: string;
  isActive?: boolean;
}

const listOfPathClient: IListOfPath[] = [
  {
    path: "/orders",
    icon: FaCartShopping,
    label: "Orders",
  },
  {
    path: "/wallet",
    icon: FaWallet,
    label: "Wallet",
  },
  {
    path: "/settings",
    icon: FaCog,
    label: "Settings",
  },
  {
    path: "/follow-partners",
    icon: RiUserHeartFill,
    label: "Follow Partners",
  },
  {
    path: "/supports",
    icon: BiSupport,
    label: "Supports",
  },
];

const listOfPathPartner: IListOfPath[] = [
  {
    path: "/pending-boosts",
    icon: MdOutlinePendingActions,
    label: "Pending Boosts",
  },
  {
    path: "/progress-boosts",
    icon: GiSamuraiHelmet,
    label: "Progress Boosts",
  },
  {
    path: "/income",
    icon: FaMoneyBillTrendUp,
    label: "Income",
  },
  {
    path: "/orders",
    icon: FaCartShopping,
    label: "Orders",
  },
  {
    path: "/wallet",
    icon: FaWallet,
    label: "Wallet",
  },
  {
    path: "/settings",
    icon: FaCog,
    label: "Settings",
  },
  {
    path: "/follow-partners",
    icon: RiUserHeartFill,
    label: "Follow Partners",
  },
  {
    path: "/supports",
    icon: BiSupport,
    label: "Supports",
  },
];

export { listOfPathClient, listOfPathPartner };
