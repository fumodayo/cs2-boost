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
import { Link, useLocation } from "react-router-dom";
import getErrorMessage from "~/utils/errorHandler";
import { useTranslation } from "react-i18next";

const MenuNotifications = () => {
  const { t } = useTranslation(["notifications_page", "common"]);
  const location = useLocation();
  const isAdminContext = location.pathname.startsWith("/admin");
  const viewAllLink = isAdminContext
    ? "/admin/all-notifications"
    : "/notification";

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
    const handleNewOrder = (data: { boost_id: string; content: string }) => {
      toast.success(data.content, {
        duration: 5000,
        icon: "📦",
      });
      mutate();
    };

    socket.on("notification:new", handleNewNotification);
    socket.on("notification:updated", handleNotificationUpdated);
    socket.on("order:new", handleNewOrder);

    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.off("notification:updated", handleNotificationUpdated);
      socket.off("order:new", handleNewOrder);
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
      toast.success(t("common:toasts.marked_all_as_read"));
    } catch (e) {
      getErrorMessage(e);
      toast.error(t("common:toasts.mark_all_as_read_failed"));
    }
  };

  if (error) return <div>{t("failed_to_load")}</div>;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <IoNotifications
            size={24}
            className="text-slate-600 dark:text-slate-300"
          />
          {unreadNotifications.length > 0 && (
            <span className="absolute right-2 top-2 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500 dark:border-slate-900"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[380px] border-border p-0 shadow-xl md:w-[400px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-card px-5 py-4">
          <h3 className="text-xl font-bold text-foreground">
            {t("menu.title")}
          </h3>

          {/* Nút Mark all as read giống hình 3 */}
          {unreadNotifications.length > 0 && (
            <div
              onClick={handleMarkAllAsRead}
              className="group flex cursor-pointer items-center gap-1.5 transition-opacity hover:opacity-70"
            >
              <LuCheckCheck className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground">
                {t("mark_all_as_read")}
              </span>
            </div>
          )}
        </div>

        <Separator className="bg-border" />

        <Tabs defaultValue="all" className="w-full flex-1">
          {/* TabsList đã chỉnh sửa ở bước trước (Canh trái + Badge tròn) */}
          <TabsList className="flex w-full items-center justify-start gap-6 border-b border-border bg-card px-5">
            <TabsTrigger
              value="all"
              className="group relative flex items-center justify-center py-4 text-sm font-semibold text-muted-foreground outline-none transition-colors hover:text-foreground data-[state=active]:text-primary"
            >
              {t("tabs.all")}
              <span className="absolute bottom-0 left-0 h-[3px] w-full scale-x-0 rounded-t-full bg-primary transition-transform duration-300 group-data-[state=active]:scale-x-100" />
            </TabsTrigger>

            <TabsTrigger
              value="unread"
              className="group relative flex items-center justify-center py-4 text-sm font-semibold text-muted-foreground outline-none transition-colors hover:text-foreground data-[state=active]:text-primary"
            >
              <div className="flex items-center gap-2">
                {t("tabs.unread")}
                {unreadNotifications.length > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground shadow-sm">
                    {unreadNotifications.length}
                  </span>
                )}
              </div>
              <span className="absolute bottom-0 left-0 h-[3px] w-full scale-x-0 rounded-t-full bg-primary transition-transform duration-300 group-data-[state=active]:scale-x-100" />
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] bg-background">
            <TabsContent value="all" className="m-0 p-3 outline-none">
              {notifications && notifications.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {notifications.map((item) => (
                    <NewNotify key={item._id} {...item} mutate={mutate} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </TabsContent>

            <TabsContent value="unread" className="m-0 p-3 outline-none">
              {unreadNotifications.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {unreadNotifications.map((item) => (
                    <NewNotify key={item._id} {...item} mutate={mutate} />
                  ))}
                </div>
              ) : (
                <EmptyState message={t("empty_state.no_unread")} />
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <Separator className="bg-border" />

        <div className="rounded-b-lg bg-card p-2">
          <Link to={viewAllLink} className="block">
            <Button
              variant="ghost"
              className="h-10 w-full text-sm font-semibold text-primary hover:bg-primary/10 hover:text-primary"
            >
              {t("view_all")}
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const EmptyState = ({ message }: { message?: string }) => {
  const { t } = useTranslation("notifications_page");

  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <LuBellRing className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="max-w-[200px] text-sm font-medium text-muted-foreground">
        {message || t("empty_state.all_caught_up")}
      </p>
    </div>
  );
};

export default MenuNotifications;