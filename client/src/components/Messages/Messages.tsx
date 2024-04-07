import { useEffect, useRef } from "react";
import { useGetMessages } from "../../hooks/useGetMessage";
import Message from "./Message";

const Messages = () => {
  const { messages, loading } = useGetMessages();

  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);


  return (
    <div>
      {!loading &&
        messages &&
        messages.map((message, index) => (
          <div
            key={message._id}
            ref={index === messages.length - 1 ? lastMessageRef : undefined}
          >
            <Message message={message} />
          </div>
        ))}
    </div>
  );
};

export default Messages;
