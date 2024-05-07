import { formatDistance } from "date-fns";
import { Message } from "../../types";

export const ReceivedMessage = ({ message }: { message?: Message }) => {
  return (
    <div className="flex justify-start">
      <div className="my-1 flex gap-x-4 px-4 overflow-hidden whitespace-normal rounded-lg border-l-4 border-border/90 bg-background pl-2 font-medium text-foreground">
        <div className="whitespace-pre-wrap p-2 text-sm">
          {message?.message}
        </div>
        {message?.createdAt && (
          <span className="flex justify-end pt-4 text-xs">
            {formatDistance(message.createdAt, new Date())}
          </span>
        )}
      </div>
    </div>
  );
};
