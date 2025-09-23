import {
  Button,
  Helmet,
  NewNotify,
  SegmentedControl,
} from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { INotification } from "~/types";
import { useSocketContext } from "~/hooks/useSocketContext";
import { notificationService } from "~/services/notification.service";
import { LuBellRing, LuCheckCheck } from "react-icons/lu";
import NotificationSkeleton from "~/components/shared/notifications/NotificationSkeleton";

const groupNotificationsByDate = (notifications: INotification[]) => {
  return notifications.reduce(
    (acc, notification) => {
      const date = parseISO(notification.createdAt as unknown as string);
      let groupTitle: string;

      if (isToday(date)) {
        groupTitle = "Today";
      } else if (isYesterday(date)) {
        groupTitle = "Yesterday";
      } else {
        groupTitle = format(date, "MMMM d, yyyy");
      }

      if (!acc[groupTitle]) {
        acc[groupTitle] = [];
      }
      acc[groupTitle].push(notification);
      return acc;
    },
    {} as Record<string, INotification[]>,
  );
};

const NotificationsPage = () => {
  const { socket } = useSocketContext();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const {
    data: notifications,
    error,
    isLoading,
    mutate,
  } = useSWR<INotification[]>(
    "/notifications",
    notificationService.getNotifications,
  );

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => mutate();
    socket.on("notification:new", handleUpdate);
    socket.on("notification:updated", handleUpdate);
    return () => {
      socket.off("notification:new", handleUpdate);
      socket.off("notification:updated", handleUpdate);
    };
  }, [socket, mutate]);

  const filteredNotifications = useMemo(() => {
    if (!notifications) return [];
    if (filter === "unread") {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, filter]);

  const groupedNotifications = useMemo(
    () => groupNotificationsByDate(filteredNotifications),
    [filteredNotifications],
  );
  const notificationGroups = Object.entries(groupedNotifications);

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      mutate();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  return (
    <>
      <Helmet title="Notifications · CS2Boost" />
      <div>
        <Heading
          icon={LuBellRing}
          title="Notifications"
          subtitle="A log of all your account and order-related alerts."
        />
        <main className="mt-8">
          <div className="space-y-6">
            {" "}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SegmentedControl
                options={[
                  { label: "All", value: "all" },
                  { label: "Unread", value: "unread" },
                ]}
                value={filter}
                onChange={setFilter}
              />
              <Button
                onClick={handleMarkAllAsRead}
                disabled={!notifications?.some((n) => !n.isRead)}
                size="sm"
              >
                <LuCheckCheck className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
            </div>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <NotificationSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <p className="text-center text-destructive">
                Failed to load notifications.
              </p>
            ) : notificationGroups.length > 0 ? (
              <div className="space-y-8">
                {notificationGroups.map(([date, items]) => (
                  <div key={date}>
                    <div className="mb-3 flex items-center gap-3">
                      <h3 className="text-sm font-semibold text-foreground">
                        {date}
                      </h3>
                      <div className="h-px flex-1 bg-border"></div>
                    </div>
                    <div className="flex flex-col">
                      {items.map((item) => (
                        <NewNotify key={item._id} {...item} mutate={mutate} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed py-20 text-center">
                <LuBellRing className="h-14 w-14 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold">You're all caught up!</h3>
                <p className="text-muted-foreground">
                  {filter === "unread"
                    ? "No unread notifications."
                    : "There are no notifications yet."}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default NotificationsPage;
