import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { pushMessages } from "../redux/conversation/conversationSlice";
import { axiosInstance } from "../axiosAuth";

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
        const { data } = await axiosInstance.get(
          `/messages/${selectedConversation?._id}`,
        );
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
