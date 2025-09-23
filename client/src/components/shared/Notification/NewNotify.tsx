import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";
import toast from "react-hot-toast";
import clsx from "clsx";

import { formatDistanceDate } from "~/utils";
import { notificationService } from "~/services/notification.service";
import { INotification, IUser } from "~/types";
import { NOTIFY_TYPE } from "~/types/constants";
import { BiMessageSquare, BiRocket, BiUser } from "react-icons/bi";
import getErrorMessage from "~/utils/errorHandler";

interface NewNotifyProps extends INotification {
  mutate: KeyedMutator<INotification[]>;
}

const NotificationIcon = ({
  type,
  sender,
}: {
  type: string;
  sender?: IUser;
}) => {
  const iconProps = { className: "h-5 w-5 text-white" };

  let iconElement;
  let bgColor = "bg-gray-400";

  switch (type) {
    case NOTIFY_TYPE.MESSAGE:
      iconElement = <BiMessageSquare {...iconProps} />;
      bgColor = "bg-blue-500";
      break;
    case NOTIFY_TYPE.BOOST:
      iconElement = <BiRocket {...iconProps} />;
      bgColor = "bg-purple-500";
      break;
    case NOTIFY_TYPE.NEW_ORDER:
      iconElement = <BiRocket {...iconProps} />;
      bgColor = "bg-green-500";
      break;
    default:
      iconElement = <BiUser {...iconProps} />;
  }

  return (
    <div
      className={clsx(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
        bgColor,
      )}
    >
      {sender?.profile_picture ? (
        <img
          src={sender.profile_picture}
          alt={sender.username}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        iconElement
      )}
    </div>
  );
};

const NewNotify = ({
  _id,
  sender,
  content,
  boost_id,
  createdAt,
  type,
  isRead,
  mutate,
}: NewNotifyProps) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const senderData = sender as IUser | undefined;

  const linkTo =
    type === NOTIFY_TYPE.NEW_ORDER
      ? "/pending-boosts"
      : `/orders/boosts/${boost_id}`;

  const handleClick = async () => {
    try {
      if (!isRead) {
        await notificationService.readNotification(_id);
        mutate();
      }
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      toast.error(errorMessage);
    } finally {
      if (boost_id) {
        navigate(linkTo);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "flex w-full items-center gap-4 rounded-lg p-3 text-sm outline-none transition-colors hover:cursor-pointer hover:bg-accent",
        !isRead ? "bg-primary/5" : "bg-transparent",
      )}
    >
      {/* Icon */}
      <NotificationIcon type={type} sender={senderData} />

      {/* Content */}
      <div className="flex-1 space-y-1 overflow-hidden">
        <p className="truncate leading-snug text-foreground">{content}</p>
        <p className="text-xs text-muted-foreground">
          {createdAt && formatDistanceDate(createdAt, i18n.language)}
        </p>
      </div>
    </div>
  );
};

export default NewNotify;
