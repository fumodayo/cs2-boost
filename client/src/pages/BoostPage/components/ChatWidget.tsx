import { FaRegFaceSmile } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { Button, Widget } from "~/components/shared";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { CategoriesConfig } from "emoji-picker-react/dist/config/categoryConfig";
import Conversation from "./Conversation";
import { ICurrentUserProps, IOrderProps } from "~/types";
import { axiosAuth } from "~/axiosAuth";
import { useSocketContext } from "~/hooks/useSocketContext";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";

const ChatWidget = (order: IOrderProps) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { onlineUsers } = useSocketContext();
  const [userChat, setUserChat] = useState<ICurrentUserProps>();
  const receiver_id = order.conversation?.participants.find(
    (id) => id !== currentUser?._id,
  );
  const isOnline = onlineUsers.includes(receiver_id as string);

  useEffect(() => {
    (async () => {
      const { data } = await axiosAuth.get(`/user/get-user/${receiver_id}`);
      setUserChat(data);
    })();
  }, [receiver_id]);

  const toggleOpenEmojiPicker = () => setOpenEmojiPicker((prev) => !prev);

  const handleEmojiClick = (e: EmojiClickData) => {
    setMessage((prevState) => prevState + e.emoji);
  };

  const handleSendMessage = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosAuth.post(
        `/chat/send-message/${order?.conversation?._id}`,
        {
          message,
          boost_id: order.boost_id,
        },
      );
      if (data.success) {
        setMessage("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Widget>
      <div className="flex flex-col space-y-1.5 border-b border-border bg-muted/50 px-4 py-2 text-foreground sm:rounded-t-xl sm:px-2">
        {/* HEADER */}
        <div className="flex min-w-0 flex-shrink-0 flex-grow items-center px-2">
          <div className="relative mr-2.5 block h-8 w-8 shrink-0 rounded-full text-xl sm:h-10 sm:w-10">
            {userChat?.profile_picture && (
              <img
                className="h-full w-full rounded-full object-cover"
                src={userChat.profile_picture}
                alt="logo"
              />
            )}
          </div>
          <div className="pt-1 sm:truncate">
            <h1 className="font-display flex flex-wrap items-center text-sm capitalize text-foreground sm:truncate sm:tracking-tight">
              {userChat?.username}
            </h1>
            <div className="flex items-center space-x-1">
              {isOnline ? (
                <>
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
                  <p className="text-xs sm:truncate">online</p>
                </>
              ) : (
                <>
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-500" />
                  <p className="text-xs sm:truncate">offline</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative max-h-[650px] min-h-[300px] overflow-y-auto">
          {order.conversation && (
            <div className="px-0 pt-0 text-sm sm:px-6">
              <Conversation {...order.conversation} />
            </div>
          )}
          <div className="pt-6">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width="full"
              height="360px"
              open={openEmojiPicker}
              skinTonesDisabled
              categories={
                [
                  {
                    category: "smileys_people",
                    name: "",
                  },
                ] as CategoriesConfig
              }
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col space-y-1.5 border-b border-border bg-muted/50 px-4 py-4 text-foreground sm:rounded-t-xl sm:px-2">
          <div className="flex flex-shrink-0 flex-grow items-center space-x-2 px-2">
            {/* <div className="flex w-full items-center justify-center">Close</div> */}
            <div className="relative w-full">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Say something..."
                className="block w-full rounded-md border-0 bg-field px-5 py-3 text-sm text-field-foreground shadow-sm ring-1 placeholder:text-muted-foreground"
              />
              <div className="absolute right-3 top-1 rounded-full p-2 hover:cursor-pointer hover:bg-secondary-light-hover hover:text-primary">
                {openEmojiPicker ? (
                  <IoClose onClick={toggleOpenEmojiPicker} />
                ) : (
                  <FaRegFaceSmile onClick={toggleOpenEmojiPicker} />
                )}
              </div>
            </div>
            <Button
              disabled={isLoading || message.length <= 0}
              onClick={handleSendMessage}
              variant="transparent"
              className="h-10 w-10 rounded-full text-xl font-medium sm:h-8 sm:w-8"
            >
              <span className="sr-only">Send Message</span>
              <IoMdSend className="flex h-4 w-4 items-center justify-center" />
            </Button>
          </div>
        </div>
      </div>
    </Widget>
  );
};

export default ChatWidget;
