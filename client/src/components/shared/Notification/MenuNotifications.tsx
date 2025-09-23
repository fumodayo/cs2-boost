import { IoNotifications } from "react-icons/io5";
import { useEffect, useMemo } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";

import { useSocketContext } from "~/hooks/useSocketContext";
import { notificationService } from "~/services/notification.service";
import { INotification } from "~/types";

import { Button } from "../Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../@radix-ui/Popover";
import NewNotify from "./NewNotify";
import { LuBellRing, LuCheckCheck } from "react-icons/lu";
import { Separator } from "@radix-ui/react-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { ScrollArea } from "~/components/@radix-ui/ScrollArea";
import { Link } from "react-router-dom";
import getErrorMessage from "~/utils/errorHandler";

const MenuNotifications = () => {
  const { socket } = useSocketContext();
  const {
    data: notifications,
    error,
    mutate,
  } = useSWR<INotification[]>("/notify", notificationService.getNotifications);

  useEffect(() => {
    if (!socket) return;
    const handleNewNotification = () => mutate();
    const handleNotificationUpdated = () => mutate();

    socket.on("notification:new", handleNewNotification);
    socket.on("notification:updated", handleNotificationUpdated);

    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.off("notification:updated", handleNotificationUpdated);
    };
  }, [socket, mutate]);

  const unreadNotifications = useMemo(() => {
    return notifications?.filter((n) => !n.isRead) || [];
  }, [notifications]);

  const handleMarkAllAsRead = async () => {
    if (unreadNotifications.length === 0) return;
    try {
      await notificationService.markAllAsRead();
      mutate();
      toast.success("Marked all as read!");
    } catch (e) {
      getErrorMessage(e);
      toast.error("Failed to mark all as read.");
    }
  };

  if (error) return <div>Failed to load.</div>;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <IoNotifications size={20} />
          {unreadNotifications.length > 0 && (
            <span className="absolute right-2 top-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0 md:w-96">
        {/* === HEADER === */}
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="text-lg font-semibold">Notifications</h3>
          {unreadNotifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={handleMarkAllAsRead}
            >
              <LuCheckCheck className="mr-1 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />

        {/* === TABS & CONTENT === */}
        <Tabs defaultValue="all" className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadNotifications.length})
            </TabsTrigger>
          </TabsList>

          {/* === SCROLLABLE CONTENT AREA === */}
          <ScrollArea className="h-80">
            <TabsContent value="all" className="p-2">
              {notifications && notifications.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {notifications.map((item) => (
                    <NewNotify key={item._id} {...item} mutate={mutate} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </TabsContent>

            <TabsContent value="unread" className="p-2">
              {unreadNotifications.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {unreadNotifications.map((item) => (
                    <NewNotify key={item._id} {...item} mutate={mutate} />
                  ))}
                </div>
              ) : (
                <EmptyState message="No unread notifications." />
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <Separator />
        {/* === FOOTER === */}
        <Link to="/notification" className="p-2 text-center">
          <Button variant="link" size="sm" className="w-full">
            View all notifications
          </Button>
        </Link>
      </PopoverContent>
    </Popover>
  );
};

const EmptyState = ({ message = "You're all caught up!" }) => (
  <div className="flex flex-col items-center justify-center space-y-2 py-16 text-center">
    <LuBellRing className="h-12 w-12 text-muted-foreground/50" />
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

export default MenuNotifications;
