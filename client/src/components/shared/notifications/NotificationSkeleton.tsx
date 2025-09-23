const NotificationSkeleton = () => (
  <div className="flex w-full animate-pulse items-center gap-4 p-3">
    <div className="h-10 w-10 shrink-0 rounded-full bg-muted"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 w-3/4 rounded bg-muted"></div>
      <div className="h-3 w-1/2 rounded bg-muted"></div>
    </div>
  </div>
);

export default NotificationSkeleton;
