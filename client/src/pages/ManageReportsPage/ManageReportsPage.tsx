import React, { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
  Helmet,
  Search,
  Chip,
  Spinner,
  ErrorDisplay,
} from "~/components/shared";
import { TbMessageReportFilled } from "react-icons/tb";
import toast from "react-hot-toast";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RootState } from "~/redux/store";
import { Heading } from "../GameModePage/components";
import { InboxItem } from "./components";
import { Conversation } from "../BoostPage/components";
import ChatInput from "~/components/shared/ChatInput/ChatInput";
import { IConversation, IReport } from "~/types";
import { REPORT_STATUS } from "~/types/constants";
import cn from "~/libs/utils";
import getErrorMessage from "~/utils/errorHandler";
import { Button } from "~/components/shared/Button";
import { useSocketContext } from "~/hooks/useSocketContext";
import { isUserObject } from "~/utils/typeGuards";
import { reportService } from "~/services/report.service";
import { useChat } from "~/hooks/useChat";

const REPORTS_KEY = "/report/list";

const TabButton = ({
  isActive,
  children,
  onClick,
}: {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <Button
    size="sm"
    onClick={onClick}
    variant="ghost"
    className={cn(
      "rounded-none border-b-2 px-4 py-2 text-sm font-medium transition-colors",
      isActive
        ? "border-primary text-primary"
        : "border-transparent text-muted-foreground hover:text-foreground",
    )}
  >
    {children}
  </Button>
);

const ManageReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"client" | "partner">("client");
  const [searchTerm, setSearchTerm] = useState("");
  const { socket } = useSocketContext();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const {
    data: reportsData = [],
    error,
    isLoading,
    mutate,
  } = useSWR<IReport[]>(REPORTS_KEY, reportService.getReports);

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

  const activeReport = useMemo(
    () => reportsData.find((r) => r._id === activeReportId),
    [reportsData, activeReportId],
  );
  const filteredReports = useMemo(
    () =>
      reportsData.filter(
        (r) =>
          isUserObject(r.sender) &&
          r.sender.username.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [reportsData, searchTerm],
  );
  const currentConversation = activeReport?.conversations[
    activeTab
  ] as IConversation;

  const {
    messages,
    isLoading: isLoadingMessages,
    handleSendMessage,
  } = useChat(currentConversation?._id, currentUser);

  useEffect(() => {
    if (!activeReportId && reportsData.length > 0) {
      setActiveReportId(reportsData[0]._id);
    }
  }, [reportsData, activeReportId]);

  useEffect(() => {
    if (!socket) return;
    const handleNewReport = (newReport: IReport) => {
      toast.success(
        `New report from ${isUserObject(newReport.sender) ? newReport.sender.username : "a user"}`,
      );
      mutate((currentReports = []) => [newReport, ...currentReports], false);
    };

    socket.on("new_report_submitted", handleNewReport);
    return () => {
      socket.off("new_report_submitted", handleNewReport);
    };
  }, [socket, mutate]);

  const handleSelectReport = (report: IReport) => {
    setActiveReportId(report._id);
    setActiveTab("client");
  };

  const handleAcceptReport = async (reportId: string) => {
    try {
      await triggerAccept(reportId);
      toast.success("Report accepted! Conversations are now open.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleResolveReport = async (reportId: string) => {
    if (!window.confirm("Are you sure you want to close this report?")) return;
    try {
      await triggerResolve(reportId);
      toast.success("Report has been resolved.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const performSendMessage = async (message: string) => {
    console.log({ currentConversation, activeReport });
    if (!currentConversation?._id || !activeReport) {
      toast.error("Cannot send message: Missing context.");
      return;
    }
    await handleSendMessage({
      message,
    });
  };

  const isSubmitting = isAccepting || isResolving;

  return (
    <>
      <Helmet title="Manage Reports · CS2Boost" />
      <div>
        <Heading
          icon={TbMessageReportFilled}
          title="Manage User Reports"
          subtitle="Handle reports and mediate conversations."
        />
        <main className="mt-6">
          <div className="flex h-[calc(100vh-200px)] w-full gap-6 rounded-xl border border-border bg-card p-2 shadow-sm">
            <aside className="flex w-full max-w-sm flex-col gap-y-4 p-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">
                  {t("ManageReportsPage.inboxTitle")}
                </h2>
                <Chip>
                  {
                    reportsData.filter(
                      (r) => r.status === REPORT_STATUS.PENDING,
                    ).length
                  }{" "}
                  {t("ManageReportsPage.newLabel")}
                </Chip>
              </div>
              <Search value={searchTerm} onChangeValue={setSearchTerm} />
              <div className="scrollbar-thin flex-1 space-y-2 overflow-y-auto pr-2">
                {isLoading && (
                  <div className="p-4 text-center">
                    <Spinner />
                  </div>
                )}
                {error && <ErrorDisplay message="Error loading reports." />}
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

            <div className="h-full w-px bg-border" />

            <section className="flex flex-1 flex-col overflow-hidden p-2">
              {activeReport &&
              isUserObject(activeReport.sender) &&
              isUserObject(activeReport.receiver) ? (
                <>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={activeReport.sender.profile_picture}
                        className="h-10 w-10 rounded-full object-cover"
                        alt="Sender avatar"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-foreground">
                            {activeReport.sender.username}
                          </p>
                          <Link
                            to={`/admin/manage-users/${activeReport.sender._id}`}
                          >
                            <FaExternalLinkAlt
                              className="secondary"
                              size={12}
                            />
                          </Link>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <span>
                            {t("ManageReportsPage.reportedLabel")}:{" "}
                            {activeReport.receiver.username}
                          </span>
                          <Link
                            to={`/admin/manage-users/${activeReport.receiver._id}`}
                          >
                            <FaExternalLinkAlt
                              className="secondary"
                              size={12}
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {activeReport.status === REPORT_STATUS.PENDING && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleAcceptReport(activeReport._id)}
                          disabled={isSubmitting}
                        >
                          {isAccepting ? (
                            <Spinner size="sm" />
                          ) : (
                            t("ManageReportsPage.acceptBtn")
                          )}
                        </Button>
                      )}
                      {activeReport.status === REPORT_STATUS.IN_PROGRESS && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleResolveReport(activeReport._id)}
                          disabled={isSubmitting}
                        >
                          {isResolving ? (
                            <Spinner size="sm" />
                          ) : (
                            t("ManageReportsPage.resolveBtn")
                          )}
                        </Button>
                      )}
                      {activeReport.status === REPORT_STATUS.RESOLVED && (
                        <Chip>{t("ManageReportsPage.resolvedStatus")}</Chip>
                      )}
                    </div>
                  </div>

                  {activeReport.status !== REPORT_STATUS.PENDING && (
                    <div className="flex border-b border-border">
                      <TabButton
                        isActive={activeTab === "client"}
                        onClick={() => setActiveTab("client")}
                      >
                        {t("ManageReportsPage.chatWithClientTab", {
                          username: activeReport.sender.username,
                        })}
                      </TabButton>
                      <TabButton
                        isActive={activeTab === "partner"}
                        onClick={() => setActiveTab("partner")}
                      >
                        {t("ManageReportsPage.chatWithPartnerTab", {
                          username: activeReport.receiver.username,
                        })}
                      </TabButton>
                    </div>
                  )}

                  <div className="scrollbar-thin flex-1 overflow-y-auto py-4 pr-2">
                    {activeReport.status === REPORT_STATUS.PENDING ? (
                      <div className="p-4 text-sm">
                        <h3 className="text-lg font-bold">
                          {activeReport.title}
                        </h3>
                        <p className="mt-4 whitespace-pre-wrap">
                          {activeReport.description ||
                            t("ManageReportsPage.noDescription")}
                        </p>
                      </div>
                    ) : isLoadingMessages ? (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <Spinner />
                      </div>
                    ) : currentConversation ? (
                      <Conversation messages={messages} />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        {t("ManageReportsPage.conversationNotAvailable")}
                      </div>
                    )}
                  </div>

                  {activeReport.status === REPORT_STATUS.IN_PROGRESS &&
                    currentConversation && (
                      <footer className="mt-auto border-t border-border pt-3">
                        <ChatInput onSendMessage={performSendMessage} />
                      </footer>
                    )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <p>{t("ManageReportsPage.selectReport")}</p>
                  )}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default ManageReportsPage;
