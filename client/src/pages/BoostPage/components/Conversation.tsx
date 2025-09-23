import { useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { formatDistanceToNow } from "date-fns";
import { IMessage } from "~/types"; 
import { isUserObject } from "~/utils/typeGuards";
import { Spinner } from "~/components/shared";

const SentMessage = ({
  message,
  updatedAt,
}: {
  message: string;
  updatedAt: string;
}) => (
  <div className="flex justify-end">
    <div className="my-1 flex max-w-lg flex-col rounded-lg bg-primary px-3 py-2 text-primary-foreground">
      <p className="whitespace-pre-wrap text-sm">{message}</p>
      <span className="self-end pt-1 text-[10px] text-primary-foreground/75">
        {formatDistanceToNow(updatedAt, { addSuffix: true })}
      </span>
    </div>
  </div>
);

const ReceivedMessage = ({
  message,
  updatedAt,
}: {
  message: string;
  updatedAt: string;
}) => (
  <div className="flex justify-start">
    <div className="my-1 flex max-w-lg flex-col rounded-lg bg-muted px-3 py-2 text-foreground">
      <p className="whitespace-pre-wrap text-sm">{message}</p>
      <span className="self-end pt-1 text-[10px] text-muted-foreground/75">
        {formatDistanceToNow(updatedAt, { addSuffix: true })}
      </span>
    </div>
  </div>
);

const Conversation = ({ messages }: { messages: IMessage[] }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const scrollAnchorRef = useRef<null | HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  if (!currentUser) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col space-y-2">
      {messages.map((msg: IMessage) => {
        const senderId = isUserObject(msg.sender) ? msg.sender._id : msg.sender;
        const isSentByMe = String(senderId) === String(currentUser._id);

        return isSentByMe ? (
          <SentMessage key={msg._id} {...msg} />
        ) : (
          <ReceivedMessage key={msg._id} {...msg} />
        );
      })}
      <div ref={scrollAnchorRef} />
    </div>
  );
};

export default Conversation;
