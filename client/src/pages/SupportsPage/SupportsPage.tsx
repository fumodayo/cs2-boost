import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";
import {
  Helmet,
  Spinner,
  ErrorDisplay,
  Heading,
  Search,
  PlusButton,
} from "~/components/ui";
import { BiSupport } from "react-icons/bi";
import toast from "react-hot-toast";
import cn from "~/libs/utils";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { IReport, IConversation } from "~/types";
import { Conversation } from "../BoostPage/components";
import ChatInput from "~/components/ui/ChatInput/ChatInput";
import { useSocketContext } from "~/hooks/useSocketContext";
import { isUserObject } from "~/utils/typeGuards";
import { useTranslation } from "react-i18next";
import { reportService } from "~/services/report.service";
import { useChat } from "~/hooks/useChat";
import { filterReportTypes, filterReportStatus } from "~/constants/report";
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
  const { t } = useTranslation("supports_page");
  const isSender =
    isUserObject(report.sender) && report.sender._id === currentUserId;
  const receiverUsername = isUserObject(report.receiver)
    ? report.receiver.username
    : t("a_partner");
  const senderUsername = isUserObject(report.sender)
    ? report.sender.username
    : t("a_user");
  const reportType = filterReportTypes.find(
    (type) => type.value === report.title,
  );
  const translatedTitle = reportType
    ? t(`report_types.${reportType.translationKey}`)
    : report.title;
  const title = isSender
    ? t("ticket_item.my_report_title", { title: translatedTitle })
    : t("ticket_item.investigation_title", { title: translatedTitle });
  const subTitle = isSender
    ? t("ticket_item.my_report_subtitle", { username: receiverUsername })
    : t("ticket_item.investigation_subtitle", { username: senderUsername });
  const statusKey = `ticket_item.status_${report.status.toLowerCase().replace("_", "")}`;
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
  const { t } = useTranslation(["supports_page", "common"]);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const { socket } = useSocketContext();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string[]>([]);
  const {
    data: tickets = [],
    error,
    isLoading,
    mutate,
  } = useSWR<IReport[]>(
    currentUser ? "/report/my-reports" : null,
    reportService.getMyReports,
  );
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      if (searchTerm) {
        const senderMatch =
          isUserObject(ticket.sender) &&
          ticket.sender.username
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const receiverMatch =
          isUserObject(ticket.receiver) &&
          ticket.receiver.username
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        if (!senderMatch && !receiverMatch) {
          return false;
        }
      }
      if (filterStatus.length > 0 && !filterStatus.includes(ticket.status)) {
        return false;
      }
      if (filterType.length > 0 && !filterType.includes(ticket.title)) {
        return false;
      }
      return true;
    });
  }, [tickets, searchTerm, filterStatus, filterType]);
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
    const reportIdFromUrl = searchParams.get("report");
    if (reportIdFromUrl && tickets.length > 0) {
      const reportExists = tickets.find((t) => t._id === reportIdFromUrl);
      if (reportExists) {
        setActiveTicketId(reportIdFromUrl);
      }
    } else if (!activeTicketId && tickets.length > 0) {
      setActiveTicketId(tickets[0]._id);
    }
  }, [tickets, searchParams, activeTicketId]);
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
      toast.success(t("common:toasts.support_chat_started"));
      updateTicketInCache(updatedReport);
    };
    const handleReportRejected = (updatedReport: IReport) => {
      updateTicketInCache(updatedReport);
    };
    socket.on("support_chat_started", handleSupportStarted);
    socket.on("investigation_chat_started", handleSupportStarted);
    socket.on("report_rejected", handleReportRejected);
    return () => {
      socket.off("support_chat_started", handleSupportStarted);
      socket.off("investigation_chat_started", handleSupportStarted);
      socket.off("report_rejected", handleReportRejected);
    };
  }, [socket, currentUser, mutate, t]);
  const performSendMessage = async (message: string, images?: string[]) => {
    if (!conversationToShow._id || !activeTicket?._id) {
      toast.error(t("common:toasts.message_send_failed"));
      return;
    }
    await handleSendMessage({
      message,
      images,
      report_id: activeTicket._id,
    });
  };
  if (error)
    return <ErrorDisplay message={t("error_loading")} onRetry={mutate} />;
  return (
    <>
      <Helmet title="supports_page" />
      <div>
        <Heading
          icon={BiSupport}
          title="supports_page_title"
          subtitle="supports_page_subtitle"
        />
        <main className="mt-8 flex flex-col gap-4 px-4 md:grid md:h-[calc(100vh-140px)] md:grid-cols-3 md:overflow-hidden">
          <aside className="flex min-h-[120px] flex-col overflow-y-auto rounded-xl border border-border bg-background p-4 shadow-sm md:col-span-1 md:h-full">
            <h2 className="mb-4 text-base font-semibold text-foreground md:text-lg">
              {t("my_tickets")}
            </h2>
            {/* Search and Filter */}
            <div className="mb-4 space-y-3">
              <Search
                value={searchTerm}
                onChangeValue={setSearchTerm}
                placeholder={t("search_placeholder")}
                className="bg-background/50"
              />
              <div className="flex flex-wrap gap-2">
                <PlusButton
                  name="status"
                  lists={filterReportStatus}
                  selectValues={filterStatus}
                  setSelectValues={setFilterStatus}
                />
                <PlusButton
                  name="type"
                  lists={filterReportTypes}
                  selectValues={filterType}
                  setSelectValues={setFilterType}
                />
              </div>
            </div>
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center py-8">
                <Spinner />
              </div>
            ) : filteredTickets.length > 0 ? (
              <ul className="space-y-2">
                {filteredTickets.map((ticket) => (
                  <SupportTicketItem
                    key={ticket._id}
                    report={ticket}
                    isActive={activeTicket?._id === ticket._id}
                    onClick={() => setActiveTicketId(ticket._id)}
                    currentUserId={currentUser!._id}
                  />
                ))}
              </ul>
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                {t("no_tickets")}
              </p>
            )}
          </aside>
          <section className="flex min-h-[300px] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm md:col-span-2 md:h-full">
            {activeTicket ? (
              <>
                <header className="border-b border-border px-4 py-3 md:px-6 md:py-4">
                  <h2 className="text-base font-semibold text-foreground md:text-lg">
                    {(() => {
                      const isSender =
                        isUserObject(activeTicket.sender) &&
                        activeTicket.sender._id === currentUser!._id;
                      const receiverUsername = isUserObject(
                        activeTicket.receiver,
                      )
                        ? activeTicket.receiver.username
                        : t("a_partner");
                      const senderUsername = isUserObject(activeTicket.sender)
                        ? activeTicket.sender.username
                        : t("a_user");
                      const reportType = filterReportTypes.find(
                        (type) => type.value === activeTicket.title,
                      );
                      const translatedTitle = reportType
                        ? t(`report_types.${reportType.translationKey}`)
                        : activeTicket.title;
                      return isSender
                        ? t("ticket_item.my_report_title", {
                            title: translatedTitle,
                            username: receiverUsername,
                          })
                        : t("ticket_item.investigation_title", {
                            username: senderUsername,
                            title: translatedTitle,
                          });
                    })()}
                  </h2>
                  <p className="text-xs capitalize text-muted-foreground md:text-sm">
                    {t("status_label")}:{" "}
                    {t(
                      `ticket_item.status_${activeTicket.status.toLowerCase()}`,
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
                      <p className="text-sm">{t("pending_review")}</p>
                    </div>
                  )}
                </div>
                <footer className="border-t border-border bg-muted/50 p-3 md:p-4">
                  {activeTicket.status === "IN_PROGRESS" &&
                  conversationToShow ? (
                    <ChatInput onSendMessage={performSendMessage} />
                  ) : (
                    <div className="text-center text-xs text-muted-foreground md:text-sm">
                      {activeTicket.status === "RESOLVED"
                        ? t("conversation_closed")
                        : t("can_chat_when_admin_reviews")}
                    </div>
                  )}
                </footer>
              </>
            ) : (
              <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-muted-foreground">
                {isLoading ? (
                  <Spinner />
                ) : tickets.length > 0 ? (
                  t("select_ticket")
                ) : (
                  t("no_tickets")
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