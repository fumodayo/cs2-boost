import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";
import { RootState } from "~/redux/store";
import { SocketContext } from "./SocketContext";

interface IContextProviderProps {
  children: React.ReactNode;
}

export const SocketContextProvider = ({ children }: IContextProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [onlinePartners, setOnlinePartners] = useState<string[]>([]);

  const { currentUser } = useSelector((state: RootState) => state.user);

  const VITE_SERVER_URL = "http://localhost:5040";

  useEffect(() => {
    if (currentUser) {
      const newSocket = io(VITE_SERVER_URL, {
        transports: ["websocket", "polling"],
        withCredentials: true,
        query: {
          user_id: currentUser._id,
        },
      });

      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      newSocket.on("getOnlinePartners", (partners) => {
        setOnlinePartners(partners);
      });

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, onlinePartners }}>
      {children}
    </SocketContext.Provider>
  );
};
