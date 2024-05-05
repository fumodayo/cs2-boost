import { formatDistance } from "date-fns";
import { Message } from "../../types";

export const SentMessage = ({ message }: { message?: Message }) => {
  return (
    <div className="flex justify-end">
      <div className="my-1 flex gap-x-4 overflow-hidden whitespace-normal rounded-lg bg-primary px-2 font-medium text-primary-foreground">
        <div className="whitespace-pre-wrap p-2 text-sm">
          {message?.message}
        </div>
        <span className="flex justify-end pt-4 text-xs text-primary-foreground/75">
          {message?.createdAt && formatDistance(message.createdAt, new Date())}
        </span>
      </div>
    </div>
  );
};
