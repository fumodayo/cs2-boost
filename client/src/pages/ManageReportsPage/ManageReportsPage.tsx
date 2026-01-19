import React, { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
  Helmet,
  Search,
  Spinner,
  ErrorDisplay,
  PlusButton,
  DatePicker,
} from "~/components/ui";
import { TbExternalLink, TbMessageReportFilled } from "react-icons/tb";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RootState } from "~/redux/store";
import { InboxItem } from "./components";
import { Conversation } from "../BoostPage/components";
import ChatInput from "~/components/ui/ChatInput/ChatInput";
import { IConversation, IReport } from "~/types";
import { REPORT_STATUS } from "~/types/constants";
import cn from "~/libs/utils";
import getErrorMessage from "~/utils/errorHandler";
import { Button } from "~/components/ui/Button";
import { useSocketContext } from "~/hooks/useSocketContext";
import { isUserObject } from "~/utils/typeGuards";
import { reportService } from "~/services/report.service";
import { useChat } from "~/hooks/useChat";
import { filterReportStatus, filterReportTypes } from "~/constants/report";
import { DateRange } from "react-day-picker";
const REPORTS_KEY = "/report/list";
const RejectDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reason: string;
  setReason: (value: string) => void;
  isLoading: boolean;
  t: (key: string) => string;
}> = ({ isOpen, onClose, onConfirm, reason, setReason, isLoading, t }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-foreground">
          {t("reject_dialog_title")}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("reject_dialog_description")}
        </p>
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-foreground">
            {t("reject_reason_label")}
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("reject_reason_placeholder")}
            className="min-h-[100px] w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {t("cancel_btn")}
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={onConfirm}
            disabled={!reason.trim() || isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : t("confirm_reject_btn")}
          </Button>
        </div>
      </div>
    </div>
  );
};
const ManageReportsPage: React.FC = () => {
  const { t } = useTranslation(["manage_reports_page", "common"]);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"client" | "partner">("client");
  const [searchTerm, setSearchTerm] = useState("");
  const { socket } = useSocketContext();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [searchParams] = useSearchParams();
  const [filterType, setFilterType] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const {
    data: reportsData = [],
    error,
    isLoading,
    mutate,
  } = useSWR<IReport[]>(REPORTS_KEY, () => reportService.getReports());
  const { trigger: triggerAccept, isMutating: isAccepting } = useSWRMutation(
    REPORTS_KEY,
    async (_, { arg: reportId }: { arg: string }) => {
      const updatedReport = await reportService.acceptReport(reportId);
      mutate(
        (currentReports = []) =>
          currentReports.map((r) => (r._id === reportId ? updatedReport : r)),
        false,
      );
      return updatedReport;
    },
  );
  const { trigger: triggerResolve, isMutating: isResolving } = useSWRMutation(
    REPORTS_KEY,
    async (_, { arg: reportId }: { arg: string }) => {
      const updatedReport = await reportService.resolveReport(reportId);
      mutate(
        (currentReports = []) =>
          currentReports.map((r) => (r._id === reportId ? updatedReport : r)),
        false,
      );
      return updatedReport;
    },
  );
  const { trigger: triggerReject, isMutating: isRejecting } = useSWRMutation(
    REPORTS_KEY,
    async (_, { arg }: { arg: { reportId: string; resolution: string } }) => {
      const updatedReport = await reportService.rejectReport(
        arg.reportId,
        arg.resolution,
      );
      mutate(
        (currentReports = []) =>
          currentReports.map((r) =>
            r._id === arg.reportId ? updatedReport : r,
          ),
        false,
      );
      return updatedReport;
    },
  );
  const activeReport = useMemo(
    () => reportsData.find((r) => r._id === activeReportId),
    [reportsData, activeReportId],
  );
  const filteredReports = useMemo(() => {
    return reportsData.filter((r) => {
      if (
        searchTerm &&
        !(
          isUserObject(r.sender) &&
          r.sender.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        return false;
      }
      if (filterType.length > 0 && !filterType.includes(r.title)) {
        return false;
      }
      if (filterStatus.length > 0 && !filterStatus.includes(r.status)) {
        return false;
      }
      if (dateRange?.from || dateRange?.to) {
        const reportDate = new Date(r.createdAt);
        if (dateRange.from && reportDate < dateRange.from) {
          return false;
        }
        if (dateRange.to) {
          const endOfDay = new Date(dateRange.to);
          endOfDay.setHours(23, 59, 59, 999);
          if (reportDate > endOfDay) {
            return false;
          }
        }
      }
      return true;
    });
  }, [reportsData, searchTerm, filterType, filterStatus, dateRange]);
  const currentConversation = activeReport?.conversations[
    activeTab
  ] as IConversation;
  const {
    messages,
    isLoading: isLoadingMessages,
    handleSendMessage,
  } = useChat(currentConversation?._id, currentUser);
  useEffect(() => {
    const reportIdFromUrl = searchParams.get("report");
    if (reportIdFromUrl && reportsData.length > 0) {
      const reportExists = reportsData.some((r) => r._id === reportIdFromUrl);
      if (reportExists) {
        setActiveReportId(reportIdFromUrl);
        return;
      }
    }
    if (!activeReportId && reportsData.length > 0) {
      setActiveReportId(reportsData[0]._id);
    }
  }, [reportsData, activeReportId, searchParams]);
  useEffect(() => {
    if (!socket) return;
    const handleNewReport = (newReport: IReport) => {
      toast.success(
        t("common:toasts.new_report_from", {
          username: isUserObject(newReport.sender)
            ? newReport.sender.username
            : "a user",
        }),
      );
      mutate((currentReports = []) => [newReport, ...currentReports], false);
    };
    socket.on("new_report_submitted", handleNewReport);
    return () => {
      socket.off("new_report_submitted", handleNewReport);
    };
  }, [socket, mutate, t]);
  const handleSelectReport = (report: IReport) => {
    setActiveReportId(report._id);
    setActiveTab("client");
  };
  const handleAcceptReport = async (reportId: string) => {
    try {
      await triggerAccept(reportId);
      toast.success(t("common:toasts.report_accepted"));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };
  const handleResolveReport = async (reportId: string) => {
    if (!window.confirm(t("resolve_confirm"))) return;
    try {
      await triggerResolve(reportId);
      toast.success(t("common:toasts.report_resolved"));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };
  const handleOpenRejectDialog = () => {
    setRejectReason("");
    setIsRejectDialogOpen(true);
  };
  const handleRejectReport = async () => {
    if (!activeReport || !rejectReason.trim()) {
      toast.error(
        t("reject_reason_required", {
          ns: "manage_reports_page",
          defaultValue: "Please provide a rejection reason.",
        }),
      );
      return;
    }
    try {
      await triggerReject({
        reportId: activeReport._id,
        resolution: rejectReason.trim(),
      });
      toast.success(t("common:toasts.report_rejected"));
      setIsRejectDialogOpen(false);
      setRejectReason("");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };
  const performSendMessage = async (message: string, images?: string[]) => {
    if (!currentConversation?._id || !activeReport) {
      toast.error(t("common:toasts.message_send_failed"));
      return;
    }
    await handleSendMessage({
      message,
      images,
      report_id: activeReport._id,
    });
  };
  const isSubmitting = isAccepting || isResolving || isRejecting;
  return (
    <>
      <Helmet title="manage_reports_page" />
      <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden">
        <div className="grid h-full grid-cols-12 overflow-hidden">
          {/* Sidebar */}
          <aside className="col-span-12 flex h-full flex-col overflow-hidden border-r border-border/30 bg-card/80 p-4 lg:col-span-4 xl:col-span-3">
            <div className="mb-4 flex items-center justify-between px-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {t("inbox_title")}
              </h2>
              <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                <span className="flex h-2 w-2">
                  <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                {reportsData.length} {t("new_label")}
              </div>
            </div>
            <div className="mb-4 px-1">
              <Search
                value={searchTerm}
                onChangeValue={setSearchTerm}
                placeholder={t("search_placeholder")}
                className="bg-background/50 backdrop-blur-md"
              />
            </div>
            <div className="mb-4 flex flex-wrap items-center gap-2 px-1">
              <PlusButton
                name="type"
                lists={filterReportTypes}
                selectValues={filterType}
                setSelectValues={setFilterType}
              />
              <PlusButton
                name="status"
                lists={filterReportStatus}
                selectValues={filterStatus}
                setSelectValues={setFilterStatus}
              />
              <DatePicker value={dateRange} onChange={setDateRange} />
            </div>
            <div
              className="min-h-0 flex-1 space-y-3 overflow-y-auto px-1 pb-4 pr-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor:
                  "hsl(var(--muted-foreground) / 0.3) transparent",
              }}
            >
              {isLoading && (
                <div className="py-8 text-center text-muted-foreground">
                  <Spinner size="md" />
                  <p className="mt-2 text-xs">{t("loading_reports")}</p>
                </div>
              )}
              {error && <ErrorDisplay message={t("error_loading")} />}
              {!isLoading && filteredReports.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
                  <TbMessageReportFilled size={32} className="opacity-20" />
                  <p className="text-sm">{t("no_reports_found")}</p>
                </div>
              )}
              {!isLoading &&
                filteredReports.map((report: IReport) => (
                  <InboxItem
                    key={report._id}
                    report={report}
                    isActive={report._id === activeReport?._id}
                    onClick={() => handleSelectReport(report)}
                  />
                ))}
            </div>
          </aside>
          {/* Chat Area */}
          <section className="col-span-12 grid h-full grid-rows-[auto_1fr_auto] overflow-hidden bg-background/40 lg:col-span-8 xl:col-span-9">
            {activeReport &&
            isUserObject(activeReport.sender) &&
            isUserObject(activeReport.receiver) ? (
              <>
                <div className="flex flex-col bg-background/80 backdrop-blur-xl">
                  {/* Header */}
                  <div className="sticky top-0 z-10 flex min-h-[88px] w-full shrink-0 items-center justify-between border-b border-border/40 bg-background/80 px-6 py-4 backdrop-blur-xl">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <img
                          src={activeReport.sender.profile_picture}
                          className="h-14 w-14 rounded-full border-2 border-background object-cover shadow-md ring-2 ring-border/50"
                          alt="Sender avatar"
                        />
                        <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-background bg-green-500 shadow-sm" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold tracking-tight text-foreground">
                            {activeReport.sender.username}
                          </h3>
                          <Link
                            to={`/admin/manage-users/${activeReport.sender._id}`}
                            className="text-muted-foreground/50 transition-colors hover:text-primary"
                            title={t("view_sender_profile")}
                          >
                            <TbExternalLink size={18} />
                          </Link>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
                            {t("reported_label")}
                          </span>
                          <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 px-2.5 py-0.5 pr-1.5 transition-colors hover:border-border hover:bg-muted/80">
                            <span className="text-xs font-semibold text-foreground/90">
                              {activeReport.receiver.username}
                            </span>
                            <Link
                              to={`/admin/manage-users/${activeReport.receiver._id}`}
                              className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm transition-colors hover:text-primary"
                              title={t("view_reported_profile")}
                            >
                              <TbExternalLink size={10} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {activeReport.status === REPORT_STATUS.PENDING && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleOpenRejectDialog}
                            disabled={isSubmitting}
                            className="border-destructive/50 text-destructive transition-all hover:scale-105 hover:bg-destructive/10"
                          >
                            {t("reject_btn")}
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleAcceptReport(activeReport._id)}
                            disabled={isSubmitting}
                            className="shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40"
                          >
                            {isAccepting ? (
                              <Spinner size="sm" />
                            ) : (
                              t("accept_btn")
                            )}
                          </Button>
                        </>
                      )}
                      {activeReport.status === REPORT_STATUS.IN_PROGRESS && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleResolveReport(activeReport._id)}
                          disabled={isSubmitting}
                          className="shadow-lg shadow-destructive/20 transition-all hover:scale-105 hover:shadow-destructive/40"
                        >
                          {isResolving ? (
                            <Spinner size="sm" />
                          ) : (
                            t("resolve_btn")
                          )}
                        </Button>
                      )}
                      {activeReport.status === REPORT_STATUS.RESOLVED && (
                        <div className="flex items-center gap-2 rounded-md bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-500">
                          <span className="h-2 w-2 rounded-full bg-green-500"></span>
                          {t("resolved_status")}
                        </div>
                      )}
                      {activeReport.status === REPORT_STATUS.REJECT && (
                        <div className="flex items-center gap-2 rounded-md bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-500">
                          <span className="h-2 w-2 rounded-full bg-red-500"></span>
                          {t("rejected_status")}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Tabs / Segmented Control */}
                  {activeReport.status !== REPORT_STATUS.PENDING && (
                    <div className="w-full shrink-0 border-b border-border/50 bg-card/30 px-6 py-2">
                      <div className="flex w-fit items-center rounded-lg bg-muted p-1">
                        <button
                          onClick={() => setActiveTab("client")}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-all",
                            activeTab === "client"
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {t("chat_with_client")}
                        </button>
                        <div className="mx-1 h-4 w-px bg-border/50"></div>
                        <button
                          onClick={() => setActiveTab("partner")}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-all",
                            activeTab === "partner"
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {t("chat_with_partner")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* Main Content */}
                <div
                  className="flex min-h-0 flex-col overflow-y-auto bg-gradient-to-b from-transparent to-background/50 px-6 py-6 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor:
                      "hsl(var(--muted-foreground) / 0.3) transparent",
                  }}
                >
                  {activeReport.status === REPORT_STATUS.PENDING ? (
                    <div className="mx-auto mt-10 max-w-2xl text-center">
                      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <TbMessageReportFilled
                          size={32}
                          className="text-primary"
                        />
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight text-foreground">
                        {activeReport.title}
                      </h3>
                      <div className="mt-6 rounded-xl border border-border bg-card p-6 text-left shadow-sm">
                        <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          {t("description_label")}
                        </h4>
                        <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
                          {activeReport.description || t("no_description")}
                        </p>
                      </div>
                    </div>
                  ) : isLoadingMessages ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                      <Spinner size="lg" />
                      <p>{t("loading_conversation")}</p>
                    </div>
                  ) : currentConversation ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-center pb-4">
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium",
                            activeReport.status === REPORT_STATUS.RESOLVED
                              ? "bg-destructive/10 text-destructive"
                              : "bg-muted/50 text-muted-foreground",
                          )}
                        >
                          {activeReport.status === REPORT_STATUS.RESOLVED
                            ? t("ticket_resolved")
                            : t("start_of_conversation")}
                        </span>
                      </div>
                      <Conversation messages={messages} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground opacity-60">
                      <TbMessageReportFilled size={48} className="mb-2" />
                      {t("conversation_not_available")}
                    </div>
                  )}
                </div>
                <footer className="z-20 min-h-[80px] w-full border-t border-border bg-background p-4">
                  {(() => {
                    switch (activeReport.status) {
                      case REPORT_STATUS.RESOLVED:
                        return (
                          <div className="flex w-full items-center justify-center rounded-lg border border-border/50 bg-muted/20 py-3 text-sm font-medium text-muted-foreground">
                            {t("resolved_message")}
                          </div>
                        );
                      case REPORT_STATUS.PENDING:
                        return (
                          <div className="flex w-full items-center justify-center py-2 text-sm text-muted-foreground">
                            {t("pending_message")}
                          </div>
                        );
                      case REPORT_STATUS.IN_PROGRESS:
                        return (
                          <div className="w-full">
                            <ChatInput onSendMessage={performSendMessage} />
                          </div>
                        );
                      case REPORT_STATUS.REJECT:
                        return (
                          <div className="flex w-full items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 py-3 text-sm font-medium text-destructive">
                            {t("rejected_message")}
                          </div>
                        );
                      default:
                        return (
                          <div className="flex w-full items-center justify-center py-2 text-sm font-bold text-red-500">
                            {t("status_mismatch")} {String(activeReport.status)}
                          </div>
                        );
                    }
                  })()}
                </footer>
              </>
            ) : (
              <div className="col-span-full row-span-full flex h-full flex-col items-center justify-center gap-4 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted/30">
                  <TbMessageReportFilled
                    size={48}
                    className="text-muted-foreground/50"
                  />
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="text-xl font-bold text-foreground">
                    {t("select_report")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("select_report_description")}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
      {/* Reject Dialog */}
      <RejectDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onConfirm={handleRejectReport}
        reason={rejectReason}
        setReason={setRejectReason}
        isLoading={isRejecting}
        t={t}
      />
    </>
  );
};
export default ManageReportsPage;