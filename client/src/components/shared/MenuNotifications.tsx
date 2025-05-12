import { IoIosNotificationsOutline } from "react-icons/io";
import { Popover, PopoverContent, PopoverTrigger } from "../@radix-ui/Popover";
import { Button } from "./Button";
import { IoNotifications } from "react-icons/io5";
import { RxRocket } from "react-icons/rx";
import { useEffect, useState } from "react";
import { axiosAuth } from "~/axiosAuth";
import { INotifyProps } from "~/types";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "~/hooks/useSocketContext";
import { formatDistanceDate } from "~/utils";
import { useTranslation } from "react-i18next";

const NewNotify = ({
  sender,
  content,
  _id,
  boost_id,
  createdAt,
  type,
  isRead,
}: INotifyProps) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const handleReadNotify = async () => {
    try {
      await axiosAuth.post(`/notify/${_id}`);
      navigate(0); // Force reload of the page
    } catch (e) {
      console.error(e);
    }
  };

  const linkTo =
    type === "new_order" ? "/pending-boosts" : `/orders/boosts/${boost_id}`;

  return (
    <div
      onClick={() => {
        handleReadNotify();
        navigate(linkTo);
      }}
      className="relative flex w-full gap-x-3 rounded px-2 py-2 text-sm outline-none transition-colors hover:cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
    >
      <div className="relative top-2 h-8 w-8 shrink-0 rounded-full text-sm">
        {type === "message" && sender?.profile_picture && (
          <img
            className="h-full w-full rounded-full object-cover"
            src={sender.profile_picture}
            alt="avatar"
          />
        )}
        {type === "boost" && sender?.profile_picture && (
          <img
            className="h-full w-full rounded-full object-cover"
            src={sender.profile_picture}
            alt="avatar"
          />
        )}
        {type === "new_order" && <RxRocket className="ml-2" size={20} />}
      </div>
      <div className="w-full truncate text-muted-foreground">
        <h1 className="truncate font-bold text-foreground">
          {sender?.username} in order: #{boost_id}
        </h1>
        <p className="truncate font-medium text-foreground">{content}</p>
        <p>{createdAt && formatDistanceDate(createdAt, i18n.language)}</p>
      </div>
      <div className="flex items-center">
        {!isRead && <span className="h-2 w-2 rounded-full bg-green-400" />}
      </div>
    </div>
  );
};

const MenuNotifications = () => {
  const [notify, setNotify] = useState<INotifyProps[]>([]);
  const { socket } = useSocketContext();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosAuth.get("/notify");
        setNotify(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    socket?.on("newNotify", async () => {
      try {
        const { data } = await axiosAuth.get("/notify");
        setNotify(data);
      } catch (e) {
        console.error(e);
      }
    });

    return () => {
      socket?.off("newNotify");
    };
  }, [socket]);

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant="transparent"
          className="h-11 w-11 rounded-full text-sm font-medium"
        >
          <div className="relative block shrink-0 rounded-full text-sm">
            <IoNotifications className="text-foreground/70" size={18} />
            {notify.length > 0 && !notify.some((n) => n.isRead) && (
              <span className="absolute right-0 top-0 block h-1.5 w-1.5 rounded-full bg-danger" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={10}
        alignOffset={10}
        className="max-h-[450px] w-72"
      >
        <div className="flex flex-col gap-y-2">
          <h1 className="text-sm font-bold">Notifications</h1>
          {notify.length > 0 ? (
            notify.map((item, idx) => <NewNotify key={idx} {...item} />)
          ) : (
            <div className="flex min-h-[6rem] flex-col items-center justify-center space-y-1 hover:opacity-85">
              <IoIosNotificationsOutline size={30} />
              <p className="text-sm">Your notifications live here</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MenuNotifications;
