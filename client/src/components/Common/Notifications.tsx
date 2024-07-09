import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSelector } from "react-redux";
import { IoNotifications } from "react-icons/io5";
import { RxRocket } from "react-icons/rx";
import { Notify } from "../../types";
import { RootState } from "../../redux/store";
import { useGetNotifications } from "../../hooks/useGetNotifications";
import { formatDistance } from "date-fns";
import { IoIosNotificationsOutline } from "react-icons/io";
import { axiosAuth } from "../../axiosAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "../Buttons/Button";

const MessageNotify: React.FC<Notify> = ({
  _id,
  sender,
  content,
  createdAt,
  isRead,
  boost_id,
}) => {
  const navigate = useNavigate();
  const handleReadNotification = async (id?: string) => {
    const { data } = await axiosAuth.post(`/notifications/read/${id}`);
    if (data.success === false) {
      return;
    }
    navigate(`/dashboard/boosts/${boost_id}`);
  };

  return (
    <a onClick={() => handleReadNotification(_id)}>
      <DropdownMenu.Item className="relative flex w-full gap-x-3 rounded px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground">
        <div className="relative block h-8 w-8 shrink-0 rounded-full text-sm">
          <img
            src={sender?.profile_picture}
            alt="avatar"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="w-full truncate text-muted-foreground">
          <h1 className="font-bold text-foreground">{sender?.username}</h1>
          <p className="font-medium text-foreground">{content}</p>
          <p>{createdAt && formatDistance(createdAt, new Date())}</p>
        </div>
        <div className="flex items-center">
          {!isRead && <span className="h-2 w-2 rounded-full bg-green-400 " />}
        </div>
      </DropdownMenu.Item>
    </a>
  );
};

const NewBoostNotify: React.FC<Notify> = ({
  _id,
  content,
  createdAt,
  isRead,
}) => {
  const navigate = useNavigate();
  const handleReadNotification = async (id?: string) => {
    const { data } = await axiosAuth.post(`/notifications/read/${id}`);
    if (data.success === false) {
      return;
    }
    navigate(`/dashboard/pending-boosts`);
  };

  return (
    <a onClick={() => handleReadNotification(_id)}>
      <DropdownMenu.Item className="relative flex w-full gap-x-3 rounded px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground">
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm">
          <RxRocket className="text-xl" />
        </div>
        <div className="w-full truncate text-muted-foreground">
          <p className="font-bold text-foreground">{content}</p>
          <p>{createdAt && formatDistance(createdAt, new Date())}</p>
        </div>
        <div className="flex items-center">
          {!isRead && <span className="h-2 w-2 rounded-full bg-green-400 " />}
        </div>
      </DropdownMenu.Item>
    </a>
  );
};

const Notifications = () => {
  useGetNotifications();
  const { notification } = useSelector(
    (state: RootState) => state.notification,
  );

  const notificationDontRead =
    notification.length > 0
      ? notification.filter((item: Notify) => item.isRead === false)
      : [];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button
          color="light"
          className="rounded-md px-2 py-2 text-sm font-medium shadow-sm"
        >
          <div className="relative block shrink-0 rounded-full text-sm">
            <IoNotifications />
            {notification && notificationDontRead.length > 0 && (
              <span className="absolute right-0 top-0 block h-1 w-1 rounded-full bg-danger" />
            )}
          </div>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="left"
          align="end"
          sideOffset={25}
          alignOffset={-25}
          className="scroll-custom backdrop-brightness-5 z-50 max-h-[450px] w-72 min-w-[8rem] cursor-pointer overflow-auto rounded-md border border-border bg-popover/30 p-2 text-popover-foreground shadow-md ring-1 ring-border/10 backdrop-blur-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          <div className="flex flex-col gap-y-2">
            <h1 className="text-sm font-bold">
              Notifications (
              {notificationDontRead.length > 0
                ? notificationDontRead.length
                : 0}
              )
            </h1>
            {notification.length > 0 ? (
              notification.map((item, index) => (
                <div key={index}>
                  {item.type === "message" && <MessageNotify {...item} />}
                  {item.type === "boost" && <NewBoostNotify {...item} />}
                </div>
              ))
            ) : (
              <div className="flex min-h-[6rem] flex-col items-center justify-center space-y-1 hover:opacity-85">
                <IoIosNotificationsOutline size={30} />
                <p className="text-sm">Your notifications live here</p>
              </div>
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Notifications;
