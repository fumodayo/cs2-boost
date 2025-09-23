import { useEffect, useState, useMemo } from "react";
import useSWR from "swr";
import { Helmet, Spinner, ErrorDisplay } from "~/components/shared";
import { BiSupport } from "react-icons/bi";
import toast from "react-hot-toast";
import cn from "~/libs/utils";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { IReport, IConversation } from "~/types";
import { Heading } from "../GameModePage/components";
import { Conversation } from "../BoostPage/components";
import ChatInput from "~/components/shared/ChatInput/ChatInput";
import { useSocketContext } from "~/hooks/useSocketContext";
import { isUserObject } from "~/utils/typeGuards";
import { useTranslation } from "react-i18next";
import { reportService } from "~/services/report.service";
import { useChat } from "~/hooks/useChat";

const SupportTicketItem = ({
  report,
  isActive,
  onClick,
  currentUserId,
}: {
  report: IReport;
  isActive: boolean;
  onClick: () => void;
  currentUserId: string;
}) => {
  const { t } = useTranslation();
  const isSender =
    isUserObject(report.sender) && report.sender._id === currentUserId;
  const receiverUsername = isUserObject(report.receiver)
    ? report.receiver.username
    : t("SupportsPage.aPartner");
  const senderUsername = isUserObject(report.sender)
    ? report.sender.username
    : t("SupportsPage.aUser");

  const title = isSender
    ? t("SupportsPage.TicketItem.myReportTitle", { title: report.title })
    : t("SupportsPage.TicketItem.investigationTitle");
  const subTitle = isSender
    ? t("SupportsPage.TicketItem.myReportSubtitle", {
        username: receiverUsername,
      })
    : t("SupportsPage.TicketItem.investigationSubtitle", {
        username: senderUsername,
      });

  const statusKey = `SupportsPage.TicketItem.status${report.status.replace("_", "")}`;

  return (
    <li
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-lg border border-border p-3 transition-all",
        isActive
          ? "border-primary bg-primary/10"
          : "hover:border-accent hover:bg-muted",
      )}
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold text-foreground">{title}</p>
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-semibold capitalize",
            report.status === "PENDING"
              ? "bg-yellow-500/20 text-yellow-500"
              : report.status === "IN_PROGRESS"
                ? "bg-blue-500/20 text-blue-500"
                : "bg-green-500/20 text-green-500",
          )}
        >
          {t(statusKey, report.status)}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{subTitle}</p>
    </li>
  );
};

const SupportsPage = () => {
  const { t } = useTranslation();
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const { socket } = useSocketContext();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const {
    data: tickets = [],
    error,
    isLoading,
    mutate,
  } = useSWR<IReport[]>(
    currentUser ? "/report/my-reports" : null,
    reportService.getMyReports,
  );

  const activeTicket = useMemo(
    () => tickets.find((t) => t._id === activeTicketId),
    [tickets, activeTicketId],
  );

  const conversationToShow = useMemo(() => {
    if (!activeTicket || !currentUser || !isUserObject(activeTicket.sender))
      return null;
    return activeTicket.sender._id === currentUser._id
      ? activeTicket.conversations.client
      : activeTicket.conversations.partner;
  }, [activeTicket, currentUser]) as IConversation;

  const {
    messages,
    isLoading: isLoadingMessages,
    handleSendMessage,
  } = useChat(conversationToShow?._id, currentUser);

  useEffect(() => {
    if (!activeTicketId && tickets.length > 0) {
      setActiveTicketId(tickets[0]._id);
    }
  }, [tickets, activeTicketId]);

  useEffect(() => {
    if (!socket || !currentUser) return;

    const updateTicketInCache = (updatedReport: IReport) => {
      mutate(
        (currentTickets = []) =>
          currentTickets.map((t) =>
            t._id === updatedReport._id ? updatedReport : t,
          ),
        false,
      );
    };

    const handleSupportStarted = (updatedReport: IReport) => {
      toast.success("An admin has opened a support chat with you!");
      updateTicketInCache(updatedReport);
    };

    socket.on("support_chat_started", handleSupportStarted);
    socket.on("investigation_chat_started", handleSupportStarted);

    return () => {
      socket.off("support_chat_started", handleSupportStarted);
      socket.off("investigation_chat_started", handleSupportStarted);
    };
  }, [socket, currentUser, mutate]);

  const performSendMessage = async (message: string) => {
    if (!conversationToShow._id || !activeTicket?._id) {
      toast.error("Could not send message. Conversation context is missing.");
      return;
    }
    await handleSendMessage({
      message,
    });
  };

  if (error)
    return (
      <ErrorDisplay
        message="Failed to load your support tickets."
        onRetry={mutate}
      />
    );

  return (
    <>
      <Helmet title="My Supports · CS2Boost" />
      <div>
        <Heading
          icon={BiSupport}
          title="My Support Tickets"
          subtitle="Track status and chat with admins about your issues."
        />
        <main className="mt-8 grid h-[calc(100vh-220px)] grid-cols-1 gap-4 px-4 md:grid-cols-3">
          <aside className="col-span-1 flex flex-col overflow-y-auto rounded-xl border border-border bg-background p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              {t("SupportsPage.myTickets")}
            </h2>
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <ul className="space-y-2">
                {tickets.map((ticket) => (
                  <SupportTicketItem
                    key={ticket._id}
                    report={ticket}
                    isActive={activeTicket?._id === ticket._id}
                    onClick={() => setActiveTicketId(ticket._id)}
                    currentUserId={currentUser!._id}
                  />
                ))}
              </ul>
            )}
          </aside>
          <section className="col-span-2 flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm">
            {activeTicket ? (
              <>
                <header className="border-b border-border px-6 py-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    {t("SupportsPage.ticketTitle", {
                      title: activeTicket.title,
                    })}
                  </h2>
                  <p className="text-sm capitalize text-muted-foreground">
                    {t("SupportsPage.statusLabel")}:{" "}
                    {t(
                      `SupportsPage.TicketItem.status${activeTicket.status.replace("_", "")}`,
                      activeTicket.status,
                    )}
                  </p>
                </header>
                <div className="scrollbar-thin flex-1 overflow-y-auto p-4 pr-2">
                  {conversationToShow ? (
                    isLoadingMessages ? (
                      <div className="flex h-full items-center justify-center">
                        <Spinner />
                      </div>
                    ) : (
                      <Conversation messages={messages} />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <p>{t("SupportsPage.pendingReview")}</p>
                    </div>
                  )}
                </div>
                <footer className="border-t border-border bg-muted/50 p-4">
                  {activeTicket.status === "IN_PROGRESS" &&
                  conversationToShow ? (
                    <ChatInput onSendMessage={performSendMessage} />
                  ) : (
                    <div className="text-center text-sm text-muted-foreground">
                      {activeTicket.status === "RESOLVED"
                        ? t("SupportsPage.conversationClosed")
                        : t("SupportsPage.canChatWhenAdminReviews")}
                    </div>
                  )}
                </footer>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                {isLoading ? (
                  <Spinner />
                ) : tickets.length > 0 ? (
                  t("SupportsPage.selectTicket")
                ) : (
                  t("SupportsPage.noTickets")
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default SupportsPage;
