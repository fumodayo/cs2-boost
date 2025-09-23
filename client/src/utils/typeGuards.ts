import { IUser } from "~/types";

const isUserObject = (
  entity: IUser | string | undefined | null,
): entity is IUser => {
  return !!entity && typeof entity === "object" && "username" in entity;
};

export { isUserObject };
