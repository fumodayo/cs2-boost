import { useDispatch, useSelector } from "react-redux";
import { useSocketContext } from "../context/SocketContext";
import { RootState } from "../redux/store";
import { useEffect } from "react";
import { pushMessages } from "../redux/conversation/conversationSlice";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const dispatch = useDispatch();

  const { messages } = useSelector((state: RootState) => state.conversation);

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      dispatch(pushMessages([...messages, newMessage]));
    });
  });
  return () => socket?.off("newMessage");
};

export default useListenMessages;
