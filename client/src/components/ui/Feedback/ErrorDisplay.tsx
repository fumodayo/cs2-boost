import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { Button } from "~/components/ui/Button";

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorDisplay = ({
  message = "An unexpected error occurred.",
  onRetry,
}: ErrorDisplayProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center text-destructive">
      <FiAlertTriangle className="h-12 w-12" />
      <h3 className="mt-4 text-xl font-semibold">
        Oops! Something went wrong.
      </h3>
      <p className="mt-2 text-sm text-destructive/80">{message}</p>
      {onRetry && (
        <Button
          size="sm"
          variant="secondary"
          className="mt-6 gap-2"
          onClick={onRetry}
        >
          <FiRefreshCw size={14} />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorDisplay;