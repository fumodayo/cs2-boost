import {
  Button,
  Heading,
  Helmet,
  NewNotify,
  SegmentedControl,
} from "~/components/ui";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { INotification } from "~/types";
import { useSocketContext } from "~/hooks/useSocketContext";
import { notificationService } from "~/services/notification.service";
import { LuBellRing, LuCheckCheck } from "react-icons/lu";
import { NotificationSkeleton } from "~/components/ui/Misc";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

const groupNotificationsByDate = (
  notifications: INotification[],
  t: TFunction,
) => {
  return notifications.reduce(
    (acc, notification) => {
      const date = parseISO(notification.createdAt as unknown as string);
      let groupTitle: string;

      if (isToday(date)) {
        groupTitle = t("date_groups.today");
      } else if (isYesterday(date)) {
        groupTitle = t("date_groups.yesterday");
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
  const { t } = useTranslation(["notifications_page", "common"]);

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
    () => groupNotificationsByDate(filteredNotifications, t),
    [filteredNotifications, t],
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
      <Helmet title="notifications_page" />
      <div>
        <Heading
          icon={LuBellRing}
          title="notifications_page_title"
          subtitle="notifications_page_subtitle"
        />
        <main className="mt-8">
          <div className="space-y-6">
            {" "}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SegmentedControl
                options={[
                  { label: t("tabs.all"), value: "all" },
                  { label: t("tabs.unread"), value: "unread" },
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
                {t("mark_all_as_read")}
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
                {t("failed_to_load")}
              </p>
            ) : notificationGroups.length > 0 ? (
              <div className="space-y-8">
                {notificationGroups.map(([date, items]) => (
                  <div key={date}>
                    <div className="mb-4 flex items-center gap-3">
                      <h3 className="text-sm font-semibold text-foreground">
                        {date}
                      </h3>
                      <div className="h-px flex-1 bg-border"></div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                <h3 className="text-xl font-semibold">
                  {t("empty_state.all_caught_up")}
                </h3>
                <p className="text-muted-foreground">
                  {filter === "unread"
                    ? t("empty_state.no_unread")
                    : t("empty_state.no_notifications_yet")}
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