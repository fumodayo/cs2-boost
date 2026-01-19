import { useContext } from "react";
import { SocketContext } from "~/components/context/SocketContext";

export const useSocketContext = () => useContext(SocketContext);