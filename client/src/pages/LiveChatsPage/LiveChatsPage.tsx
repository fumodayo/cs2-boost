import { useState, useEffect, useRef, useLayoutEffect } from "react";
import useSWR from "swr";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { Helmet, Spinner, Heading } from "~/components/ui";
import {
  IoChatbubblesOutline,
  IoCheckmarkCircle,
  IoClose,
} from "react-icons/io5";
import { ILiveChat, IMessage, IConversation, IUser } from "~/types";
import { liveChatService } from "~/services/liveChat.service";
import { useSocketContext } from "~/hooks/useSocketContext";
import { isUserObject } from "~/utils/typeGuards";
import { LIVE_CHAT_STATUS } from "~/types/constants";
import { Button } from "~/components/ui/Button";
import ChatInput from "~/components/ui/ChatInput/ChatInput";
import { Conversation } from "~/pages/BoostPage/components";
import cn from "~/libs/utils";
import toast from "react-hot-toast";
const LiveChatItem = ({
  chat,
  isActive,
  onClick,
}: {
  chat: ILiveChat;
  isActive: boolean;
  onClick: () => void;
}) => {
  const { t } = useTranslation("admin_live_chats");
  const user = isUserObject(chat.user) ? (chat.user as IUser) : null;
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
        <div className="flex items-center gap-2">
          {user ? (
            <img
              src={user.profile_picture}
              alt={user.username}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="text-xs font-bold">G</span>
            </div>
          )}
          <div>
            <p className="font-semibold text-foreground">
              {user?.username || chat.guestEmail || t("unknown_user")}
            </p>
            <p className="text-xs text-muted-foreground">{chat.subject}</p>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-semibold",
            chat.status === LIVE_CHAT_STATUS.WAITING
              ? "bg-yellow-500/20 text-yellow-500"
              : "bg-green-500/20 text-green-500",
          )}
        >
          {t(`status.${chat.status.toLowerCase()}`)}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {new Date(chat.createdAt).toLocaleString()}
      </p>
    </li>
  );
};
const LiveChatsPage = () => {
  const { t } = useTranslation("admin_live_chats");
  const { socket } = useSocketContext();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [activeChat, setActiveChat] = useState<ILiveChat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    data: liveChats = [],
    isLoading,
    mutate,
  } = useSWR<ILiveChat[]>("/live-chat/admin", liveChatService.getAllLiveChats, {
    revalidateOnFocus: true,
  });
  useEffect(() => {
    if (!socket) return;
    const handleNewChat = (chat: ILiveChat) => {
      mutate((prev = []) => [chat, ...prev], false);
      toast.success(t("new_chat_notification"));
    };
    const handleChatUpdated = (updatedChat: ILiveChat) => {
      mutate(
        (prev = []) =>
          prev.map((c) => (c._id === updatedChat._id ? updatedChat : c)),
        false,
      );
      if (activeChat?._id === updatedChat._id) {
        setActiveChat(updatedChat);
      }
    };
    const handleNewMessage = ({
      liveChatId,
      message,
    }: {
      liveChatId: string;
      message: IMessage;
    }) => {
      if (activeChat?._id === liveChatId) {
        setActiveChat((prev) => {
          if (!prev) return prev;
          const conv = prev.conversation as IConversation;
          const existingMessages = (conv?.messages as IMessage[]) || [];
          if (existingMessages.some((m) => m._id === message._id)) {
            return prev;
          }
          return {
            ...prev,
            conversation: {
              ...conv,
              messages: [...existingMessages, message],
            },
          };
        });
      }
    };
    const handleChatClosed = ({ id }: { id: string }) => {
      mutate((prev = []) => prev.filter((c) => c._id !== id), false);
      if (activeChat?._id === id) {
        setActiveChat(null);
      }
    };
    socket.on("newLiveChat", handleNewChat);
    socket.on("liveChatUpdated", handleChatUpdated);
    socket.on("liveChatMessage", handleNewMessage);
    socket.on("liveChatClosed", handleChatClosed);
    return () => {
      socket.off("newLiveChat", handleNewChat);
      socket.off("liveChatUpdated", handleChatUpdated);
      socket.off("liveChatMessage", handleNewMessage);
      socket.off("liveChatClosed", handleChatClosed);
    };
  }, [socket, activeChat, mutate, t]);
  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat]);
  const handleAssign = async () => {
    if (!activeChat) return;
    try {
      const updated = await liveChatService.assignLiveChat(activeChat._id);
      setActiveChat(updated);
      mutate();
      toast.success(t("assigned_success"));
    } catch {
      toast.error(t("assign_failed"));
    }
  };
  const handleClose = async () => {
    if (!activeChat) return;
    try {
      await liveChatService.closeLiveChat(activeChat._id);
      setActiveChat(null);
      mutate();
      toast.success(t("closed_success"));
    } catch {
      toast.error(t("close_failed"));
    }
  };
  const handleSendMessage = async (message: string) => {
    if (!activeChat || !message.trim()) return;
    try {
      const newMessage = await liveChatService.sendLiveChatMessage(
        activeChat._id,
        message.trim(),
      );
      setActiveChat((prev) => {
        if (!prev) return prev;
        const conv = prev.conversation as IConversation;
        return {
          ...prev,
          conversation: {
            ...conv,
            messages: [...((conv?.messages as IMessage[]) || []), newMessage],
          },
        };
      });
    } catch {
      toast.error(t("send_failed"));
    }
  };
  const conversation = activeChat?.conversation as IConversation | undefined;
  const messages = (conversation?.messages as IMessage[]) || [];
  const isAssignedToMe = activeChat?.admin
    ? isUserObject(activeChat.admin)
      ? (activeChat.admin as IUser)._id === currentUser?._id
      : activeChat.admin === currentUser?._id
    : false;
  return (
    <>
      <Helmet title="admin_live_chats" />
      <div>
        <Heading
          icon={IoChatbubblesOutline}
          title="admin_live_chats_title"
          subtitle="admin_live_chats_subtitle"
        />
        <main className="mt-8 flex flex-col gap-4 px-4 md:grid md:h-[calc(100vh-220px)] md:grid-cols-3">
          {/* Chat list */}
          <aside className="flex min-h-[120px] flex-col overflow-y-auto rounded-xl border border-border bg-background p-4 shadow-sm md:col-span-1 md:h-full">
            <h2 className="mb-4 text-base font-semibold text-foreground md:text-lg">
              {t("active_chats")} ({liveChats.length})
            </h2>
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center py-8">
                <Spinner />
              </div>
            ) : liveChats.length > 0 ? (
              <ul className="space-y-2">
                {liveChats.map((chat) => (
                  <LiveChatItem
                    key={chat._id}
                    chat={chat}
                    isActive={activeChat?._id === chat._id}
                    onClick={() => setActiveChat(chat)}
                  />
                ))}
              </ul>
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                {t("no_chats")}
              </p>
            )}
          </aside>
          {/* Chat panel */}
          <section className="flex min-h-[300px] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm md:col-span-2 md:h-full">
            {activeChat ? (
              <>
                {/* Header */}
                <header className="flex items-center justify-between border-b border-border px-4 py-3 md:px-6 md:py-4">
                  <div>
                    <h2 className="text-base font-semibold text-foreground md:text-lg">
                      {activeChat.subject}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {isUserObject(activeChat.user)
                        ? (activeChat.user as IUser).username
                        : activeChat.guestEmail || t("unknown_user")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {activeChat.status === LIVE_CHAT_STATUS.WAITING && (
                      <Button
                        onClick={handleAssign}
                        size="sm"
                        variant="primary"
                      >
                        <IoCheckmarkCircle className="mr-1.5" />
                        {t("assign_to_me")}
                      </Button>
                    )}
                    {isAssignedToMe && (
                      <Button onClick={handleClose} size="sm" variant="danger">
                        <IoClose className="mr-1.5" />
                        {t("close")}
                      </Button>
                    )}
                  </div>
                </header>
                {/* Messages */}
                <div
                  ref={scrollRef}
                  className="scrollbar-thin flex-1 overflow-y-auto p-4 pr-2"
                >
                  <Conversation messages={messages} />
                </div>
                {/* Input */}
                <footer className="border-t border-border bg-muted/50 p-3 md:p-4">
                  {isAssignedToMe ? (
                    <ChatInput onSendMessage={handleSendMessage} />
                  ) : (
                    <div className="text-center text-sm text-muted-foreground">
                      {activeChat.status === LIVE_CHAT_STATUS.WAITING
                        ? t("assign_to_chat")
                        : t("not_your_chat")}
                    </div>
                  )}
                </footer>
              </>
            ) : (
              <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-muted-foreground">
                {isLoading ? <Spinner /> : t("select_chat")}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};
export default LiveChatsPage;