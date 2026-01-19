import { useMemo } from "react";
import useSWR from "swr";
import { useSelector } from "react-redux";
import { Widget, Spinner } from "~/components/ui";
import Conversation from "./Conversation";
import ChatInput from "~/components/ui/ChatInput/ChatInput";
import { IConversation, IOrder } from "~/types";
import { RootState } from "~/redux/store";
import { useSocketContext } from "~/hooks/useSocketContext";
import { useChat } from "~/hooks/useChat";
import { userService } from "~/services/user.service";
import { CONVERSATION_STATUS } from "~/types/constants";
import { useTranslation } from "react-i18next";

const ChatWidget = (order: IOrder) => {
  const { t } = useTranslation("boost_page");
  const { currentUser } = useSelector((state: RootState) => state.user);

  const conversationData = order.conversation as IConversation;

  const receiver_id = useMemo(() => {
    return conversationData?.participants.find((id) => id !== currentUser?._id);
  }, [conversationData, currentUser]) as string;

  const { data: userChat } = useSWR(
    receiver_id ? `/user/${receiver_id}` : null,
    () => userService.getUserById(receiver_id!),
  );

  const {
    messages,
    isLoading: isLoadingMessages,
    handleSendMessage,
  } = useChat(conversationData?._id, currentUser);

  const { onlineUsers } = useSocketContext();
  const isOnline = receiver_id ? onlineUsers.includes(receiver_id) : false;

  const performSendMessage = async (message: string, images?: string[]) => {
    if (!conversationData?._id) return;

    await handleSendMessage({
      message,
      images,
      boost_id: order.boost_id,
    });
  };

  if (!conversationData) {
    return (
      <Widget>
        <div className="flex h-[300px] items-center justify-center p-4 text-center text-muted-foreground">
          {t("chat_widget.no_conversation")}
        </div>
      </Widget>
    );
  }

  return (
    <Widget>
      <div className="flex h-full flex-col">
        {/* HEADER */}
        <div className="flex-shrink-0 border-b border-border bg-muted/50 p-3">
          <div className="flex min-w-0 items-center">
            {userChat ? (
              <>
                <div className="relative mr-3 h-10 w-10 flex-shrink-0">
                  <img
                    className="h-full w-full rounded-full object-cover"
                    src={userChat.profile_picture}
                    alt="avatar"
                  />
                </div>
                <div>
                  <h1 className="font-semibold capitalize text-foreground">
                    {userChat.username}
                  </h1>
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`h-2 w-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-500"}`}
                    />
                    <p className="text-xs text-muted-foreground">
                      {isOnline
                        ? t("chat_widget.status.online")
                        : t("chat_widget.status.offline")}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative max-h-[550px] min-h-[300px] flex-grow overflow-y-auto p-4">
          {isLoadingMessages ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Spinner />
            </div>
          ) : (
            <Conversation messages={messages} />
          )}
        </div>

        {/* FOOTER */}
        <div className="flex-shrink-0 border-t border-border bg-muted/50 p-3">
          {conversationData.status === CONVERSATION_STATUS.OPEN ? (
            <ChatInput onSendMessage={performSendMessage} />
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              {t("chat_widget.closed_conversation")}
            </div>
          )}
        </div>
      </div>
    </Widget>
  );
};

export default ChatWidget;