import type { IUser } from "./user.types";
import { NOTIFY_TYPE, ObjectValues } from "./constants";

export interface INotification {
  _id: string;
  sender?: string | IUser;
  receiver?: string | IUser;
  boost_id?: string;
  report_id?: string;
  title?: string;
  image?: string;
  content: string;
  isRead: boolean;
  type: ObjectValues<typeof NOTIFY_TYPE>;
  createdAt: string;
  updatedAt: string;
}
