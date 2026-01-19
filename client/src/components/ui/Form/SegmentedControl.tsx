import clsx from "clsx";
import { Button } from "~/components/ui/Button";

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}

const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) => {
  return (
    <div className="flex items-center space-x-1 rounded-lg bg-muted p-1">
      {options.map((option) => (
        <Button
          key={option.value}
          variant="none"
          onClick={() => onChange(option.value)}
          className={clsx(
            "rounded-md px-3 py-1 text-sm font-medium transition-colors",
            value === option.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background/50",
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default SegmentedControl;