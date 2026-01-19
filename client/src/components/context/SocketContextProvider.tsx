import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";
import { RootState } from "~/redux/store";
import { updateSuccess } from "~/redux/user/userSlice";
import { SocketContext } from "./SocketContext";
import { IIPAddress } from "~/types";
interface IContextProviderProps {
  children: React.ReactNode;
}
export const SocketContextProvider = ({ children }: IContextProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [onlinePartners, setOnlinePartners] = useState<string[]>([]);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const VITE_SERVER_URL = "http://localhost:5040";
  const connectionId = useMemo(() => {
    return currentUser?._id || localStorage.getItem("guestChatId");
  }, [currentUser]);
  useEffect(() => {
    let newSocket: Socket | undefined;
    if (connectionId) {
      newSocket = io(VITE_SERVER_URL, {
        transports: ["websocket", "polling"],
        withCredentials: true,
        query: {
          user_id: connectionId,
        },
      });
      setSocket(newSocket);
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
      newSocket.on("getOnlinePartners", (partners) => {
        setOnlinePartners(partners);
      });
      newSocket.on(
        "session:updated",
        (data: { ip_addresses: IIPAddress[] }) => {
          if (currentUser && data.ip_addresses) {
            dispatch(
              updateSuccess({
                ...currentUser,
                ip_addresses: data.ip_addresses,
              }),
            );
          }
        },
      );
      newSocket.on(
        "user:banned",
        (data: {
          is_banned: boolean;
          ban_reason: string;
          ban_expires_at: string | null;
        }) => {
          if (currentUser) {
            dispatch(
              updateSuccess({
                ...currentUser,
                is_banned: data.is_banned,
                ban_reason: data.ban_reason,
                ban_expires_at: data.ban_expires_at,
              }),
            );
          }
        },
      );
      newSocket.on(
        "user:unbanned",
        (data: {
          is_banned: boolean;
          ban_reason: null;
          ban_expires_at: null;
        }) => {
          if (currentUser) {
            dispatch(
              updateSuccess({
                ...currentUser,
                is_banned: data.is_banned,
                ban_reason: data.ban_reason,
                ban_expires_at: data.ban_expires_at,
              }),
            );
          }
        },
      );
      newSocket.on(
        "partnerApproved",
        (data: { user: typeof currentUser; showCelebration?: boolean }) => {
          if (currentUser && data.user) {
            dispatch(updateSuccess(data.user));
            if (data.showCelebration) {
              window.location.href = "/settings";
              localStorage.setItem("showPartnerCelebration", "true");
            }
          }
        },
      );
      newSocket.on("partnerRejected", () => {
        if (currentUser) {
          dispatch(
            updateSuccess({
              ...currentUser,
              partner_request_status: "none",
            }),
          );
        }
      });
      return () => {
        newSocket?.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [connectionId]);
  return (
    <SocketContext.Provider value={{ socket, onlineUsers, onlinePartners }}>
      {children}
    </SocketContext.Provider>
  );
};