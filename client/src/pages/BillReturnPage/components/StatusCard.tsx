import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import cn from "~/libs/utils";

const StatusCard = ({
  status,
  title,
  message,
  children,
}: {
  status: "success" | "failure";
  title: string;
  message: string;
  children: React.ReactNode;
}) => {
  const isSuccess = status === "success";
  return (
    <div className="mx-auto mt-10 max-w-2xl transform transition-all">
      <div className="overflow-hidden rounded-2xl bg-card shadow-lg ring-1 ring-border">
        <div
          className={cn(
            "flex flex-col items-center justify-center p-8 text-center",
            isSuccess
              ? "bg-green-50 dark:bg-green-900/20"
              : "bg-red-50 dark:bg-red-900/20",
          )}
        >
          {isSuccess ? (
            <FaCheckCircle className="h-16 w-16 text-green-500" />
          ) : (
            <FaTimesCircle className="h-16 w-16 text-red-500" />
          )}
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">{message}</p>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default StatusCard;
