export const ReceivedMessage = ({ content }: { content?: string }) => {
  return (
    <div className="flex justify-start">
      <div className="my-1 overflow-hidden whitespace-normal rounded-lg border-l-4 border-border/90 bg-background pl-2 font-medium text-foreground">
        <div className="whitespace-pre-wrap p-2">{content}</div>
      </div>
    </div>
  );
};
