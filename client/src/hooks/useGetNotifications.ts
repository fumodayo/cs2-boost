import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  updateNotifyFailure,
  updateNotifyStart,
  updateNotifySuccess,
} from "../redux/notification/notificationSlice";
import { useSocketContext } from "../context/SocketContext";

export const useGetNotifications = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { socket } = useSocketContext();

  const fetchData = async () => {
    dispatch(updateNotifyStart());
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/notifications/${currentUser?._id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await res.json();
      dispatch(updateNotifySuccess(data));
    } catch (error) {
      dispatch(updateNotifyFailure("Error fetching notifications"));
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser?._id]);

  useEffect(() => {
    socket?.on("newNotification", () => {
      fetchData();
    });
  });
  return () => socket?.off("newNotification");
};
