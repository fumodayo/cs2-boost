import { IconType } from "react-icons";
import { BiSolidJoystick } from "react-icons/bi";
import { FaCreditCard, FaUserClock } from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";
import { SiTicktick } from "react-icons/si";
import { ROLE } from "~/types/constants";

const ORDER_STATUS = {
  PENDING: "PENDING",
  WAITING: "WAITING",
  IN_ACTIVE: "IN_ACTIVE",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCEL: "CANCEL",
};

const CONVERSATION_STATUS = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
};

interface IStatusProps {
  label?: string;
  value?: string;
  icon: IconType;
}

const listOfStatus: IStatusProps[] = [
  {
    label: "Waiting For Payment",
    value: ORDER_STATUS.PENDING,
    icon: FaCreditCard,
  },
  {
    label: "Waiting For Booster",
    value: ORDER_STATUS.WAITING,
    icon: FaUserClock,
  },
  {
    label: "Waiting For Booster",
    value: ORDER_STATUS.IN_ACTIVE,
    icon: FaUserClock,
  },
  {
    label: "Boost in progress",
    value: ORDER_STATUS.IN_PROGRESS,
    icon: BiSolidJoystick,
  },
  {
    label: "Boost has been cancelled",
    value: ORDER_STATUS.CANCEL,
    icon: MdOutlineCancel,
  },
  {
    label: "Boost completed",
    value: ORDER_STATUS.COMPLETED,
    icon: SiTicktick,
  },
];

const filterOrderType = [
  { label: "Wingman", value: "wingman" },
  { label: "Premier", value: "premier" },
  { label: "Level Farming", value: "level_farming" },
];

const filterOrderStatus = [
  { label: "Pending", value: "PENDING" },
  { label: "Waiting", value: "WAITING" },
  { label: "In Active", value: "IN_ACTIVE" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancel", value: "CANCEL" },
];

const filterUserRole = [
  { label: "Client", value: ROLE.CLIENT },
  { label: "Partner", value: ROLE.PARTNER },
  { label: "Admin", value: ROLE.ADMIN },
];

const filterBanStatus = [
  { label: "Banned", value: "true" },
  { label: "Active", value: "false" },
];

const filterTransactionType = [
  { label: "Sale", value: "SALE" },
  { label: "Payout", value: "PAYOUT" },
  { label: "Commission", value: "PARTNER_COMMISSION" },
  { label: "Penalty", value: "PENALTY" },
  { label: "Fee", value: "FEE" },
  { label: "Refund", value: "REFUND" },
];

export {
  ORDER_STATUS,
  listOfStatus,
  filterOrderStatus,
  filterOrderType,
  filterUserRole,
  filterBanStatus,
  filterTransactionType,
  CONVERSATION_STATUS,
};
