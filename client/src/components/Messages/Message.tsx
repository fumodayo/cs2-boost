import { useSelector } from "react-redux";
import { Message as MessageType } from "../../types";
import { RootState } from "../../redux/store";
import { SentMessage } from "./SentMessage";
import { ReceivedMessage } from "./ReceivedMessage";

const Message = ({ message }: { message?: MessageType }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const fromMe = message?.sender_id === currentUser?._id;

  return (
    <>
      {fromMe ? (
        <SentMessage message={message} />
      ) : (
        <ReceivedMessage message={message} />
      )}
    </>
  );
};

export default Message;
