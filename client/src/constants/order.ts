import { IconType } from "react-icons";
import { BiSolidJoystick } from "react-icons/bi";
import { FaCreditCard, FaUserClock } from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";
import { SiTicktick } from "react-icons/si";

const ORDER_STATUS = {
  PENDING: "pending",
  WAITING: "waiting",
  IN_ACTIVE: "in_active",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCEL: "cancel",
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
  { label: "Pending", value: "pending" },
  { label: "Waiting", value: "waiting" },
  { label: "In Active", value: "in_active" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancel", value: "cancel" },
];

export { ORDER_STATUS, listOfStatus, filterOrderStatus, filterOrderType };
