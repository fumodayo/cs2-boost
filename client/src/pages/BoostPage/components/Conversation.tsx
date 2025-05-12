import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { axiosAuth } from "~/axiosAuth";
import { RootState } from "~/redux/store";
import { IConversationProps, IMessageProps } from "~/types";
import { useSocketContext } from "~/hooks/useSocketContext";
import { formatDistanceDate } from "~/utils";
import { useTranslation } from "react-i18next";

const SentMessage = ({ message, updatedAt }: IMessageProps) => {
  const { i18n } = useTranslation();
  return (
    <div className="flex justify-end">
      <div className="my-1 flex gap-x-4 overflow-hidden whitespace-normal rounded-lg bg-primary px-2 font-medium text-primary-foreground">
        <div className="whitespace-pre-wrap p-2 text-sm">{message}</div>
        <span className="flex justify-end pt-4 text-xs text-primary-foreground/75">
          {updatedAt && formatDistanceDate(updatedAt, i18n.language)}
        </span>
      </div>
    </div>
  );
};

const ReceivedMessage = ({ message, updatedAt }: IMessageProps) => {
  const { i18n } = useTranslation();

  return (
    <div className="flex justify-start">
      <div className="my-1 flex gap-x-4 overflow-hidden whitespace-normal rounded-lg border-l-4 border-border/90 bg-background px-4 pl-2 font-medium text-foreground">
        <div className="whitespace-pre-wrap p-2 text-sm">{message}</div>
        <span className="flex justify-end pt-4 text-xs">
          {updatedAt && formatDistanceDate(updatedAt, i18n.language)}
        </span>
      </div>
    </div>
  );
};

const Conversation = (conversation: IConversationProps) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [messages, setMessages] = useState<IMessageProps[]>([]);
  const { socket } = useSocketContext();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosAuth.get(`/chat/${conversation?._id}`);
        setMessages(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [conversation?._id]);

  useEffect(() => {
    socket?.on("newMessage", ({ sender_id, message, updatedAt }) => {
      setMessages((prev) => [
        ...prev,
        { sender: sender_id, message, updatedAt },
      ]);
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [socket]);

  const lastMessageRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  return (
    <>
      {messages.map(({ sender, ...props }: IMessageProps, idx) =>
        sender === currentUser?._id ? (
          <SentMessage key={idx} {...props} />
        ) : (
          <ReceivedMessage key={idx} {...props} />
        ),
      )}
      <div ref={lastMessageRef} />
    </>
  );
};

export default Conversation;
