import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pushMessages } from "../redux/conversation/conversationSlice";
import { RootState } from "../redux/store";

export const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { messages } = useSelector((state: RootState) => state.conversation);

  const sendMessage = async (
    conversation_id?: string,
    message?: string,
    boost_id?: string,
  ) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/messages/send/${conversation_id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message, boost_id }),
        },
      );
      const data = await res.json();
      const backup = [...messages, data];

      dispatch(pushMessages(backup));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};
