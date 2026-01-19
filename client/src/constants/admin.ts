import {
  FaCog,
  FaUsers,
  FaPercent,
  FaUserCheck,
  FaTicketAlt,
} from "react-icons/fa";
import { FaCartShopping, FaChartSimple } from "react-icons/fa6";
import { HiMiniRocketLaunch } from "react-icons/hi2";
import { IoGrid, IoChatbubblesOutline } from "react-icons/io5";
import { TbMessageReportFilled } from "react-icons/tb";
import { FiMail, FiBell } from "react-icons/fi";

const listOfServices = [
  {
    titleKey: "sidebar.main",
    items: [
      {
        labelKey: "sidebar.dashboard",
        value: "/admin/dashboard",
        icon: IoGrid,
      },
    ],
  },
  {
    titleKey: "sidebar.manage",
    items: [
      {
        labelKey: "sidebar.manage_orders",
        value: "/admin/manage-orders",
        icon: FaCartShopping,
      },
      {
        labelKey: "sidebar.manage_users",
        value: "/admin/manage-users",
        icon: FaUsers,
      },
      {
        labelKey: "sidebar.partner_requests",
        value: "/admin/partner-requests",
        icon: FaUserCheck,
      },
      {
        labelKey: "sidebar.manage_boost",
        value: "/admin/manage-boost",
        icon: HiMiniRocketLaunch,
      },
      {
        labelKey: "sidebar.promo_codes",
        value: "/admin/promo-codes",
        icon: FaTicketAlt,
      },
      {
        labelKey: "sidebar.manage_reports",
        value: "/admin/manage-reports",
        icon: TbMessageReportFilled,
      },
      {
        labelKey: "sidebar.live_chats",
        value: "/admin/live-chats",
        icon: IoChatbubblesOutline,
      },
      {
        labelKey: "sidebar.manage_revenue",
        value: "/admin/manage-revenue",
        icon: FaChartSimple,
      },
      {
        labelKey: "sidebar.commission",
        value: "/admin/commission",
        icon: FaPercent,
      },
      {
        labelKey: "sidebar.notifications",
        value: "/admin/notifications",
        icon: FiBell,
      },
      {
        labelKey: "sidebar.email_templates",
        value: "/admin/email-templates",
        icon: FiMail,
      },
    ],
  },
  {
    titleKey: "sidebar.user",
    items: [
      {
        labelKey: "sidebar.settings",
        value: "/admin/settings",
        icon: FaCog,
      },
    ],
  },
];

export { listOfServices };