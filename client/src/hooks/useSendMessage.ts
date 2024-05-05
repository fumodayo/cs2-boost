import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pushMessages } from "../redux/conversation/conversationSlice";
import { RootState } from "../redux/store";

export const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { messages } = useSelector((state: RootState) => state.conversation);

  const sendMessage = async (conversation_id?: string, message?: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages/send/${conversation_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      const backup = [...messages, data];

      dispatch(pushMessages(backup));
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};
