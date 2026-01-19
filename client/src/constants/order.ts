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

type IStatusProps = {
  translationKey: string;
  value: string;
  icon?: IconType;
};

const listOfStatus: IStatusProps[] = [
  {
    translationKey: "pending",
    value: ORDER_STATUS.PENDING,
    icon: FaCreditCard,
  },
  {
    translationKey: "waiting",
    value: ORDER_STATUS.WAITING,
    icon: FaUserClock,
  },
  {
    translationKey: "in_active",
    value: ORDER_STATUS.IN_ACTIVE,
    icon: FaUserClock,
  },
  {
    translationKey: "in_progress",
    value: ORDER_STATUS.IN_PROGRESS,
    icon: BiSolidJoystick,
  },
  {
    translationKey: "cancel",
    value: ORDER_STATUS.CANCEL,
    icon: MdOutlineCancel,
  },
  {
    translationKey: "completed",
    value: ORDER_STATUS.COMPLETED,
    icon: SiTicktick,
  },
];

const filterOrderType: IStatusProps[] = [
  { translationKey: "wingman", value: "wingman" },
  { translationKey: "premier", value: "premier" },
  { translationKey: "level_farming", value: "level_farming" },
];

const filterOrderStatus: IStatusProps[] = [
  { translationKey: "pending", value: "PENDING" },
  { translationKey: "waiting", value: "WAITING" },
  { translationKey: "in_active", value: "IN_ACTIVE" },
  { translationKey: "in_progress", value: "IN_PROGRESS" },
  { translationKey: "completed", value: "COMPLETED" },
  { translationKey: "cancel", value: "CANCEL" },
];

const filterUserRole: IStatusProps[] = [
  { translationKey: "client", value: ROLE.CLIENT },
  { translationKey: "partner", value: ROLE.PARTNER },
  { translationKey: "admin", value: ROLE.ADMIN },
];

const filterBanStatus: IStatusProps[] = [
  { translationKey: "banned", value: "true" },
  { translationKey: "active", value: "false" },
];

const filterTransactionType: IStatusProps[] = [
  { translationKey: "sale", value: "SALE" },
  { translationKey: "payout", value: "PAYOUT" },
  { translationKey: "commission", value: "PARTNER_COMMISSION" },
  { translationKey: "penalty", value: "PENALTY" },
  { translationKey: "fee", value: "FEE" },
  { translationKey: "refund", value: "REFUND" },
];

const filterPartnerRequestStatus: IStatusProps[] = [
  { translationKey: "pending", value: "pending" },
  { translationKey: "approved", value: "approved" },
  { translationKey: "reject", value: "rejected" },
];

export type { IStatusProps };

export {
  ORDER_STATUS,
  listOfStatus,
  filterOrderStatus,
  filterOrderType,
  filterUserRole,
  filterBanStatus,
  filterTransactionType,
  filterPartnerRequestStatus,
  CONVERSATION_STATUS,
};