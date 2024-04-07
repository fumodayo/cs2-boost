export const SentMessage = ({ content }: { content?: string }) => {
  return (
    <div className="flex justify-end">
      <div className="my-1 overflow-hidden whitespace-normal rounded-lg bg-primary px-2 font-medium text-primary-foreground">
        <div className="whitespace-pre-wrap p-2">{content}</div>
      </div>
    </div>
  );
};
