// src/contexts/SocketContext.ts
import { createContext } from "react";
import { Socket } from "socket.io-client";

export interface IAppContextTypeProps {
  socket: Socket | null;
  onlineUsers: string[];
  onlinePartners: string[];
}

export const SocketContext = createContext<IAppContextTypeProps>(
  {} as IAppContextTypeProps,
);
