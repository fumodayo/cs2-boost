import type { IUser } from "./user.types";
import { CONVERSATION_STATUS, ObjectValues } from "./constants";

export interface IMessage {
  _id: string;
  sender: string | IUser;
  receiver?: string | IUser;
  message: string;
  conversation_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IConversation {
  _id: string;
  participants: string[] | IUser[];
  messages: string[] | IMessage[];
  status: ObjectValues<typeof CONVERSATION_STATUS>;
  createdAt: string;
  updatedAt: string;
}

export interface ISendMessagePayload {
  message: string;
  boost_id?: string;
}
