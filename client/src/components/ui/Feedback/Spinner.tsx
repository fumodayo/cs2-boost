import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import cn from "~/libs/utils";

const spinnerVariants = cva("animate-spin rounded-full border-solid", {
  variants: {
    size: {
      sm: "h-4 w-4 border-2",
      md: "h-6 w-6 border-4",
      lg: "h-10 w-10 border-4",
    },
    color: {
      primary: "border-primary/20 border-t-primary",
      white: "border-white/20 border-t-white",
      current: "border-current/20 border-t-current",
    },
  },
  defaultVariants: {
    size: "md",
    color: "primary",
  },
});

export type SpinnerProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof spinnerVariants>;

const Spinner = React.memo(
  ({ className, size, color, ...props }: SpinnerProps) => {
    return (
      <div
        role="status"
        className={cn(spinnerVariants({ size, color, className }))}
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  },
);

export default Spinner;