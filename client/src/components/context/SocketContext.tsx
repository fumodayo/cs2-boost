import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";
import { RootState } from "~/redux/store";

interface IContextProviderProps {
  children: React.ReactNode;
}

interface IAppContextTypeProps {
  socket: Socket | null;
  onlineUsers: string[];
  onlinePartners: string[];
}

export const SocketContext = createContext<IAppContextTypeProps>(
  {} as IAppContextTypeProps,
);

export const SocketContextProvider = ({ children }: IContextProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlinePartners, setOnlinePartners] = useState<string[]>([]);

  const { currentUser } = useSelector((state: RootState) => state.user);

  const VITE_SERVER_URL = "http://localhost:5030";

  useEffect(() => {
    if (currentUser) {
      const newSocket = io(VITE_SERVER_URL, {
        transports: ["websocket", "polling"],
        withCredentials: true,
        extraHeaders: {
          "Access-Control-Allow-Origin": "*",
        },
        query: {
          user_id: currentUser._id,
        },
      });

      setSocket(newSocket);

      // socket.on() được dùng để listen từ server. Dùng cho cả bên client và server
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
  
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, onlinePartners }}>
      {children}
    </SocketContext.Provider>
  );
};
