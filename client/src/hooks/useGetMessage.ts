import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { pushMessages } from "../redux/conversation/conversationSlice";

export const useGetMessages = () => {
  const dispatch = useDispatch();
  const { messages, selectedConversation } = useSelector(
    (state: RootState) => state.conversation,
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${selectedConversation?._id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        dispatch(pushMessages(data));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation) {
      getMessages();
    } else {
      dispatch(pushMessages([]));
    }
  }, [selectedConversation]);

  return { messages, loading };
};
