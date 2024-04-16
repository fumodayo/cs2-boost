import { useContext, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { IoClose, IoSend } from "react-icons/io5";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { AppContext } from "../../context/AppContext";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import clsx from "clsx";
import { ReceivedMessage } from "./ReceivedMessage";
import Messages from "./Messages";
import { useSendMessage } from "../../hooks/useSendMessage";
import { Order } from "../../types";

const introduce = [
  "Hey Sơn Thái! 😄 Thanks for choosing CS2Boost - you've made a great choice. 🚀 ",
  "Once your payment is completed, you'll be able to chat with your booster in here. ",
];

interface ConversationProps {
  order: Order;
}

const Conversation: React.FC<ConversationProps> = ({ order }) => {
  const { theme } = useContext(AppContext);
  const { loading, sendMessage } = useSendMessage();

  const { selectedConversation } = useSelector(
    (state: RootState) => state.conversation,
  );

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmojiClick = (e: EmojiClickData) => {
    setMessage((prevInputValue) => prevInputValue + e.emoji);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!message) return;
    if (selectedConversation) {
      await sendMessage(selectedConversation._id, message);
    }

    console.log("Sending message:", message);
    setMessage("");
  };

  return (
    <div className="-mx-4 border border-border/50 bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl">
      {/* HEADER */}
      <header className="flex flex-col space-y-1.5 border-b border-border bg-muted/50 px-4 py-2 text-foreground sm:rounded-t-xl sm:px-2">
        <div className="flex min-w-0 flex-shrink-0 flex-grow items-center px-2">
          <div className="relative">
            <div className="relative mr-2.5 block h-8 w-8 shrink-0 rounded-full text-xl sm:h-10 sm:w-10">
              <img
                src={order.image}
                alt="logo"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>

          <div className="pt-1 sm:truncate">
            <h1 className="font-display flex flex-wrap items-center text-sm capitalize text-foreground sm:truncate sm:tracking-tight">
              {order.title}
              {order.end_rating && (
                <>
                  ({order.start_rating} → {order.end_rating})
                </>
              )}
              {order.end_exp && (
                <>
                  ({order.start_exp} exp → {order.end_exp} exp)
                </>
              )}
              {order.start_rank && order.end_rank && (
                <>
                  ({order.start_rank.replace("_", " ")} →{" "}
                  {order.end_rank.replace("_", " ")})
                </>
              )}
            </h1>
            <div className="flex items-center space-x-1">
              <p className="text-xs sm:truncate">{order?.user?.username}</p>
              <span
                className={clsx(
                  "bg-green-500",
                  "inline-block h-2.5 w-2.5 rounded-full",
                )}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="scroll-custom relative max-h-[650px] min-h-[270px] overflow-y-auto">
        {/* CONTENT */}
        <div className="px-0 pt-0 text-sm sm:px-6">
          {/* Content messages */}
          {introduce.map((item) => (
            <ReceivedMessage content={item} />
          ))}
          <Messages />
        </div>

        {/* Emoji Picker */}
        <div className="pt-4">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme={theme as Theme}
            width="full"
            height="360px"
            open={showEmojiPicker}
            skinTonesDisabled
          />
        </div>
      </div>

      {/* FOOTER */}
      <footer className="flex flex-col space-y-1.5 border-b border-border bg-muted/50 px-4 py-4 text-foreground sm:rounded-t-xl sm:px-2">
        <form
          className="flex flex-shrink-0 flex-grow items-center space-x-2 px-2"
          onSubmit={handleSubmit}
        >
          <div className="relative w-full">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Say something..."
              className="block w-full rounded-md border-0 bg-field px-5 py-3 text-sm text-field-foreground shadow-sm ring-1 placeholder:text-muted-foreground disabled:pointer-events-none disabled:opacity-50"
            />
            <div className="absolute right-3 top-1 rounded-full p-2 hover:cursor-pointer hover:bg-secondary-light-hover hover:text-primary">
              {showEmojiPicker ? (
                <IoClose
                  className="text-lg"
                  onClick={() => setShowEmojiPicker(false)}
                />
              ) : (
                <BsEmojiSmile
                  className="text-lg"
                  onClick={() => setShowEmojiPicker(true)}
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden whitespace-nowrap rounded-full text-xl font-medium text-secondary-light-foreground outline-none transition-colors hover:bg-secondary-light-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:h-8 sm:w-8"
          >
            <span className="sr-only">Send Message</span>
            <IoSend
              className={`${
                message && "text-primary"
              } flex h-4 w-4 items-center justify-center`}
            />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Conversation;
