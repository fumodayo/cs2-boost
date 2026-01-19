import type { IUser } from "./user.types";
import {
  CONVERSATION_STATUS,
  LIVE_CHAT_STATUS,
  ObjectValues,
} from "./constants";

export interface IMessage {
  _id: string;
  sender: string | IUser;
  receiver?: string | IUser;
  message: string;
  images?: string[];
  conversation_id: string;
  createdAt: string;
  updatedAt: string;
  guestEmail?: string;
}

export interface IBotMessage {
  _id: string;
  conversation_id: string;
  role: "user" | "model";
  text: string;
  imageUrl?: string;
  filePreview?: string;
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
  images?: string[];
  boost_id?: string;
  report_id?: string;
}

export interface ILiveChat {
  _id: string;
  user: string | IUser;
  admin: string | IUser | null;
  conversation: string | IConversation;
  subject: string;
  status: ObjectValues<typeof LIVE_CHAT_STATUS>;
  createdAt: string;
  updatedAt: string;
  guestEmail?: string;
}

export interface ICreateLiveChatPayload {
  subject: string;
  message: string;
}
