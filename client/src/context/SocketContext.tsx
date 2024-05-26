import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import io, { Socket } from "socket.io-client";

type ContextProviderProps = {
  children: React.ReactNode;
};

type AppContextType = {
  socket: Socket | null;
  onlineUsers: string[];
};
const SocketContext = createContext<AppContextType>({} as AppContextType);

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }: ContextProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const VITE_SERVER_URL = `${
    import.meta.env.VITE_SERVER_URL ?? "http://localhost:3000"
  }`;

  useEffect(() => {
    if (currentUser) {
      const newSocket = io(VITE_SERVER_URL, {
        query: {
          userId: currentUser._id,
        },
      });

      setSocket(newSocket);

      // socket.on() is used to listen to the server. can be used both on client and server side
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
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
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
