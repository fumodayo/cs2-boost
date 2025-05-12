import { FaCog, FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { HiMiniRocketLaunch } from "react-icons/hi2";
import { IoGrid } from "react-icons/io5";
import { TbMessageReportFilled } from "react-icons/tb";

const listOfServices = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        value: "/admin/dashboard",
        icon: IoGrid,
      },
    ],
  },
  {
    title: "MANAGE",
    items: [
      {
        label: "Manage Orders",
        value: "/admin/manage-orders",
        icon: FaCartShopping,
      },
      {
        label: "Manage Users",
        value: "/admin/manage-users",
        icon: FaUsers,
      },
      {
        label: "Manage Boost",
        value: "/admin/manage-boost",
        icon: HiMiniRocketLaunch,
      },
      {
        label: "Manage Report",
        value: "/admin/manage-reports",
        icon: TbMessageReportFilled,
      },
    ],
  },
  {
    title: "USER",
    items: [
      {
        label: "Settings",
        value: "/admin/settings",
        icon: FaCog,
      },
    ],
  },
];

export { listOfServices };
