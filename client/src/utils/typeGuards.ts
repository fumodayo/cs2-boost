import { IUser, IAccount, IConversation, IReview } from "~/types";

/**
 * Type guard to check if entity is a populated IUser object
 */
const isUserObject = (
  entity: IUser | string | undefined | null,
): entity is IUser => {
  return !!entity && typeof entity === "object" && "username" in entity;
};

/**
 * Type guard to check if entity is a populated IAccount object
 */
const isAccountObject = (
  entity: IAccount | string | undefined | null,
): entity is IAccount => {
  return !!entity && typeof entity === "object" && "login" in entity;
};

/**
 * Type guard to check if entity is a populated IConversation object
 */
const isConversationObject = (
  entity: IConversation | string | undefined | null,
): entity is IConversation => {
  return !!entity && typeof entity === "object" && "messages" in entity;
};

/**
 * Type guard to check if entity is a populated IReview object
 */
const isReviewObject = (
  entity: IReview | string | undefined | null,
): entity is IReview => {
  return !!entity && typeof entity === "object" && "rating" in entity;
};

/**
 * Safely get user ID from IUser or string
 */
const getUserId = (
  entity: IUser | string | undefined | null,
): string | null => {
  if (!entity) return null;
  if (typeof entity === "string") return entity;
  return entity._id ?? null;
};

/**
 * Check if a value is a non-empty string
 */
const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.length > 0;
};

export {
  isUserObject,
  isAccountObject,
  isConversationObject,
  isReviewObject,
  getUserId,
  isNonEmptyString,
};
